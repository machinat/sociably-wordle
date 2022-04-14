import {
  makeFactoryProvider,
  BasicProfiler,
  StateController,
  MachinatUser,
  MachinatProfile,
} from '@machinat/core';

type ProfileCache = {
  profile: MachinatProfile;
};

const useUserProfile =
  (profiler: BasicProfiler, stateController: StateController) =>
  async (user: null | MachinatUser) => {
    if (!user) {
      return null;
    }

    const userState = stateController.userState(user);
    const cached = await userState.get<ProfileCache>('profile_cache');
    if (cached) {
      return cached.profile;
    }

    const profile = await profiler.getUserProfile(user);
    if (profile) {
      await userState.set<ProfileCache>('profile_cache', { profile });
    }

    return profile;
  };

export default makeFactoryProvider({
  deps: [BasicProfiler, StateController],
})(useUserProfile);
