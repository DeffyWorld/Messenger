import React from 'react';
import { createRoot } from 'react-dom/client';

import './firebase';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import { Reset } from 'styled-reset';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Theme } from './types/theme';
import App from './App';



import SFPro400woff from './assets/fonts/SFPro/SFProDisplay-Regular.woff';
import SFPro400woff2 from './assets/fonts/SFPro/SFProDisplay-Regular.woff2';
import SFPro500woff from './assets/fonts/SFPro/SFProDisplay-Medium.woff';
import SFPro500woff2 from './assets/fonts/SFPro/SFProDisplay-Medium.woff2';
import SFPro700woff from './assets/fonts/SFPro/SFProDisplay-Bold.woff';
import SFPro700woff2 from './assets/fonts/SFPro/SFProDisplay-Bold.woff2';
import SFPro800woff from './assets/fonts/SFPro/SFProDisplay-Black.woff';
import SFPro800woff2 from './assets/fonts/SFPro/SFProDisplay-Black.woff2';
import { BrowserRouter } from 'react-router-dom';



const container = document.getElementById('root')!;
const root = createRoot(container);



const Global = createGlobalStyle`
	* {
		box-sizing: border-box;
	}
	html {
		height: 100%;
	}
	body {
		overflow: hidden;
		height: 100%;
	}
	#root {
		height: 100%;
	}

	@font-face {
		font-family: "SFPro";
		font-weight: 400;
		src: url(${SFPro400woff}) format("woff"),
			url(${SFPro400woff2}) format("woff2");
	}
	@font-face {
		font-family: "SFPro";
		font-weight: 500;
		src: url(${SFPro500woff}) format("woff"),
			url(${SFPro500woff2}) format("woff2");
	}
	@font-face {
		font-family: "SFPro";
		font-weight: 700;
		src: url(${SFPro700woff}) format("woff"),
			url(${SFPro700woff2}) format("woff2");
	}
	@font-face {
		font-family: 'SFPro';
		font-weight: 800;
		src: url(${SFPro800woff}) format("woff"),
			url(${SFPro800woff2}) format("woff2");
    }
`

const theme: Theme = {
	colors: {
		authorizationBg: '#e7f6f8',
		authorizationPrimary: '#BEEEE6',
		authorizationSecondary: '#75c3b6',
		authorizationInvalid: '#fba4a4',

		bgPrimary: '#FFFFFF',
		bgSecondary: '#EEEEEE',
		searchPanelBg: '#EEEEEE',
		textPrimary: '#000000',
		textSecondary: '#403A4B',
		messageBg: '#F4F4F7',
		messageFromCurrentUserBg: '#9febe9',
		scrollbarThumb: '#9e9c9d',
		scrollbarTrack: '#d6d4d7',

		disabled: '#b1b1b1',
		status: '#27AE60',
		highlited: '#2D9CDB',
		chatBgHover: '#e6e6e6',
		border: '#e2e2e2'
	},
	media: {
		xxl: "(min-width: 1401px)",
		xl: "(max-width: 1400px)",
		lg: "(max-width: 1200px)",
		md: "(max-width: 992px)",
		sm: "(max-width: 768px)",
		xsm: "(max-width: 576px)",
		xxsm: "(max-width: 460px)",
		xxxsm: "(max-width: 380px)"
	}
}

root.render(
	<React.StrictMode>
		<Provider store={store} >
			<PersistGate loading={null} persistor={persistor} >
				<ThemeProvider theme={theme} >
					<BrowserRouter>
						<Reset />
						<Global />
						<App />
					</BrowserRouter>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);