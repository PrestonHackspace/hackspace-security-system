import fs = require('fs');
import path = require('path');

interface ConfigJson {
  slackHookUrl: string;
  alarmSoundCount: number;
}

interface Config extends ConfigJson {
  getEnv(): 'production' | 'test';
}

function NewConfig(): Config {
  const configPath = path.join(__dirname, '..', 'config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error('Config file not present. Please see README.md');
  }

  const configJson: ConfigJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  function getEnv() {
    return process.env.ENV;
  }

  return {
    ...configJson,
    getEnv,
  };
}

export {
  Config,
  NewConfig,
};
