declare module 'rpi-gpio' {
  const DIR_IN = 'in';
  const DIR_OUT = 'out';
  const DIR_LOW = 'low';
  const DIR_HIGH = 'high';

  type DIR = typeof DIR_IN | typeof DIR_OUT | typeof DIR_LOW | typeof DIR_HIGH;

  const MODE_RPI = 'mode_rpi';
  const MODE_BCM = 'mode_bcm';

  type MODE = typeof MODE_RPI | typeof MODE_BCM;

  const EDGE_NONE = 'none';
  const EDGE_RISING = 'rising';
  const EDGE_FALLING = 'falling';
  const EDGE_BOTH = 'both';

  type EDGE = typeof EDGE_NONE | typeof EDGE_RISING | typeof EDGE_FALLING | typeof EDGE_BOTH;

  function on(event: 'change', handler: (channel: number, value: number) => void): void;

  function setup(channel: number, onSetup: () => void): void;
  function setup(channel: number, direction: DIR, onSetup: () => void): void;
  function setup(channel: number, direction: DIR, edge: EDGE): void;
  function setup(channel: number, direction: DIR, edge: EDGE, onSetup: () => void): void;

  function read(channel: number, callback: (err: Error, value: boolean) => void): void;
}

declare module 'piswitch' {
  interface SetupArgs {
    mode: 'sys' | 'gpio',
    pulseLength: number,
    protocol: 1 | 2,
    /**
     * Actual pin number on the board
     */
    pin: number,
  }

  function setup(args: SetupArgs): void;

  function send(code: string): void;
}
