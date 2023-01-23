import styled from 'styled-components';
import { EnumSortParams } from '../types/enums';
import { ChatFields } from '../types/interfaces';

import { useEffect, useMemo } from 'react'
import { database, firestore } from '../firebase';
import { collection, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ref } from 'firebase/database';
import { useListVals } from 'react-firebase-hooks/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setIsDropdownActive } from '../redux/slices/sortBySlice';
import { presence } from '../redux/slices/authorizationSlice';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';

import ChatListItem from '../components/ChatListItem';
import Sidebar from '../components/Sidebar';
import Hamburger from '../components/Hamburger';
import SortBy from '../components/SortBy';
import SearchPanel from '../components/SearchPanel';
import ChatListItemLoader from '../components/ChatListItemLoader';
import { setIsChatOpen } from '../redux/slices/chatSlice';





export default function Main() {
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [currentUser, currentUserLoading] = useAuthState(auth);
    const { sortBy, isDropdownActive } = useAppSelector(state => state.sortBy);
    const { isChatOpen } = useAppSelector(state => state.chat);
    const chatMatch = useMatch('/chat/:id');

    const onRootElClick = () => {
        isDropdownActive && dispatch(setIsDropdownActive(false));
    }

    useEffect(() => {
        chatMatch !== null 
            ? dispatch(setIsChatOpen(true))
            : dispatch(setIsChatOpen(false));

    }, [chatMatch, dispatch])



    const [chatsData, , chatsDataError] = useCollectionData(
        currentUser !== null && currentUser !== undefined
            ? query(collection(firestore, 'chats'), where('members', 'array-contains-any', ['user', currentUser.email!]))
            : undefined
    )

    const members: string[] | undefined = useMemo(() => chatsData?.map((chat) => {
        return chat.members!.find((member: string) => member !== 'user' && member !== currentUser?.email)
    }), [chatsData, currentUser?.email])

    const [membersData, , membersDataError] = useCollectionData(
        members !== undefined && currentUser !== null && currentUser !== undefined
            ? query(collection(firestore, 'users'), where('email', 'in', [...members, currentUser.email]))
            : undefined
    )

    const [membersStatus, , membersStatusError] = useListVals<any>(ref(database, 'usersStatus'));

    const sortedChatList: ChatFields[] | undefined = useMemo(() => {
        if (chatsData && membersData && membersStatus && membersStatus.length !== 0 && membersData.length - 1 === chatsData.length) {
            const chatList: ChatFields[] | undefined = chatsData.map((chat) => {
                const member = chat.members!.find((member: string) => member !== 'user' && member !== currentUser?.email);
                const memberData = membersData.find((memberData) => memberData.email === member);
                const memberStatusData = membersStatus.find((memberStatus) => memberStatus.email === member);
                return {
                    id: chat.id,
                    lastTimeMembersRead: chat.lastTimeMembersRead,
                    messages: chat.messages,
                    memberData: {
                        displayName: memberData?.displayName,
                        email: memberData?.email,
                        photoURL: memberData?.photoURL,
                        uid: memberData?.uid,
                        isTyping: memberData?.isTyping,
                        isOnline: memberStatusData?.isOnline,
                    }
                }
            })
            return chatList && chatList.sort((firstValue, secondValue) => {
                if (sortBy === EnumSortParams.Alphabet) {
                    const firstValueName = firstValue.memberData!.displayName.split(' ')[0].toLowerCase();
                    const secondValueName = secondValue.memberData!.displayName.split(' ')[0].toLowerCase();

                    return firstValueName < secondValueName ? -1 : 1;
                } else {
                    const firstValueTime = firstValue.messages[firstValue.messages.length - 1].time;
                    const secondValueTime = secondValue.messages[secondValue.messages.length - 1].time;

                    return secondValueTime - firstValueTime;
                }
            })
        }
    }, [chatsData, currentUser?.email, membersData, membersStatus, sortBy])



    useEffect(() => {
        chatsDataError !== undefined && console.error(chatsDataError);
        membersDataError !== undefined && console.error(membersDataError);
        membersStatusError !== undefined && console.error(membersStatusError);

    }, [chatsDataError, membersDataError, membersStatusError])

    useEffect(() => {
        currentUserLoading === false && currentUser === null && navigate('/authorization', { replace: true });
        currentUser && dispatch(presence({ currentUser: currentUser }));

    }, [currentUser, currentUserLoading, dispatch, navigate])



    return (<>
        <Wrapper isChatOpen={isChatOpen} >
            <Sidebar isChatOpen={isChatOpen} currentUser={currentUser} currentUserLoading={currentUserLoading} />

            <MainWrapper onClick={onRootElClick} isChatOpen={isChatOpen} >
                <Header>
                    <Title>Messages</Title>
                    <Hamburger />
                </Header>

                <SearchPanel
                    currentUser={currentUser}
                    chatList={sortedChatList}
                    membersData={membersData}
                />

                <SortBy isDropdownActive={isDropdownActive} sortBy={sortBy} />

                <ChatsWrapper>
                    <Scrollbars
                        autoHide
                        autoHideDuration={400}
                        renderView={({ style, ...props }) => <div
                            style={{ ...style, overflowX: 'auto', marginBottom: '0px', padding: '0px 6px' }}
                            {...props}
                        />}
                        renderThumbVertical={({ style, ...props }) => <ThumbVertical style={{ width: '4px' }} {...props} />}
                        renderTrackVertical={props => <TrackVertical {...props} />}
                    >
                        {sortedChatList && currentUser && sortedChatList.length !== 0
                            ? sortedChatList.map((chat, index) => (
                                <ChatListItem
                                    key={`${chat}_${index}`}
                                    id={chat.id}
                                    email={chat.memberData!.email!}
                                    displayName={chat.memberData!.displayName}
                                    photoURL={chat.memberData!.photoURL}
                                    isOnline={chat.memberData!.isOnline}
                                    currentUser={currentUser?.email!}
                                    message={chat.messages[chat.messages.length - 1]}
                                    lastTimeMembersRead={chat.lastTimeMembersRead}
                                    isActive={chatMatch && chatMatch.params.id ? chat.id === +chatMatch.params.id : undefined}
                                />
                            ))
                            : Array.from({ length: Math.floor((window.innerHeight - 105) / 58) }).map((elem, index) => (
                                <ChatListItemLoader key={index} />
                            ))
                        }
                    </Scrollbars>
                </ChatsWrapper>
            </MainWrapper>

            <Outlet />
        </Wrapper>
    </>)
}





