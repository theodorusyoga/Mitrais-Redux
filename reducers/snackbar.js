const snackbar = (state = {}, action) => {
    switch (action.type) {
        case 'SHOW_SNACKBAR':
            return {
                isOpen: true,
                message: action.message
            }
        case 'HIDE_SNACKBAR':
            return {
                isOpen: false,
                message: ''
            }
        default:
            return state;
    }
}

export default snackbar