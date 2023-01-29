import { EnumMessageType, EnumSortParams, EnumThunkStatus } from "./enums"




export interface ChatFields {
	id: number,
	members?: string[],
	lastTimeMembersRead: any,
	lastMessage: MessageFields | null,
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
export interface StatusField {
	email: string,
	isOnline: boolean,
	wasOnline: number
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
	chatsData: ChatFields[] | null,
	membersData: UserFields[] | null,
	membersStatus: StatusField[] | null,
	sortBy: EnumSortParams,
	isDropdownActive: boolean
}

export interface SidebarSliceState {
	isSidebarActive: boolean,
}

export interface SearchSliceState {
	foundUsers: UserFields[] | undefined,
	foundMessages: MessageFields[] | undefined,
	findUsersStatus: EnumThunkStatus | null,
	findMessagesStatus: EnumThunkStatus | null,
	findOrCreateChatStatus: EnumThunkStatus | null,
	isSearchValueEmpty: boolean
}

export interface ChatSliceState {
	isChatOpen: boolean,
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



export interface ImageResolution {
	imageWidth: number;
	imageHeight: number;
}