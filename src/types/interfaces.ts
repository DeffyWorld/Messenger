export interface ShouldSetNewDocState {
	shouldSetNewDoc: boolean
}



export interface AuthorizationFormInputs {
	name: string,
	surname: string,
	email: string,
	password: string,
	passwordConfirm: string
}



export interface MemberFields {
	displayName: string,
	photo: string,
	uid: string 
}
export interface MessageFields {
	content: string,
	time: number,
	from: string,
	type: string,
	displayName?: string,
	photoURL?: string
}