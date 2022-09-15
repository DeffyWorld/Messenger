import 'styled-components';

export interface Theme {
    colors: {
		authorizationBg: string,
		authorizationPrimary: string,
		authorizationSecondary: string,
		authorizationInvalid: string,

		disabled: string,
		bgSecondary: string,
		textPrimary: string,
		textSecondary: string
	}
    
	media: {
		xxl: string,
		xl: string,
		lg: string,
		md: string,
		sm: string,
		none: string,
		exsm: string
	}
}

declare module 'styled-components' {
	export interface DefaultTheme extends Theme {}
}