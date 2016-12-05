const login = (state = {}, action) => {
    switch (action.type) {
        case 'GET_ACCESSTOKEN':
            return {
                username: action.username,
                password: action.password,
                fullname: action.fullname,
                accesstoken: action.accesstoken,
                expires: action.expires
            }
        case 'CLEAR_CREDENTIAL':
            return {}
        default:
            return state
    }
}

export default login