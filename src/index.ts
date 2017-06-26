import { NewCardReader } from './card-reader';
import { NewMovementSensor } from './movement-sensor';
import { NewStateMachine, State } from './state-machine';
import { NewMembersDb } from './members-db';
import { NewVoice } from './voice';
import { NewAutomation } from './automation';
import { NewLog } from './log';

import { NewAdminPanel } from './admin';
import { NewConfig } from './config';

async function main() {
  const config = NewConfig();

  const cardReader = NewCardReader();
  const movementSensor = await NewMovementSensor();
  const stateMachine = NewStateMachine(config);
  const membersDb = NewMembersDb();
  const voice = NewVoice();
  const automation = await NewAutomation(config);
  const log = NewLog(config);

  const panel = NewAdminPanel(config, membersDb, stateMachine);

  let alarmInterval: NodeJS.Timer | null = null;

  let alarmCount = 0;

  stateMachine.on('stateChange', (oldState, newState) => {
    if (alarmInterval) clearInterval(alarmInterval);

    if (newState === State.ARMING) {
      voice.speak('Alarm is arming', true);
    }

    if (newState === State.ARMED) {
      voice.speak('Alarm is armed', true);

      log.log('Alarm is armed');

      automation.off();
    }

    if (newState === State.PRESOUNDING) {
      voice.speak('Movement detected. Please sign in immediately or alarm will sound', true);

      automation.on();
    }

    if (newState === State.SOUNDING) {
      voice.speak('Intruder alert');

      log.log('Movement detected!');

      alarmCount = 0;

      alarmInterval = setInterval(() => {
        if (alarmCount >= config.alarmSoundCount - 1) {
          return stateMachine.arm();
        }

        voice.speak('Intruder alert');

        alarmCount += 1;
      }, 5000);
    }

    if (newState === State.OCCUPIED) {
      voice.speak('Alarm disarmed', true);

      log.log('Alarm disarmed');

      automation.on();
    }
  });

  movementSensor.on('movement', () => {
    stateMachine.movement();
  });

  cardReader.on('cardRead', swipe);
  panel.on('swipe', swipe);

  stateMachine.arm();

  log.log('System online');

  async function swipe(cardId: string) {
    console.log('SCAN', cardId);

    const member = await membersDb.getByCardId(cardId);

    if (!member) {
      voice.speak('Invalid card detected, please register this card');
      return;
    }

    const cardIds = stateMachine.getSignedInCardIds();

    const signIn = stateMachine.codePresented(member.cardId);

    if (signIn) {
      log.log(`${member.firstName} ${member.lastName} has entered the hackspace`);

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
      log.log(`${member.firstName} ${member.lastName} has left the hackspace`);

      voice.speak(`Goodbye ${member.firstName} ${member.lastName}`);
    }
  }
}

main();
