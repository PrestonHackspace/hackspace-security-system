import { Config } from './config';

interface Log {
  log(text: string): void;
}

function NewLog(config: Config): Log {
  const url = config.slackHookUrl;

  if (url && config.getEnv() === 'production') {
    const Slack = require('node-slack');

    const slack = new Slack(url);

    function log(text: string) {
      slack.send({ text });
    }

    return {
      log,
    };
  } else {
    return {
      log(text) { console.log('Log:', text); },
    };
  }
}

export {
  Log,
  NewLog,
};
