import fs = require('fs');
import path = require('path');
import childProcess = require('child_process');

const CardReaderDevScriptPath = path.join(__dirname, '..', 'card-reader-dev.sh');

interface Events {
  cardRead(cardNumber: string): void;
}

interface CardReader {
  on<K extends keyof Events>(eventType: K, handler: Events[K]): void;
}

const stub = () => void 0;

function NewCardReader(): CardReader {
  const eventHandlers: Events = {
    cardRead: stub,
  };

  let dev: string | null = null;

  try {
    dev = childProcess.execSync(CardReaderDevScriptPath).toString().trim();
  } catch (err) {
    dev = null;
  }

  if (dev) {
    const input = fs.createReadStream(dev);

    let code = '';

    input.on('data', function (chunk: Buffer) {
      for (let i = 0; i < chunk.byteLength; i += 1) {
        const byte = chunk[i];

        if (byte !== 0) {
          let digit = '';

          if (byte === 39) {
            digit = '0';
          } else if (byte === 40) {
            eventHandlers.cardRead(code.trim());
            code = '';
          } else {
            digit = String(byte - 29);
          }

          code += digit;
        }
      }
    });
  } else {
    console.warn('Card reader not available');
  }

  function on<K extends keyof Events>(eventType: K, handler: Events[K]) {
    eventHandlers[eventType] = handler;
  }

  return {
    on,
  };
}

export { NewCardReader };
