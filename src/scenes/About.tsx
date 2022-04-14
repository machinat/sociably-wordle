import Machinat, { makeContainer } from '@machinat/core';
import { build } from '@machinat/script';
import * as $ from '@machinat/script/keywords';
import WithYesNoReplies from '../components/WithYesNoReplies';
import useIntent from '../services/useIntent';

type AboutVars = {
  isOk: boolean;
};

export default build<AboutVars>(
  {
    name: 'About',
    initVars: () => ({ isOk: true }),
  },
  <$.BLOCK<AboutVars>>
    {() => (
      <>
        <p>I'm a cloned Wordle bot</p>
        <Machinat.Pause time={1000} />
        <WithYesNoReplies>Do you need more info?</WithYesNoReplies>
      </>
    )}

    <$.PROMPT<AboutVars>
      key="ask-feedback"
      set={makeContainer({ deps: [useIntent] })(
        (getIntent) =>
          async (_, { event }) => {
            const intent = await getIntent(event);
            return { isOk: intent.type !== 'no' };
          }
      )}
    />

    {({ vars }) =>
      vars.isOk ? (
        <p>
          Thanks! You can also find me here:{'\n\n'}
          GitHub 😸{'\n'}
          https://github.com/machinat/wordle-machina{'\n\n'}
          Twitter 🐦{'\n'}
          https://twitter.com/machinatjs
        </p>
      ) : (
        <p>
          Please help us to do better:{'\n\n'}
          Discussions 💬{'\n'}
          https://github.com/machinat/wordle-machina/discussions{'\n\n'}
          Report issues/bugs 🐞{'\n'}
          https://github.com/machinat/wordle-machina/issues/new
        </p>
      )
    }
  </$.BLOCK>
);
