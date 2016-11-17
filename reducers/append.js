const append = (state = [], action) => {
    switch(action.type){
        case 'APPEND':
            return[
                ...state,
                {
                    id: action.id,
                    text: action.text
                }
            ]
        case 'CLEAR_TODO':
            return [];
        default:
            return state;
    }
}

export default append