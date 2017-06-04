import { NewCardReader } from './card-reader';
import { NewMovementSensor } from './movement-sensor';
import { NewStateMachine } from './state-machine';

const cardReader = NewCardReader();
const movementSensor = NewMovementSensor();
const stateMachine = NewStateMachine();

stateMachine.on('stateChange', (oldState, newState) => {

});

movementSensor.on('movement', () => {
  stateMachine.movement();
});

cardReader.on('cardRead', (code) => {
  console.log('code', code);

  stateMachine.signIn(code);
});

stateMachine.arm();
