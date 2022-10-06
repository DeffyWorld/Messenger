export interface ShouldSetNewDocState {
	shouldSetNewDoc: boolean
}

export interface SearchPanelState {
	searchValue: string,
	shouldSearchPanelRender: boolean
}



export interface AuthorizationFormInputs {
	name: string,
	surname: string,
	email: string,
	password: string,
	passwordConfirm: string
}



export interface ChatFields {
	id: number,
	messages: MessageFields[],
	members?: string[],
	membersData?: MemberFields[]
}
export interface MemberFields {
	displayName: string,
	photo: string,
	uid: string,
	isTyping?: boolean,
	wasOnline?: number,
	email?: string
}
export interface MessageFields {
	content: string,
	time: number,
	from: string,
	type: string,
	readed: boolean,
	displayName?: string,
	photoURL?: string
}