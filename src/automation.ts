import piswitch = require('piswitch');
import childProcess = require('child_process');

function NewAutomation() {
  childProcess.execSync('gpio export 17 out');

  piswitch.setup({
    mode: 'sys', // alternative: change to gpio and use root
    pulseLength: 200, // this works for me, but 350 is very common
    protocol: 1,
    pin: 17,   // BCM GPIO NUMBER!
  });

  function send(code: string) {
    for (let i = 0; i < 5; i += 1) {
      piswitch.send(code);
      // console.log(code, i);
    }
  }

  function on() {
    // process.nextTick(() => send('001001110000101010000111'));
    process.nextTick(() => send('001001110000101010001111'));
  }


  function off() {
    // process.nextTick(() => send('001001110000101010000110'));
    process.nextTick(() => send('001001110000101010001110'));
  }

  return {
    on,
    off,
  };
}

export {
  NewAutomation,
};
