
const picdetails = (state = {}, action) => {
    switch (action.type) {
        case 'GET_PIC':
            return {
                id: action.id,
                src: action.src,
                desc: action.desc,
                likes: action.likes,
                comments_amt: 0
            }
        case 'ADD_COMMENT':
            state.comments_amt += 1
            return state
        case 'CLEAR_PIC':
            return {
                src: '/images/loader.gif'
            }
        default:
            return state
    }
}

export default picdetails