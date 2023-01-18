import { EnumMessageType, EnumSortParams, EnumThunkStatus } from "./enums"




export interface ChatFields {
	id: number,
	lastTimeMembersRead: any,
	messages: MessageFields[],
	memberData: UserFields
}

export interface UserFields {
	displayName: string,
	photoURL: string,
	uid: string,
	email: string,
	isTyping: boolean
	isOnline: boolean,
	wasOnline?: number
}

export interface MessageFields {
	chatId: number,
	content: string,
	time: number,
	from: string,
	type: EnumMessageType,
	displayName: string,
	photoURL: string,
	lastTimeMembersRead: any,
	minifiedContent?: string,
	contentWidth?: number,
	contentHeight?: number
}



export interface AuthorizationState {
	isLoading: boolean,
	loader: string,
	activeTab: string,
	authorizationStatus: EnumThunkStatus | null,
	authorizationErrors: {
		presence: string | null,
		createUserOrSignIn: string | null,
		authorizationWithGoogle: string | null
	}
}

export interface MainSliceState {
	sortBy: EnumSortParams,
	isDropdownActive: boolean
}

export interface SidebarSliceState {
	isSidebarActive: boolean,
}

export interface SearchSliceState {
	foundChats: ChatFields[],
	foundMessages: MessageFields[],
	searchValue: string
}

export interface ChatSliceState {
	sendMessageStatus: EnumThunkStatus | null
}



export interface AuthorizationFormInputs {
	name: string,
	surname: string,
	email: string,
	password: string,
	passwordConfirm: string
}

export interface ChatInputFields {
	image: any,
	text: string
}