const Wrapper = styled.div<{ isChatOpen: boolean }>`
    width: 100vw;
    display: flex;
    background-color: ${({ theme }) => theme.colors.bgPrimary};
`;
const MainWrapper = styled.section<{ isChatOpen: boolean }>`
    width: 360px; 
    height: 100vh;
    min-height: -webkit-fill-available;
    height: -webkit-fill-available;
    border-right: 2px solid ${({ theme }) => theme.colors.bgSecondary};
    position: relative;
    overflow: hidden;
    transition: all 400ms ease-in-out;
    background-color: ${({ theme }) => theme.colors.bgPrimary};

    @media (${({ theme }) => theme.media.md}) {
        width: 100vw;
        border-right: none;

        ${({ isChatOpen }) => isChatOpen && `
            width: 0px;
        `}
    }
`;
const ChatsWrapper = styled.div`
    height: calc(100vh - 30px - 14px - 35px - 18px - 8px);
    min-height: -webkit-fill-available;
    height: -webkit-fill-available;
`;
const ThumbVertical = styled.div`
    background-color: ${({ theme }) => theme.colors.scrollbarThumb};
    border-radius: 2.5px;
`;
const TrackVertical = styled.div`
    height: 100%;
    right: 0px;
    background-color: ${({ theme }) => theme.colors.scrollbarTrack};
    cursor: pointer;
`;



const Header = styled.div`
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px 10px 0px 14px;
`;
const Title = styled.h1`
    margin-bottom: 19px;

    font-family: 'SFPro';
    font-style: normal;
    font-weight: 800;
    font-size: 23px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;