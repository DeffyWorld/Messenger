import { EnumSortParams } from "./enums"



export interface AuthorizationState {
	isLoading: boolean,
	loader: string,
	activeTab: string,
	authorizationErrors: {
		presence: string | null,
		createUserOrSignIn: string | null,
		authorizationWithGoogle: string | null
	}
}

export interface MainSliceState {
	sortBy: EnumSortParams,
	isChatOpen: boolean,
	isSideBarActive: boolean,
	isDropdownActive: boolean
}

export interface SearchPanelState {
	searchValue: string
}

export interface ChatState {
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