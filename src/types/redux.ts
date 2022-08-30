// ActiveUser

export interface activeUserState {
    name: string | null,
	surname: string | null,
	email: string | null,
	password: string | null
}
export interface activeUserPayload {
    name: string,
	surname: string,
	email: string,
	password: string
}