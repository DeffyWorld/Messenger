import React, { useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// import Chat from './components/Chat';
import Authorization from './pages/Authorization';
import Main from './pages/Main';
import Settings from './pages/Settings';



export default function App() {
	const navigate = useNavigate();
	const auth = getAuth();
	const [currentUser, currentUserLoading] = useAuthState(auth);
	
	useEffect(() => {
		if (!currentUserLoading && currentUser === null) {
			navigate('authorization', { replace: true });
		}

		if (!currentUserLoading && currentUser !== null) {
			setInterval(() => {
				updateDoc(doc(db, 'users', `${currentUser?.email}`), {
					wasOnline: Date.now()
				})
			}, 5000)
		}

	}, [currentUser, currentUserLoading, navigate])
	


	return (
		<Routes>
			{/* <Route path='/' element={<Main/>} >
				{ <Chat /> }
			</Route> */}

			<Route path='/' element={<Main/>} />
			<Route path='/authorization' element={<Authorization/>} />
			<Route path='/settings' element={<Settings />} />
		</Routes>
	);
}