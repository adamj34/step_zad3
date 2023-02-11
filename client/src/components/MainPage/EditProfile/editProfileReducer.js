function editProfileReducer(state, action) {
	switch (action.type) {
		case 'set_msg':
			return {...state, serverMsg: action.payload}
        case 'set_file':
            return {...state, file: action.payload}
        case 'set_password_confirmation_deletion':
            return {...state, passwordConfirmationDeletion: action.payload}
		default:
			return state
	}
}

export default editProfileReducer