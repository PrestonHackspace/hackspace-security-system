import { NewCardReader } from './card-reader';
import { NewMovementSensor } from './movement-sensor';
import { NewStateMachine, State } from './state-machine';
import { NewMembersDb } from './members-db';
import { NewVoice } from './voice';
import { NewAutomation } from './automation';

import { NewAdminPanel } from './admin';

const cardReader = NewCardReader();
const movementSensor = NewMovementSensor();
const stateMachine = NewStateMachine();
const membersDb = NewMembersDb();
const voice = NewVoice();
const automation = NewAutomation();

NewAdminPanel(membersDb);

let alarmInterval: NodeJS.Timer | null = null;

stateMachine.on('stateChange', (oldState, newState) => {
  if (alarmInterval) clearInterval(alarmInterval);

  if (newState === State.ARMING) {
    voice.speak('Alarm is arming');
  }

  if (newState === State.ARMED) {
    voice.speak('Alarm is armed');

    automation.off();
  }

  if (newState === State.PRESOUNDING) {
    voice.speak('Movement detected. Please sign in immediately or alarm will sound');

    automation.on();
  }

  if (newState === State.SOUNDING) {
    voice.speak('Intruder alert');

    alarmInterval = setInterval(() => {
      voice.speak('Intruder alert');
    }, 5000);
  }

  if (newState === State.OCCUPIED) {
    voice.speak('Alarm disarmed');
  }
});

movementSensor.on('movement', () => {
  stateMachine.movement();
});

cardReader.on('cardRead', async (cardId) => {
  console.log('SCAN', cardId);

  const member = await membersDb.getByCardId(cardId);

  if (!member) {
    voice.speak('Invalid card detected, please register this card');
    return;
  }

  const cardIds = stateMachine.getSignedInCardIds();

  const signIn = stateMachine.codePresented(member.cardId);

  if (signIn) {
    voice.speak(`Welcome to the hackspace ${member.firstName} ${member.lastName}`);

    if (cardIds.length) {
      const members = await Promise.all(cardIds.map(membersDb.getByCardId));

      const names = members.map((member, index) => {
        if (!member) return 'Unknown';

        return (members.length > 1 && index === members.length - 1 ? 'and ' : '') + `${member.firstName} ${member.lastName}`;
      }).join(', ');

      voice.speak(`${names} ${members.length > 1 ? 'are' : 'is'} also here`);
    }
  } else {
    voice.speak(`Goodbye ${member.firstName} ${member.lastName}`);
  }
});

stateMachine.arm();
