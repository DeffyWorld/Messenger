import styled from 'styled-components';
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { database, firestore } from '../firebase';
import { doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { useAppDispatch } from '../redux/hooks';

import ChatHeader from '../components/ChatHeader';
import Messages from '../components/Messages';
import InputField from '../components/InputField';
import NotExist from './NotExist';
import { updateLastTimeMembersRead } from '../redux/slices/chatSlice';






export default function Chat() {
    const auth = getAuth();
    const dispatch = useAppDispatch();

    const { chatId } = useParams();
    const [currentUser, currentUserLoading] = useAuthState(auth);
    const chatWith = useRef<string | null>(null);



    const [chatData, chatDataLoading, chatDataError] = useDocumentData(doc(firestore, 'chats', chatId!));
    
    chatWith.current = chatWith.current === null && chatData
        ? chatData.members.find((member: string) => member !== currentUser?.email && member !== 'user')
        : chatWith.current;

    const [chatWithData,, chatWithDataError] = useDocumentData(chatWith.current ? doc(firestore, 'users', chatWith.current) : undefined);
    const [chatWithStatusData,, chatWithStatusDataError] = useObjectVal<any>(chatWithData ? ref(database, `usersStatus/${chatWithData.uid}`) : undefined);

    useEffect(() => {
        chatDataError !== undefined && console.error(chatDataError);
        chatWithDataError !== undefined && console.error(chatWithDataError);
        chatWithStatusDataError !== undefined && console.error(chatWithStatusDataError);
        
    }, [chatDataError, chatWithDataError, chatWithStatusDataError])



    const lastMessageTimestamp = chatData !== undefined ? chatData.messages[chatData.messages.length - 1].time : null;
    
    useEffect(() => {
        if (lastMessageTimestamp && currentUser && chatWith.current) {
            dispatch(updateLastTimeMembersRead({ chatWith: chatWith.current, chatId: chatId!, currentUserEmail: currentUser.email! }));
        }
        
    }, [chatId, chatWith, currentUser, dispatch, lastMessageTimestamp])



    if (chatDataLoading === false && chatData === undefined) {
        return (<NotExist chat />)
    }

    if (chatData === undefined || chatWithData === undefined || chatWithStatusData === undefined) {
        return (<></>)
    }

    return (
        <Wrapper>
            <ChatHeader 
                photoURL={chatWithData.photoURL}
                displayName={chatWithData.displayName}
                isTyping={chatWithData.isTyping}
                isOnline={chatWithStatusData.isOnline}
                wasOnline={chatWithStatusData.wasOnline}
            />

            <Messages chatData={chatData} chatWith={chatWith.current!} />

            <InputField chatId={chatId!} currentUser={currentUser} currentUserLoading={currentUserLoading} /> 
        </Wrapper>
    )
}





const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    margin-right: -100vw;
    background: ${({ theme }) => theme.colors.bgPrimary};
`;