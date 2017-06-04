// import gpio = require('rpi-gpio');

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

  // gpio.on('change', function (channel, value) {
  //   eventHandlers.movement();
  // });

  // gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);

  setInterval(() => eventHandlers.movement(), 1000);

  function on<K extends keyof Events>(eventType: K, handler: Events[K]) {
    eventHandlers[eventType] = handler;
  }

  return {
    on,
  };
}

export { NewMovementSensor };
