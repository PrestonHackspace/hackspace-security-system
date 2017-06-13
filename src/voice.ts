import path = require('path');
import childProcess = require('child_process');

const SpeechScriptPath = path.join(__dirname, '..', 'speech.sh');

function NewVoice() {
  function speak(text: string) {
    console.log('Speak:', text);

    childProcess.spawn(SpeechScriptPath, [text]).toString().trim();
  }

  return {
    speak,
  };
}

export {
  NewVoice,
};
