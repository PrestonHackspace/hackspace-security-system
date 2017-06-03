import { CardReader } from './card-reader';
import { MovementSensor } from './movement-sensor';
import { StateMachine, State } from './state-machine';

const cardReader = CardReader();
const movementSensor = MovementSensor();
const stateMachine = StateMachine();

stateMachine.on('stateChange', (oldState, newState) => {
  if (newState === State.ARMING) {
    setTimeout(() => stateMachine.transition(State.ARMED), 2000);
  }
});

movementSensor.on('movement', () => {
  const state = stateMachine.getState();

  if (state === State.ARMED) {
    console.log('ALERT');
  } else {
    console.log('Movement');
  }
});

cardReader.on('cardRead', (code) => {
  console.log('code', code);

  stateMachine.transition(State.OCCUPIED, code);
});

stateMachine.transition(State.ARMING);
