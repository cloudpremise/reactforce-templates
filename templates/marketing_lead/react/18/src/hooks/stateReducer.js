let initialState = {};

function stateReducer(state = initialState, action) {
    if(!action.hasOwnProperty("state")){
        action.state = {};
    }
    initialState = Object.assign({}, state, action.state);
    return initialState;
}

export default stateReducer;