import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { database, firestore } from '../firebase';
import { doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { useAppDispatch } from '../redux/hooks';
import { setLastTimeMembersRead } from '../redux/slices/chatSlice';

import ChatHeader from '../components/ChatHeader';
import Messages from '../components/Messages';
import InputField from '../components/InputField';






export default function Chat() {
    const auth = getAuth();
    const dispatch = useAppDispatch();

    const { chatId } = useParams();
    const [currentUser] = useAuthState(auth);
    const [chatWith, setChatWith] = useState<string | null>(null)
    const [hasUserPermissions, setHasUserPermissions] = useState<boolean | null>(null);

    const [chatData, chatDataLoading, chatDataError] = useDocumentData(doc(firestore, 'chats', chatId!));

    useEffect(() => {
        chatData && setChatWith(chatData.members.find((member: string) => member !== currentUser?.email && member !== 'user'));
        
    }, [chatData, currentUser?.email])

    useEffect(() => {
        if (!chatDataLoading && chatData !== undefined && currentUser) {
            if (chatWith === 'tailorswift@gmail.com' || chatWith === 'barakobama@gmail.com') {
                setHasUserPermissions(true);
            } else {
                const index = chatData!.members.indexOf(currentUser!.email);
                index !== -1 ? setHasUserPermissions(true) : setHasUserPermissions(false);
            }

        }

    }, [chatData, chatDataLoading, chatWith, currentUser])


    const [chatWithData, , chatWithDataError] = useDocumentData(chatWith ? doc(firestore, 'users', chatWith) : undefined);
    const [chatWithStatusData, , chatWithStatusDataError] = useObjectVal<any>(chatWithData ? ref(database, `usersStatus/${chatWithData.uid}`) : undefined);



    const lastMessageTimestamp: number | null = chatData !== undefined ? chatData.messages[chatData.messages.length - 1].time : null;

    useEffect(() => {
        if (lastMessageTimestamp && currentUser && chatWith) {
            dispatch(setLastTimeMembersRead({ chatWith: chatWith, chatId: chatId!, currentUserEmail: currentUser.email! }));
        }

    }, [chatId, chatWith, currentUser, dispatch, lastMessageTimestamp])



    return (
        <Wrapper>
            <ChatHeader
                photoURL={chatWithData?.photoURL}
                displayName={chatWithData?.displayName}
                isTyping={chatWithData?.isTyping}
                isOnline={chatWithStatusData?.isOnline}
                wasOnline={chatWithStatusData?.wasOnline}
            />


            <StatusWrapper>
                {chatData && hasUserPermissions && chatWith && <Messages chatData={chatData} chatWith={chatWith!} />}

                {chatDataLoading === true && chatData === undefined &&
                    <Loader>
                        <div></div><div></div><div></div><div></div>
                    </Loader>
                }

                {hasUserPermissions === false && <Error>You do not have permissions to this chat</Error>}
                {chatDataLoading === false && chatData === undefined && hasUserPermissions === null && <Error>This chat does not exist</Error>}
                {chatDataError && <Error red >{chatDataError.code}</Error>}
                {chatWithDataError && <Error red >{chatWithDataError.code}</Error>}
                {chatWithStatusDataError && <Error red >{chatWithStatusDataError.message}</Error>}
            </StatusWrapper>

            <InputField
                chatId={chatId!}
                currentUserEmail={currentUser ? currentUser.email : null}
                shouldDisableInputs={
                    (chatDataError !== undefined || chatWithDataError !== undefined || chatWithStatusDataError !== undefined) ||
                    (chatDataLoading === false && chatData === undefined) ||
                    (chatDataLoading === true && chatData === undefined) ||
                    hasUserPermissions === false
                }
            />
        </Wrapper>
    )
}





const Wrapper = styled.div`
    height: 100vh;
    width: calc(100vw - 360px);
    background: ${({ theme }) => theme.colors.bgPrimary};
    position: relative;
    z-index: 10;

    @media (${({ theme }) => theme.media.md}) {
        width: 100vw;
        margin-right: -100vw;
    }
`;

const StatusWrapper = styled.div`
    height: calc(100vh - 55px - 62px);
    width: calc(100vw - 360px);
    display: flex;
    align-items: center;
    justify-content: center;

    @media (${({ theme }) => theme.media.md}) {
        width: 100vw;
    }
`;

const ldsRing = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`
const Loader = styled.div`
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 46px;
        height: 46px;
        margin: 8px;
        border: 5px solid ${({ theme }) => theme.colors.border};
        border-radius: 50%;
        animation: ${ldsRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${({ theme }) => theme.colors.border} transparent transparent transparent;

        &:nth-child(1) {
            animation-delay: -0.45s;
        }
        &:nth-child(2) {
            animation-delay: -0.3s;
        }
        &:nth-child(3) {
            animation-delay: -0.15s;
        }
    }
`;

const Error = styled.div<{ red?: boolean }>`
    padding: 5px 12px;
    border-radius: 12px;
    background-color: ${({ red, theme }) => red ? '#ff1e1e' : theme.colors.messageBg};

    font-family: 'SFPro';
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: ${({ red, theme }) => red ? theme.colors.scrollbarTrack : theme.colors.textSecondary};
`;