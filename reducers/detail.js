const detail = (state = {

}, action) => {
    switch (action.type) {
        case 'GET':
            var obj = {
                id: action.id,
                firstname: action.firstname,
                midname: action.midname,
                surname: action.surname,
                gender: action.gender,
                birth: action.birth
            }
            return obj
        case 'CLEAR_FORM':
            var obj = {
                id: null,
                firstname: '',
                midname: '',
                surname: '',
                gender: 'Male',
                birth: ''
            }
            return obj
        default:
            return state;
    }
}

export default detail