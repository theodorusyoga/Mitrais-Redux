
const emp = (state = {}, action) => {
    switch (action.type) {
        case 'ADD':
            return {
                id: action.id,
                firstname: action.firstname,
                midname: action.midname,
                surname: action.surname,
                gender: action.gender,
                birth: action.birth
            }
        case 'EDIT':
            if (state.id !== action.id)
                return state;
            return {
                id: action.id,
                firstname: action.firstname,
                midname: action.midname,
                surname: action.surname,
                gender: action.gender,
                birth: action.birth
            }
        case 'DELETE':
            if (state.id !== action.id) {
                return state;
            }
            return {
                id: state.id
            }
        default:
            return state;
    }

}


//load initial data
const emps = (state = [], action) => {
    switch (action.type) {
        case 'ADD':
            return [
                ...state,
                emp(undefined, action)
            ];
        case 'CLEAR':
            return [];
        case 'EDIT':
            return state.map(item => 
                emp(item, action)
            );
        case 'DELETE':
            if (!confirm('Are you sure you want to remove record #' + (action.id) + '?')) {
                return;
            }
            state.map(p => {
                if (p.id !== action.id) {
                    return;
                }
                del(action);
                let index = state.indexOf(p);
                state = [
                    ...state.slice(0, index),
                    ...state.slice(index + 1)
                ];
            }
            );
        default:
            return state;
    }
}


const del = (obj) => {
    NProgress.inc();
    NProgress.inc();
    NProgress.inc();
    $.ajax({
        type: "POST",
        url: 'http://localhost:5000/delete',
        data: {
            ID: obj.id
        },
        dataType: 'json',
        success: function (data) {
            setTimeout(function () {
                NProgress.done();
            }, 200);

        }

    });
}

export default emps