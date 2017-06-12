import { NewCardReader } from './card-reader';
import { NewMovementSensor } from './movement-sensor';
import { NewStateMachine, State } from './state-machine';
import { NewMembersDb } from './members-db';
import { NewVoice } from './voice';

const cardReader = NewCardReader();
const movementSensor = NewMovementSensor();
const stateMachine = NewStateMachine();
const membersDb = NewMembersDb();
const voice = NewVoice();

stateMachine.on('stateChange', (oldState, newState) => {
  if (newState === State.PRESOUNDING) {
    voice.speak('Please sign in');
  }

  if (newState === State.SOUNDING) {
    voice.speak('Intruder alert');
  }
});

movementSensor.on('movement', () => {
  stateMachine.movement();
});

cardReader.on('cardRead', (cardId) => {
  console.log('code', cardId);

  const member = membersDb.getByCardId(cardId);

  if (member) {
    stateMachine.signIn(member.cardId);
  }

  voice.speak('Invalid card detected');
});

stateMachine.arm();
