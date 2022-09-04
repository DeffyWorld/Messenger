// Main

export enum EnumSortParams {
	Newest = 'Newest',
	Alphabet = 'Alphabet'
}



// Authorization

export interface AuthorizationFormInputs {
	name: string,
	surname: string,
	email: string,
	password: string,
	passwordConfirm: string
}