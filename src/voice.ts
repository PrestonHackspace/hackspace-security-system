import path = require('path');
import childProcess = require('child_process');

const SpeechScriptPath = path.join(__dirname, '..', 'speech.sh');

function NewVoice() {
  let promise = Promise.resolve();
  let proc: childProcess.ChildProcess | null = null;

  function doSpeaking(text: string) {
    return new Promise<void>((resolve, reject) => {
      if (proc) proc.kill('SIGKILL');

      proc = childProcess.spawn(SpeechScriptPath, [text]);

      proc.on('close', resolve);
      proc.on('error', reject);
    });
  }

  function speak(text: string, now = false) {
    console.log('Speak:', text);

    if (now) {
      // Skip the queue and start speaking now
      if (proc) proc.kill('SIGKILL');

      promise = Promise.resolve();
    }

    return promise = promise.then(() => doSpeaking(text));
  }

  return {
    speak,
  };
}

export {
  NewVoice,
};
