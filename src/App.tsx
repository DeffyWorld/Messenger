import React, { useLayoutEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch } from './redux/hooks';
import { presence } from './redux/slices/authorizationSlice';

import Authorization from './pages/Authorization';
import Main from './pages/Main';
import Settings from './pages/Settings';



export default function App() {
	const navigate = useNavigate();
	const auth = getAuth();
	const [currentUser, currentUserLoading] = useAuthState(auth);
	const dispatch = useAppDispatch();

	useLayoutEffect(() => {
		!currentUserLoading && currentUser === null && navigate('authorization', { replace: true });
		!currentUserLoading && currentUser !== null && dispatch(presence({ currentUser: currentUser! })); 

	}, [currentUser, currentUserLoading, dispatch, navigate])



	return (
		<Routes>
			<Route path='/' element={<Main />} />
			<Route path='/authorization' element={<Authorization />} />
			<Route path='/settings' element={<Settings />} />
		</Routes>
	);
}