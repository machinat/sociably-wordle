export default {
  defaultLanguage: 'en',
  languages: ['en'],
  intents: {
    greeting: {
      trainingPhrases: {
        en: [
          'hi',
          'yo',
          'hello',
          'hey',
          'hiya',
          'howdy',
          'hi there',
          'greetings',
          'long time no see',
          'lovely day',
          'hello there',
          'a good day',
        ],
      },
    },

    about: {
      trainingPhrases: {
        en: [
          'what',
          'how',
          "what's this?",
          'what the heck',
          'how can you help me?',
          'who are you?',
          'what can you do?',
          'what should I do',
          'about',
        ],
      },
    },

    yes: {
      trainingPhrases: {
        en: [
          'yes',
          'ok',
          'ya',
          'nice',
          'good',
          'cool',
          'fine',
          "I'd like to",
          'I love to',
        ],
      },
    },

    no: {
      trainingPhrases: {
        en: [
          'no',
          'nope',
          'sorry',
          'later',
          'maybe not',
          'maybe later',
          'not this time',
          'maybe next time',
          'no, thanks',
        ],
      },
    },

    share: {
      trainingPhrases: {
        en: [
          'share',
          'game play',
          'share record',
          'share game',
          'my game today',
          'share game play',
        ],
      },
    },

    stats: {
      trainingPhrases: {
        en: [
          'statistics',
          'stats',
          'history',
          'records',
          'my records',
          'data',
          'past statistics',
        ],
      },
    },

    notify: {
      trainingPhrases: {
        en: [
          'notify',
          'notify me',
          'notify me new game',
          'call me tomorrow',
          'subscribe',
          'subscribe new game',
          'let me know when there is a new game',
        ],
      },
    },

    cancel_notify: {
      trainingPhrases: {
        en: [
          'no notify',
          "don't notify",
          'stop notifying me',
          'cancel notification',
          'no subscribe',
          'cancel subscription',
        ],
      },
    },

    update_notify_time: {
      trainingPhrases: {
        en: [
          'change time',
          'change notify time',
          'update time',
          'set notify time',
          'update alert time',
        ],
      },
    },
  },
};
