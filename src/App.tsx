import React, { useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from './redux/hooks';

import Chat from './components/Chat';
import Authorization from './pages/Authorization';
import Main from './pages/Main';
import Settings from './pages/Settings';


export default function App() {
	const navigate = useNavigate();
	const { name, surname, email, password } = useAppSelector(state => state.activeUser);

	useEffect(() => {
		if (name === null || surname === null || email === null || password === null) {
			navigate('authorization', { replace: true });
		} 

	}, [navigate, email, name, password, surname])
	


	return (
		<Routes>
			<Route path='/' element={<Main />} >
				{/* <Chat /> */}
			</Route>

			<Route path='authorization' element={<Authorization/>} />

			<Route path='settings' element={<Settings />} />
		</Routes>
	);
}