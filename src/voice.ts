function NewVoice() {
  function speak(text: string) {
    console.log('Speak:', text);
  }

  return {
    speak,
  };
}

export {
  NewVoice,
};
