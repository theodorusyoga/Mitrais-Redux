const picture = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_PIC':
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes,
                comments_amt: action.comments_amt,
                liked: false
            }
        case 'ADD_LIKE':
            if (state.id != action.id)
                return state;
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes + 1,
                comments_amt: action.comments_amt,
                liked: true
            }
        case 'REMOVE_LIKE':
            if (state.id != action.id)
                return state;
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes - 1,
                comments_amt: action.comments_amt,
                liked: false
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
        case 'ADD_LIKE':
            return state.map(item =>
                picture(item, action))
        case 'REMOVE_LIKE':
            return state.map(item =>
                picture(item, action))
        case 'CLEAR_PICTURES':
            return []
        case 'STORE_PICTURES':
            return action.pictures
        default:
            return state;
    }
}

export default pictures