import { NewCardReader } from './card-reader';
import { NewMovementSensor } from './movement-sensor';
import { NewStateMachine, State } from './state-machine';
import { NewMembersDb } from './members-db';
import { NewVoice } from './voice';

import { NewAdminPanel } from './admin';

const cardReader = NewCardReader();
const movementSensor = NewMovementSensor();
const stateMachine = NewStateMachine();
const membersDb = NewMembersDb();
const voice = NewVoice();

NewAdminPanel(membersDb);

let alarmInterval: NodeJS.Timer | null = null;

stateMachine.on('stateChange', (oldState, newState) => {
  if (alarmInterval) clearInterval(alarmInterval);

  if (newState === State.ARMING) {
    voice.speak('Alarm is arming');
  }

  if (newState === State.ARMED) {
    voice.speak('Alarm is armed');
  }

  if (newState === State.PRESOUNDING) {
    voice.speak('Movement detected. Please sign in immediate or alarm will sound');
  }

  if (newState === State.SOUNDING) {
    voice.speak('Intruder alert');

    alarmInterval = setInterval(() => {
      voice.speak('Intruder alert');
    }, 3000);
  }
});

movementSensor.on('movement', () => {
  stateMachine.movement();
});

cardReader.on('cardRead', async (cardId) => {
  const member = await membersDb.getByCardId(cardId);

  if (!member) {
    voice.speak('Invalid card detected, please register this card');
    return;
  }

  stateMachine.signIn(member.cardId);
});

stateMachine.arm();
