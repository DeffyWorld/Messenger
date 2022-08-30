import React from 'react';

import { Route, Routes } from 'react-router-dom';

import Chat from './components/Chat';
import Authorization from './pages/Authorization';
import Main from './pages/Main';
import Settings from './pages/Settings';


export default function App() {
	return (
		<Routes>
			<Route path='/' element={<Main />} >
				{/* <Chat /> */}
			</Route>

			<Route path='authorization' element={<Authorization/>} >
				<Route path=':logIn' element={<Authorization/>} />
				<Route path=':signIn' element={<Authorization/>} />
			</Route>

			<Route path='settings' element={<Settings />} />
		</Routes>
	);
}