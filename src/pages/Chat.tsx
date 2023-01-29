import styled, { keyframes } from 'styled-components';
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLastMessage, setLastTimeMembersRead } from '../redux/slices/chatSlice';

import ChatHeader from '../components/ChatHeader';
import Messages from '../components/Messages';
import InputField from '../components/InputField';






export default function Chat() {
    const auth = getAuth();
    const dispatch = useAppDispatch();

    const { chatId } = useParams();
    const [currentUser] = useAuthState(auth);
    const { chatsData, membersData, membersStatus } = useAppSelector(state => state.main);



    const chatData = useMemo(() => chatsData !== null ? chatsData.find(chatData => chatData.id === +chatId!) : null, [chatId, chatsData]);
    const chatWith = useMemo(() => chatData?.members!.find(member => member !== currentUser?.email && member !== 'user'), [chatData?.members, currentUser?.email]);
    const chatWithData = useMemo(() => membersData?.find(memberData => memberData.email === chatWith), [chatWith, membersData]);
    const chatWithStatusData = useMemo(() => membersStatus?.find(memberStatus => memberStatus.email === chatWith), [chatWith, membersStatus]);
    const [messages, messagesLoading, messagesError] = useCollectionData(collection(firestore, `messages/${chatId}/chatMessages`));



    const lastMessage = useMemo(() => messages !== undefined ? messages[messages.length - 1] : null, [messages]);

    useEffect(() => {
        if (lastMessage && currentUser && `${lastMessage.chatId}` === chatId) {
            dispatch(setLastTimeMembersRead({ chatId: chatId!, currentUserEmail: currentUser.email! }));
            dispatch(setLastMessage({ chatId: chatId!, lastMessage: lastMessage }));
        }

    }, [chatId, chatWith, currentUser, dispatch, lastMessage])



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
                {
                    chatData && chatWithData && chatWithStatusData && messages && lastMessage && `${lastMessage.chatId}` === chatId
                        ? <Messages messages={messages} lastTimeMembersRead={chatData.lastTimeMembersRead} chatWith={chatWith!} />
                        : messages?.length === 0 && messagesLoading === false
                            ? <></>
                            : chatData === undefined
                                ? <Error>You do not have permissions to this chat or it does not exist</Error>
                                : messagesError
                                    ? <Error red >{messagesError.message}</Error>
                                    : <Loader><div></div><div></div><div></div><div></div></Loader>
                }
            </StatusWrapper>

            <InputField
                chatId={chatId!}
                currentUserEmail={currentUser ? currentUser.email : null}
                shouldDisableInputs={chatData === null || chatData === undefined || messages === undefined}
            />
        </Wrapper>
    )
}





const Wrapper = styled.div`
    height: 100%;
    width: calc(100vw - 360px);
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.bgPrimary};
    position: relative;
    z-index: 10;

    @media (${({ theme }) => theme.media.md}) {
        width: 100vw;
        margin-right: -100vw;
    }
`;

const StatusWrapper = styled.div`
    flex: 1;
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