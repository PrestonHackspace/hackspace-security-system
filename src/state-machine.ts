enum State {
  UNARMED,
  ARMING,
  ARMED,
  OCCUPIED,
}

interface Events {
  stateChange(oldState: State, newState: State): void;
}

interface StateMachine {
  transition(newState: State, member?: string): State;
  getState(): State;
  getMembers(): string[];

  on<K extends keyof Events>(eventType: K, handler: Events[K]): void;
}

const stub = () => void 0;

function StateMachine(): StateMachine {
  let currentState = State.UNARMED;
  const members: string[] = [];

  const eventHandlers: Events = {
    stateChange: stub,
  };

  function transition(newState: State, member?: string) {
    switch (currentState) {
      case State.UNARMED:

        switch (newState) {
          case State.ARMING:
            return changeState(newState);
        }

        break;

      case State.ARMING:

        switch (newState) {
          case State.ARMED:
            return changeState(newState);
        }

        break;

      case State.ARMED: {

        switch (newState) {
          case State.OCCUPIED:
            return changeState(newState, member);
        }

        break;
      }
    }

    throw new Error(`Invalid transition: ${State[currentState]} => ${State[newState]}`);
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
    transition,
    getState,
    getMembers,
    on,
  };
}

export {
  State,
  StateMachine,
};
