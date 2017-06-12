"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_reader_1 = require("./card-reader");
const movement_sensor_1 = require("./movement-sensor");
const state_machine_1 = require("./state-machine");
const members_db_1 = require("./members-db");
const voice_1 = require("./voice");
const admin_1 = require("./admin");
const cardReader = card_reader_1.NewCardReader();
const movementSensor = movement_sensor_1.NewMovementSensor();
const stateMachine = state_machine_1.NewStateMachine();
const membersDb = members_db_1.NewMembersDb();
const voice = voice_1.NewVoice();
admin_1.NewAdminPanel(membersDb);
let alarmInterval = null;
stateMachine.on('stateChange', (oldState, newState) => {
    if (alarmInterval)
        clearInterval(alarmInterval);
    if (newState === state_machine_1.State.ARMING) {
        voice.speak('Alarm is arming');
    }
    if (newState === state_machine_1.State.ARMED) {
        voice.speak('Alarm is armed');
    }
    if (newState === state_machine_1.State.PRESOUNDING) {
        voice.speak('Movement detected. Please sign in immediate or alarm will sound');
    }
    if (newState === state_machine_1.State.SOUNDING) {
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
