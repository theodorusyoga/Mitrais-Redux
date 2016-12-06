const editcomment = (state = { }, action) => {
    switch (action.type) {
        case 'EDIT_COMMENT':
            var obj = {
                id: action.id,
                text: action.text,
                type: 'EDIT'
            };
            return obj;
        case 'CANCEL_COMMENT':
            var cancelaction = {
                id: action.id,
                text: action.text,
                type: 'CANCEL'
            };
            return cancelaction;
        case 'CLEAR_COMMENT':
            var clearedobj = {
                id: null,
                text: ''
            };
            return clearedobj;
        case 'INITIATE_SAVE_COMMENT':
            return {
                id: action.id,
                type: 'SAVE'
            };
        case 'SAVE_COMMENT':
            return {}; //remove status
        case 'RESET_COMMENT_EDIT':
            return {};
        default:
            return state;
    }
};

export default editcomment;
