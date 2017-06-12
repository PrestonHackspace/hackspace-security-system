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
  signIn(member: string): State;

  getState(): State;
  getMembers(): string[];

  on<K extends keyof Events>(eventType: K, handler: Events[K]): void;
}

const stub = () => void 0;

function NewStateMachine(): StateMachine {
  let currentState = State.UNARMED;
  const members: string[] = [];

  const eventHandlers: Events = {
    stateChange: stub,
  };

  function arm(): State {
    switch (currentState) {
      case State.ARMING:
      case State.ARMED:
      case State.OCCUPIED:
      case State.PRESOUNDING:
      case State.SOUNDING:
        return currentState;

      case State.UNARMED:
        setTimeout(armComplete, 2000);
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
        setTimeout(preSoundingTimeout, 10000);
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

  function signIn(member: string): State {
    return changeState(State.OCCUPIED, member);
  }

  function getState() {
    return currentState;
  }

  function getMembers() {
    return members;
  }

  function changeState(newState: State, member?: string) {
    console.log(`${State[currentState]} => ${State[newState]}`);

    eventHandlers.stateChange(currentState, newState);

    if (newState === State.OCCUPIED) {
      if (!member) throw new Error('No member specified');

      members.push(member);
    } else {
      members.splice(0);
    }

    return currentState = newState;
  }

  function on<K extends keyof Events>(eventType: K, handler: Events[K]) {
    eventHandlers[eventType] = handler;
  }

  return {
    arm,
    movement,
    signIn,
    getState,
    getMembers,
    on,
  };
}

export {
  State,
  StateMachine,
  NewStateMachine,
};
