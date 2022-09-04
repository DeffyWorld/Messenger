import React, { useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from './redux/hooks';

import Chat from './components/Chat';
import Authorization from './pages/Authorization';
import Main from './pages/Main';
import Settings from './pages/Settings';
import { getAuth } from 'firebase/auth';


export default function App() {
	const navigate = useNavigate();
	const { displayName, email, uid } = useAppSelector(state => state.activeUser);

	
	useEffect(() => {
		if (displayName === null || email === null || uid === null) {
			navigate('authorization', { replace: true });
		} 

	}, [displayName, email, navigate, uid])
	


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