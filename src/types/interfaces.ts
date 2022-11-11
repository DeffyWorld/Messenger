export interface ShouldSetNewDocState {
	shouldSetNewDoc: boolean,
}

export interface SearchPanelState {
	searchValue: string
}

export interface ChatState {
	isChatOpen: boolean,
	chatWith: string | null,
	chatWithId: number | null,
	focusMessageTimestamp: number | null
}



export interface AuthorizationFormInputs {
	name: string,
	surname: string,
	email: string,
	password: string,
	passwordConfirm: string
}
export interface ChatInputFields {
	image: string,
	text: string
}



export interface ChatFields {
	id: number,
	lastTimeMembersRead: any,
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
	chatId: number,
	content: string,
	time: number,
	from: string,
	type: string,
	email?: string,
	displayName?: string,
	photoURL?: string,
	lastTimeMembersRead?: any
}