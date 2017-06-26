import { Config } from './config';

enum State {
  UNARMED,
  ARMING,
  ARMED,
  OCCUPIED,
  PRESOUNDING,
  SOUNDING,
}

interface Events {
  stateChange(oldState: State, newState: State): void;
}

interface StateMachine {
  arm(): State;
  movement(): State;
  codePresented(member: string): boolean;

  getState(): State;
  getSignedInCardIds(): string[];

  on<K extends keyof Events>(eventType: K, handler: Events[K]): void;
}

const stub = () => void 0;

function NewStateMachine(config: Config): StateMachine {
  let currentState = State.UNARMED;
  const signedInCardIds: string[] = [];

  const eventHandlers: Events = {
    stateChange: stub,
  };

  function arm(): State {
    switch (currentState) {
      case State.ARMING:
      case State.ARMED:
      case State.PRESOUNDING:
        return currentState;

      case State.SOUNDING:
      case State.OCCUPIED:
      case State.UNARMED:
        setTimeout(armComplete, config.armingTime);
        signedInCardIds.splice(0);
        return changeState(State.ARMING);
    }
  }

  function armComplete(): State {
    switch (currentState) {
      case State.UNARMED:
      case State.OCCUPIED:
      case State.PRESOUNDING:
      case State.ARMED:
      case State.SOUNDING:
        return currentState;

      case State.ARMING:
        return changeState(State.ARMED);
    }
  }

  function movement(): State {
    switch (currentState) {
      case State.UNARMED:
      case State.ARMING:
      case State.OCCUPIED:
      case State.PRESOUNDING:
      case State.SOUNDING:
        return currentState;

      case State.ARMED:
        setTimeout(preSoundingTimeout, config.presoundingTime);
        return changeState(State.PRESOUNDING);
    }
  }

  function preSoundingTimeout(): State {
    switch (currentState) {
      case State.UNARMED:
      case State.OCCUPIED:
      case State.ARMING:
      case State.ARMED:
      case State.SOUNDING:
        return currentState;

      case State.PRESOUNDING:
        return changeState(State.SOUNDING);
    }
  }

  function codePresented(cardId: string): boolean {
    if (signedInCardIds.indexOf(cardId) === -1) {
      signIn(cardId);

      return true;
    } else {
      signOut(cardId);

      return false;
    }
  }

  function signIn(cardId: string): State {
    signedInCardIds.push(cardId);

    if (signedInCardIds.length === 1) {
      return changeState(State.OCCUPIED);
    } else {
      return currentState;
    }
  }

  function signOut(cardId: string): State {
    console.log(signedInCardIds);

    signedInCardIds.splice(signedInCardIds.indexOf(cardId), 1);

    console.log(signedInCardIds);

    if (signedInCardIds.length === 0) {
      return arm();
    } else {
      return currentState;
    }
  }

  function getState() {
    return currentState;
  }

  function getSignedInCardIds() {
    return signedInCardIds.slice(0);
  }

  function changeState(newState: State) {
    console.log(`${State[currentState]} => ${State[newState]}`);

    eventHandlers.stateChange(currentState, newState);

    return currentState = newState;
  }

  function on<K extends keyof Events>(eventType: K, handler: Events[K]) {
    eventHandlers[eventType] = handler;
  }

  return {
    arm,
    movement,
    codePresented,
    getState,
    getSignedInCardIds,
    on,
  };
}

export {
  State,
  StateMachine,
  NewStateMachine,
};
