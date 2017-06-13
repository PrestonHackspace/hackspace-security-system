import Slack = require('node-slack');

const HookUrl = 'https://hooks.slack.com/services/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';

const slack = new Slack(HookUrl);

function NewLog() {
  function log(text: string) {
    slack.send({
      text,
    });
  }

  return {
    log,
  };
}

export {
  NewLog,
};
