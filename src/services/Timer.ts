import {
  makeClassProvider,
  StateController,
  BasicBot,
} from '@machinat/core';
import Script from '@machinat/script';
import{ GameChannel} from '../types'

type TimingData = {
  channel: GameChannel;
  tag?: string;
};

type IndexData = {
  tz: number;
  hr: number;
};

const TIME_FRAME = 60000;
const CHECK_INTERVAL = TIME_FRAME / 2;

type TimeUpListener = (targets: TimingData[]) => void;

const getTimeFrame = (tz: number, hour: number) =>
  Math.floor((((hour - tz + 24) % 24) * 3600000) / TIME_FRAME);

const getFrameId = (i: number) => `timer:${i}`;

const getRegisterKey = (channel: GameChannel, tag?: string) =>
  tag ? `${channel.uid}-${tag}` : channel.uid;

const INDEX_KEY = 'timer:index';

export class Timer {
  stateController: StateController;
  private _intervalId: null | NodeJS.Timeout;
  private _listeners: TimeUpListener[];
  private _currentFrame: number;

  constructor(stateController: StateController) {
    this.stateController = stateController;
    this._listeners = [];
  }

  start(): void {
    this._intervalId = setInterval(
      this._handleTimesUp.bind(this),
      CHECK_INTERVAL
    );
  }

  stop(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  async getRegisteredTimer(
    channel: GameChannel,
    tag?: string
  ): Promise<null | { timezone: number; hour: number }> {
    const index = await this.stateController
      .globalState(INDEX_KEY)
      .get<IndexData>(getRegisterKey(channel, tag));

    return index ? { timezone: index.tz, hour: index.hr } : null;
  }

  async registerTimer(
    channel: GameChannel,
    timezone: number,
    hour: number,
    tag?: string
  ): Promise<boolean> {
    const frame = getTimeFrame(timezone, hour);
    const frameId = getFrameId(frame);
    const key = getRegisterKey(channel, tag);
    let originalIdx: undefined | IndexData;

    await this.stateController
      .globalState(INDEX_KEY)
      .update<IndexData>(key, (idx) => {
        originalIdx = idx;
        return { tz: timezone, hr: hour };
      });

    if (originalIdx) {
      const originalFrame = getTimeFrame(originalIdx.tz, originalIdx.hr);
      if (originalFrame !== frame) {
        await this.stateController
          .globalState(getFrameId(originalFrame))
          .delete(key);
      }
    }

    await this.stateController.globalState(frameId).set<TimingData>(key, {
      channel,
      tag,
    });

    return !!originalIdx;
  }

  async cancelTimer(channel: GameChannel, tag?: string): Promise<boolean> {
    const key = getRegisterKey(channel, tag);
    let index
    
    await this.stateController
      .globalState(INDEX_KEY)
      .update<IndexData>(key,existedIdx => {
        index = existedIdx
        return undefined
      });
    if (!index) {
      return false;
    }

    const frame = getTimeFrame(index.tz, index.hr);
    const isDeleted = await this.stateController
      .globalState(getFrameId(frame))
      .delete(getRegisterKey(channel, tag));

    return isDeleted;
  }

  onTimesUp(listener: TimeUpListener): void {
    this._listeners.push(listener);
  }

  private async _handleTimesUp() {
    const frameToExec = getTimeFrame(0, (Date.now()%86400000)/3600000);
    if (
      frameToExec !== 0
        ? this._currentFrame >= frameToExec
        : this._currentFrame === 0
    ) {
      return;
    }
    this._currentFrame = frameToExec;

    const frameState = this.stateController.globalState(
      getFrameId(frameToExec)
    );

    const timingChats = await frameState.getAll<TimingData>();
    if (timingChats.size === 0) {
      return;
    }

    const targets = [...timingChats.values()];
    for (const listener of this._listeners) {
      listener(targets);
    }

  }
}

export default makeClassProvider({
  lifetime: 'singleton',
  deps: [StateController, Script.Processor, BasicBot],
})(Timer);
