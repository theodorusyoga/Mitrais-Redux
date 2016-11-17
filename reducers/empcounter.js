const empcounter = (state = {
    total: 0,
    totalMale: 0,
    totalFemale: 0
}, action) => {
    switch (action.counter) {
        case 'ADD_MALE':
            return {
                total: state.total + 1,
                totalMale: state.totalMale + 1,
                totalFemale: state.totalFemale
            }
        case 'ADD_FEMALE':
            return {
                total: state.total + 1,
                totalMale: state.totalMale,
                totalFemale: state.totalFemale + 1
            }
        case 'DELETE_MALE':
            return {
                total: state.total -  1,
                totalMale: state.totalMale - 1,
                totalFemale: state.totalFemale
            }
        case 'DELETE_FEMALE':
            return {
                total: state.total - 1,
                totalMale: state.totalMale,
                totalFemale: state.totalFemale - 1
            }
        //return state + 1;
        // case 'DELETE':
        //     return state- 1;
        default:
            return state;
    }
};

export default empcounter;