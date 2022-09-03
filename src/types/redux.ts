// ActiveUser

export interface activeUserState {
    displayName: string | null
	email: string | null,
	uid: string | null
}
export interface activeUserPayload {
    displayName: string,
	email: string,
	uid: string 
}