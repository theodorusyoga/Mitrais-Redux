const picture = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_PIC':
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes,
                comments_amt: action.comments_amt
            }
        case 'ADD_LIKE':
            if (state.id != action.id)
                return state;
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes + 1,
                comments_amt: action.comments_amt
            }
    }
}

const pictures = (state = [], action) => {
    switch (action.type) {
        case 'ADD_PIC':
            return [
                ...state,
                picture(undefined, action)
            ]
        case 'GET_PIC':
            var find = state.find(x => x.id == action.id)
            return find
        case 'RESET_PIC':
            return [];
        case 'ADD_LIKE':
            return state.map(item =>
                picture(item, action))
        default:
            return state;
    }
}

export default pictures