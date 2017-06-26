import { Config } from './config';

function NewLog(config: Config) {
  const Slack = require('node-slack');

  const slack = new Slack(config.getSlackHookUrl());

  function log(text: string) {
    if (config.getEnv() === 'production') {
      slack.send({
        text,
      });
    }
  }

  return {
    log,
  };
}

export {
  NewLog,
};
