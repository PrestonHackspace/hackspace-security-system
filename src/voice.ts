import path = require('path');
import childProcess = require('child_process');

const SpeechScriptPath = path.join(__dirname, '..', 'speech.sh');

function NewVoice() {
  let promise = Promise.resolve();

  function doSpeaking(text: string) {
    return new Promise<void>((resolve, reject) => {
      console.log('Speak:', text);

      const proc = childProcess.spawn(SpeechScriptPath, [text]);

      proc.on('close', resolve);
      proc.on('error', reject);
    });
  }

  function speak(text: string) {
    return promise = promise.then(() => doSpeaking(text));
  }

  return {
    speak,
  };
}

export {
  NewVoice,
};
