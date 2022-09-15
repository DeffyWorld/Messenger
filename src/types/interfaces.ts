export interface AuthorizationFormInputs {
	name: string,
	surname: string,
	email: string,
	password: string,
	passwordConfirm: string
}



export interface ChatFields {
	members: MemberFields[],
	messages: MessageFields[],
	uid: string[]
}
export interface MemberFields {
	displayName: string,
	photo: string,
	uid: string 
}
export interface MessageFields {
	content: string,
	from: string,
	time: number,
	photo: string,
	type: string
}