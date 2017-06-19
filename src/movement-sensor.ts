import gpio = require('rpi-gpio');

const Pin = 26;   // PIN NUMBER! (NOT BCM)

interface Events {
  movement(): void;
}

interface MovementSensor {
  on<K extends keyof Events>(eventType: K, handler: Events[K]): void;
}

const stub = () => void 0;

function NewMovementSensor(): MovementSensor {
  const eventHandlers: Events = {
    movement: stub,
  };

  gpio.on('change', (channel, value) => {
    if (channel === Pin) eventHandlers.movement();
  });

  gpio.setup(Pin, gpio.DIR_IN, gpio.EDGE_RISING);

  function on<K extends keyof Events>(eventType: K, handler: Events[K]) {
    eventHandlers[eventType] = handler;
  }

  return {
    on,
  };
}

export { NewMovementSensor };
