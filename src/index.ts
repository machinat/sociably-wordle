import { ServiceScope } from '@machinat/core/service';
import { fromApp, Stream } from '@machinat/stream';
import Timer from './services/Timer';
import main from './main';
import createApp from './app';
import {AppEventContext} from './types';

const app = createApp();
app
  .start()
  .then(() => {
    
    const event$: Stream<AppEventContext> = fromApp(app);
    const [timer]=app.useServices([Timer])
    
    timer.onTimesUp((targets) => {
      const [scope] = app.useServices([ServiceScope]);

      
      for (const {channel, tag} of targets) {
        const { platform } = channel;
        event$.next({
          key: channel.uid,
          scope,
          value: {
            platform,
            event: {
              platform, 
              category: 'app',
              type: 'notify', 
              payload: null,
              channel,
              user: null,
            },
          },

        })
      }
    })
    timer.start()
    
    main(event$);
  })
  .catch(console.error);
