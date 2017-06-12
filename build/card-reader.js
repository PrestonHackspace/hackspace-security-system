"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const CardReaderDevScriptPath = path.join(__dirname, '..', 'card-reader-dev.sh');
const stub = () => void 0;
function NewCardReader() {
    const eventHandlers = {
        cardRead: stub,
    };
    let dev = null;
    try {
        dev = childProcess.execSync(CardReaderDevScriptPath).toString().trim();
    }
    catch (err) {
        dev = null;
    }
    if (!dev)
        throw new Error('Card reader not available');
    const input = fs.createReadStream(dev);
    let code = '';
    input.on('data', function (chunk) {
        for (let i = 0; i < chunk.byteLength; i += 1) {
            const byte = chunk[i];
            if (byte !== 0) {
                let digit = '';
                if (byte === 39) {
                    digit = '0';
                }
                else if (byte === 40) {
                    eventHandlers.cardRead(code.trim());
                }
                else {
                    digit = String(byte - 29);
                }
                code += digit;
            }
        }
    });
    function on(eventType, handler) {
        eventHandlers[eventType] = handler;
    }
    return {
        on,
    };
}
exports.NewCardReader = NewCardReader;
