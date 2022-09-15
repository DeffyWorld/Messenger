import React, { useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

// import Chat from './components/Chat';
import Authorization from './pages/Authorization';
import MainPage from './pages/MainPage';
import Settings from './pages/Settings';


export default function App() {
	const navigate = useNavigate();
	const auth = getAuth();
	const [currentUser, currentUserLoading] = useAuthState(auth);

	
	useEffect(() => {
		!currentUserLoading && console.log(currentUser);
		if (!currentUserLoading && currentUser === null) {
			navigate('authorization', { replace: true });
		}

	}, [currentUser, currentUserLoading, navigate])
	


	return (
		<Routes>
			{/* <Route path='/' element={<Main/>} >
				{ <Chat /> }
			</Route> */}

			<Route path='/' element={<MainPage currentUserLoading={currentUserLoading}/>} />
			<Route path='/authorization' element={<Authorization/>} />
			<Route path='/settings' element={<Settings />} />
		</Routes>
	);
}