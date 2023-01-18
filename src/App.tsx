import { Navigate, Route, Routes } from 'react-router-dom';

import Authorization from './pages/Authorization';
import Main from './pages/Main';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import NotExist from './pages/NotExist';



export default function App() {
	return (
		<Routes>
			<Route path='/' element={<Main />} >
				<Route path='chat' element={<Navigate to='/' replace />} />
				<Route path='chat/:chatId' element={<Chat />} />
			</Route>

			<Route path='/authorization' element={<Authorization />} />
			<Route path='/settings' element={<Settings />} />
			<Route path="*" element={<NotExist />} />
		</Routes>
	);
}