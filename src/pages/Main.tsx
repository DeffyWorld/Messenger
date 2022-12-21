import React, { lazy, Suspense, useMemo } from 'react'

import styled from 'styled-components';
import 'hamburgers/dist/hamburgers.min.css'

import { EnumSortParams } from '../types/enums';
import { ChatFields, MemberFields } from '../types/interfaces';

import { firestore } from '../firebase';
import { collection, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCollectionData, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setIsDropdownActive } from '../redux/slices/mainSlice';

import FakeSearchPanel from '../components/FakeSearchPanel';
import ChatListItem from '../components/ChatsListItem';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import Hamburger from '../components/Hamburger';
import SortBy from '../components/SortBy';

const SearchPanel = lazy(() => import('../components/SearchPanel'));










const Wrapper = styled.div`
    display: flex;

    .elem-transition-enter {
        opacity: 0;
        transform: scale(0);
    } 
    .elem-transition-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: 300ms;
    }
    .elem-transition-exit {
        opacity: 1;
        transform: scale(1);
    }
    .elem-transition-exit-active {
        opacity: 1;
        transform: scale(0);
        transition: 300ms;
    }
`;
const MainWrapper = styled.section<{ isChatOpen: boolean }>`
    width: 100vw;
    position: relative;
    overflow: hidden;
    padding: 14px;
    transition: all 400ms ease-in-out;
    background: ${({ theme }) => theme.colors.bgPrimary};

    ${({ isChatOpen }) => isChatOpen && `
        width: 0px;
        padding: 14px 0px;
    `}
`;
const ChatsWrapper = styled.div`
    height: calc(100vh - 124px);
    overflow-y: auto;

    &::scrollbar {
        width: 7px;
    }
    &::scrollbar-thumb {
        background-color: #D1D1D1;
        border-radius: 20px;
        border: 3px solid #D1D1D1;
    }
`;



const Header = styled.div`
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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










export default function Main() {
    const dispatch = useAppDispatch();
    const auth = getAuth();
    const [currentUser] = useAuthState(auth);

    const { sortBy } = useAppSelector(state => state.main);
    const { searchValue } = useAppSelector(state => state.searchPanel);
    const { chatWithId, focusMessageTimestamp } = useAppSelector(state => state.chat);
    const { isChatOpen, isSideBarActive, isDropdownActive } = useAppSelector(state => state.main);



    const onRootElClick = () => {
        isDropdownActive === true && dispatch(setIsDropdownActive(false));
    }


    // ChatsList

    const [chatsCollection] = useCollectionData(
        query(collection(firestore, 'chats'), where('members', 'array-contains-any', currentUser === null ? ['user'] : ['user', currentUser?.email!]))
    );

    const membersExludeUser = useMemo(() => {
        let returnArr: string[] = [''];
        chatsCollection?.forEach((chat) => {
            chat.members.forEach((member: string) => {
                if (member !== 'user' && member !== currentUser?.email) {
                    returnArr = [...returnArr, member];
                }
            })
        })
        return returnArr;

    }, [chatsCollection, currentUser?.email])

    const [membersDataCollection] = useCollectionDataOnce(
        query(collection(firestore, 'users'), where('email', 'in', membersExludeUser))
    );

    const chats = useMemo(() => {
        let returnArr: ChatFields[] = [];
        let membersData: MemberFields[] = []

        chatsCollection?.forEach((chat, chatIndex) => {
            membersDataCollection?.forEach((memberData, memberDataIndex) => {
                chat.members.forEach((member: MemberFields) => {
                    if (memberData.email === member) {
                        membersData = [{
                            uid: memberData.uid,
                            displayName: memberData.displayName,
                            photo: memberData.photoURL,
                            isTyping: memberData.isTyping,
                            wasOnline: memberData.wasOnline,
                            email: memberData.email
                        }];
                        returnArr = [...returnArr, {
                            id: chat.id,
                            lastTimeMembersRead: chat.lastTimeMembersRead,
                            messages: chat.messages,
                            membersData: membersData
                        }];
                    }
                })
            })
        })

        return returnArr;

    }, [chatsCollection, membersDataCollection])

    const sortedChats = useMemo(() => chats.sort((firstValue, secondValue) => {
        if (sortBy === EnumSortParams.Alphabet) {
            const firstValueName = firstValue.membersData![0].displayName.split(' ')[0].toLowerCase();
            const secondValueName = secondValue.membersData![0].displayName.split(' ')[0].toLowerCase();

            return firstValueName < secondValueName ? -1 : 1;
        } else {
            const firstValueTime = firstValue.messages[firstValue.messages.length - 1].time;
            const secondValueTime = secondValue.messages[secondValue.messages.length - 1].time;
            return secondValueTime - firstValueTime;
        }

    }), [chats, sortBy])





    return (
        <Wrapper>
            <Sidebar currentUser={currentUser!} auth={auth} isSideBarActive={isSideBarActive} />

            <MainWrapper onClick={onRootElClick} isChatOpen={isChatOpen} >
                <Header>
                    <Title>Messages</Title>

                    <Hamburger dispatch={dispatch} isSideBarActive={isSideBarActive} />
                </Header>

                {searchValue !== '' ?
                    <Suspense fallback={<FakeSearchPanel />}>
                        <SearchPanel chats={chats} chatsCollection={chatsCollection} />
                    </Suspense>
                    :
                    <FakeSearchPanel />
                }

                <SortBy dispatch={dispatch} isDropdownActive={isDropdownActive} sortBy={sortBy} />



                <ChatsWrapper>
                    {sortedChats.map((chat, index) => (
                        <ChatListItem
                            key={`${chat}_${index}`}
                            id={chat.id}
                            email={chat.membersData![0].email!}
                            displayName={chat.membersData![0].displayName}
                            photoURL={chat.membersData![0].photo}
                            wasOnline={chat.membersData![0].wasOnline!}
                            currentUser={currentUser?.email!.split('.')[0]}
                            message={chat.messages[chat.messages.length - 1]}
                            lastTimeMembersRead={chat.lastTimeMembersRead}
                        />
                    ))}
                </ChatsWrapper>
            </MainWrapper>

            {chatWithId !== null &&
                <Chat id={chatWithId!} focusMessageTimestamp={focusMessageTimestamp!} />
            }
        </Wrapper>
    )
}