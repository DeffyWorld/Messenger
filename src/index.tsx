import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import store from './redux/store';
import { Reset } from 'styled-reset';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { Theme } from './types/theme';
import App from './App';


const container = document.getElementById('root')!;
const root = createRoot(container);


const Global = createGlobalStyle`
	* {
		box-sizing: border-box;
	}
	@font-face {
		font-family: "SFPro";
		font-weight: 400;
		src: url(${require('./assets/fonts/SFPro/SFProDisplay-Regular.woff')}) format("woff"),
			url(${require('./assets/fonts/SFPro/SFProDisplay-Regular.woff2')}) format("woff2");
	}
	@font-face {
		font-family: "SFPro";
		font-weight: 500;
		src: url(${require('./assets/fonts/SFPro/SFProDisplay-Medium.woff')}) format("woff"),
			url(${require('./assets/fonts/SFPro/SFProDisplay-Medium.woff2')}) format("woff2");
	}
	@font-face {
		font-family: "SFPro";
		font-weight: 700;
		src: url(${require('./assets/fonts/SFPro/SFProDisplay-Bold.woff')}) format("woff"),
			url(${require('./assets/fonts/SFPro/SFProDisplay-Bold.woff2')}) format("woff2");
	}
`
const theme: Theme = {
	colors: {
		bgPrimary: '#FFFFFF',
		bgSecondary: '#FAFAFA',
		textPrimary: '#000000',
		textSecondary: '#403A4B'
	},
	media: {
		xxl: "(min-width: 1401px)",
		xl: "(max-width: 1400px)",
		lg: "(max-width: 1200px)",
		md: "(max-width: 992px)",
		sm: "(max-width: 768px)",
		none: "(max-width: 576px)",
		exsm: "(max-width: 380px)"
	}
}


root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme} >
				<Router >
					<Reset />
					<Global />
					<App />
				</Router>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>
);