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
        case 'ADD_COMMENT':
            return [
                ...state,
                comment(undefined, action)
            ]
        case 'RESET_COMMENT':
            return []
        default:
            return state;
    }
}

export default comments