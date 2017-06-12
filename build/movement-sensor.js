"use strict";
// import gpio = require('rpi-gpio');
Object.defineProperty(exports, "__esModule", { value: true });
const stub = () => void 0;
function NewMovementSensor() {
    const eventHandlers = {
        movement: stub,
    };
    // gpio.on('change', function (channel, value) {
    //   eventHandlers.movement();
    // });
    // gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
    setInterval(() => eventHandlers.movement(), 1000);
    function on(eventType, handler) {
        eventHandlers[eventType] = handler;
    }
    return {
        on,
    };
}
exports.NewMovementSensor = NewMovementSensor;
