const comment = (state = {

}, action) => {
    switch (action.type) {
        case 'EDIT_COMMENT':
            var obj = {
                id: action.id,
                text: action.text,
                type: 'EDIT'
            }
            return obj
        case 'CANCEL_COMMENT':
            var obj = {
                id: action.id,
                text: action.text,
                type: 'CANCEL'
            }
            return obj
        case 'CLEAR_COMMENT':
            var obj = {
                id: null,
                text: ''
            }
            return obj
        case 'RESET_COMMENT_EDIT':
            return {}
        default:
            return state;
    }
}

export default comment