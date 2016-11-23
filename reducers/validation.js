const login = (state = {}, action) => {
    switch(action.type){
        case 'GET_ACCESSTOKEN':
            return{
                username: action.username,
                password: action.password,
                accesstoken: action.accesstoken,
                expires: action.expires
            }
        default: 
            return state
    }
}

export default login