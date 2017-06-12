"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function NewVoice() {
    function speak(text) {
        console.log('Speak:', text);
    }
    return {
        speak,
    };
}
exports.NewVoice = NewVoice;
