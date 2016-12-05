
const picdetails = (state = {}, action) => {
    switch (action.type) {
        case 'GET_PIC':
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes,
                liked: action.liked,
                comments_amt: 0
            }
        case 'GET_COMMENTS': {
            return Object.assign({}, state, {
                comments_amt: action.comments_amt
            })
        }
        case 'ADD_COMMENT':
            return Object.assign({}, state, {
                comments_amt: state.comments_amt + 1
            })
        case 'CLEAR_PIC':
            return {
                id: 0,
                desc: 'Loading...',
                likes: 0,
                liked: false,
                comments_amt: 0,
                src: '/images/loader.gif'
            }
        case 'ADD_LIKE_PIC':
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes + 1,
                liked: true,
                comments_amt: action.comments_amt
            }
        case 'REMOVE_LIKE_PIC':
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes - 1,
                liked: false,
                comments_amt: action.comments_amt
            }
        case 'REMOVE_COMMENT':
            return Object.assign({}, state, {
                comments_amt: state.comments_amt - 1
            })

        default:
            return state
    }
}

export default picdetails