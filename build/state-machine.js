"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State;
(function (State) {
    State[State["UNARMED"] = 0] = "UNARMED";
    State[State["ARMING"] = 1] = "ARMING";
    State[State["ARMED"] = 2] = "ARMED";
    State[State["OCCUPIED"] = 3] = "OCCUPIED";
    State[State["PRESOUNDING"] = 4] = "PRESOUNDING";
    State[State["SOUNDING"] = 5] = "SOUNDING";
})(State || (State = {}));
exports.State = State;
const stub = () => void 0;
function NewStateMachine() {
    let currentState = State.UNARMED;
    const members = [];
    const eventHandlers = {
        stateChange: stub,
    };
    function arm() {
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
    function armComplete() {
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
    function movement() {
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
    function preSoundingTimeout() {
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
    function signIn(member) {
        return changeState(State.OCCUPIED, member);
    }
    function getState() {
        return currentState;
    }
    function getMembers() {
        return members;
    }
    function changeState(newState, member) {
        console.log(`${State[currentState]} => ${State[newState]}`);
        eventHandlers.stateChange(currentState, newState);
        if (newState === State.OCCUPIED) {
            if (!member)
                throw new Error('No member specified');
            members.push(member);
        }
        else {
            members.splice(0);
        }
        return currentState = newState;
    }
    function on(eventType, handler) {
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
exports.NewStateMachine = NewStateMachine;
