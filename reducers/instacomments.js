const comment = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_COMMENT':
            return {
                id: action.id,
                text: action.text,
                pictureid: action.pictureid,
                time: action.time,
                name: action.name
            };
        case 'SAVE_COMMENT':
            if (state.id !== action.id) {
                return state;
            }
            return Object.assign({}, state, {
                text: action.text //set new comment text
            });
        default:
            return state;
    }
};

const comments = (state = [], action) => {
    switch (action.type) {
        case 'GET_COMMENTS':
            return action.comments;
        case 'ADD_COMMENT':
            return [
                ...state,
                comment(undefined, action)
            ];
        case 'RESET_COMMENT':
            return [];
        case 'REMOVE_COMMENT':
            let index = state.findIndex(p => p.id === action.id);
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1)
            ];
        case 'SAVE_COMMENT':
            return state.map(item =>
                comment(item, action));
        default:
            return state;
    }
};

export default comments;
