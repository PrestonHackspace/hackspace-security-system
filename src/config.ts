interface Config {
  getEnv(): 'production' | 'test';
  getSlackHookUrl():string;
}

function NewConfig(): Config {
  function getEnv() {
    return process.env.ENV;
  }

  function getSlackHookUrl() {
    return 'https://hooks.slack.com/services/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';
  }

  return {
    getEnv,
    getSlackHookUrl,
  };
}

export {
  Config,
  NewConfig,
};
