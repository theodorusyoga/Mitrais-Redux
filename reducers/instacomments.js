const comment = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_COMMENT':
            return {
                id: action.id,
                text: action.text,
                pictureid: action.pictureid,
                time: action.time,
                name: action.name
            }

        default:
            return state
    }
}

const comments = (state = [], action) => {
    switch (action.type) {
        case 'GET_COMMENTS':
            return action.comments
        case 'ADD_COMMENT':
            return [
                ...state,
                comment(undefined, action)
            ]
        case 'RESET_COMMENT':
            return []
        case 'REMOVE_COMMENT':
            let index = state.findIndex(p => p.id == action.id)
            return [
                ...state.slice(0, index),
                ...state.slice(index+1)
            ]
            
        default:
            return state;
    }
}

export default comments