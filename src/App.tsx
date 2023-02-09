import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { presence } from './redux/slices/authorizationSlice';
import { getAuth } from 'firebase/auth';
import { useAppDispatch } from './redux/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';

import Main from './pages/Main';
import Chat from './pages/Chat';

const Authorization = lazy(() => import('./pages/Authorization'));
const Settings = lazy(() => import('./pages/Settings'));
const NotExist = lazy(() => import('./pages/NotExist'));



export default function App() {
	const auth = getAuth();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [currentUser, currentUserLoading] = useAuthState(auth);

	useEffect(() => {
		currentUserLoading === false && currentUser === null && navigate('/authorization', { replace: true });
		currentUser && dispatch(presence({ currentUser: currentUser }));

	}, [currentUser, currentUserLoading, dispatch, navigate])


	return (
		<Suspense>
			<Routes>
				<Route path='/' element={<Main />} >
					<Route path='chat' element={<Navigate to='/' replace />} />
					<Route path='chat/:chatId' element={<Chat />} />
				</Route>

				<Route path='/authorization' element={<Authorization />} />
				<Route path='/settings' element={<Settings />} />
				<Route path="*" element={<NotExist />} />
			</Routes>
		</Suspense>
	);
}