import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import styled from 'styled-components';
import 'hamburgers/dist/hamburgers.min.css'

import { IconContext } from 'react-icons';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi';

import { EnumSortParams } from '../types/enums';
import { ChatFields, MemberFields } from '../types/interfaces';

import { db } from '../firebase';
import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCollectionData, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setShouldSetNewDoc } from '../redux/slices/shouldSetNewDocSlice';

import FakeSearchPanel from '../components/FakeSearchPanel';
import ChatListItem from '../components/ChatsListItem';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

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
const Hamburger = styled.div`
    transform: scale(0.6);
    margin-top: -13px;

    .hamburger {
        padding: 0;
    }
    .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
        background-color: ${({ theme }) => theme.colors.textPrimary};
    }
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



const SortBy = styled.div`
    margin: 46px 0px 4px 13px;
    gap: 4px;
    display: flex;
`;
const SortByText = styled.p`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.textSecondary};
`;
const DropdownWrapper = styled.div`
    position: relative;
`;
const Dropdown = styled.div<{ isDropdownActive: boolean }>`
    display: none;

    ${({ isDropdownActive }) => isDropdownActive && `
        position: absolute;
        display: block;
    `}
`;
const SortByParam = styled.div`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #2D9CDB;

    display: flex;
    align-items: center;
    justify-content: center;
`;











export default function Main() {
    const dispatch = useAppDispatch();
    const auth = getAuth();
    const [currentUser, currentUserLoading] = useAuthState(auth);

    const { shouldSetNewDoc } = useAppSelector(state => state.shouldSetNewDoc);
    const { searchValue } = useAppSelector(state => state.searchPanel);
    const { isChatOpen, chatWithId, focusMessageTimestamp } = useAppSelector(state => state.chat);

    useEffect(() => {
        if (shouldSetNewDoc && !currentUserLoading) {
            console.log(currentUser?.displayName);
            setDoc(doc(collection(db, "users"), `${currentUser?.email}`), {
                displayName: `${currentUser?.displayName}`,
                email: `${currentUser?.email}`,
                isOnline: true,
                photoURL: currentUser?.photoURL !== '' && currentUser?.photoURL === 'null'
                    ? `${currentUser?.photoURL}`
                    : 'https://pmdoc.ua/wp-content/uploads/default-avatar.png',
                wasOnline: Date.now(),
                uid: `${currentUser?.uid}`
            }).then(() => {
                dispatch(setShouldSetNewDoc(false));
            })
        }

    }, [currentUser?.displayName, currentUser?.email, currentUser?.photoURL, currentUser?.uid, currentUserLoading, dispatch, shouldSetNewDoc])





    // Sidebar

    const [isSideBarActive, setIsSideBarActive] = useState<boolean>(false);

    const onHamburgerClick = () => {
        setIsSideBarActive(!isSideBarActive);
    }

    useEffect(() => { isChatOpen && setIsSideBarActive(false) }, [isChatOpen])





    // SortBy

    const sortParams = Object.keys(EnumSortParams);
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>(localStorage.getItem('sortBy') || EnumSortParams.Newest);
    localStorage.setItem('sortBy', sortBy);

    const onRootElClick = () => {
        isDropdownActive === true && setIsDropdownActive(false);
    }
    const toggleDropdown = () => {
        setIsDropdownActive(!isDropdownActive);
    }
    const toggleSortByParam = (param: string) => {
        setSortBy(param);
        setIsDropdownActive(false);
    }





    // ChatsList

    const [chatsCollection] = useCollectionData(
        query(collection(db, 'chats'), where('members', 'array-contains-any', currentUser === null ? ['user'] : ['user', currentUser?.email!]))
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
        query(collection(db, 'users'), where('email', 'in', membersExludeUser))
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
    console.log(sortedChats)





    return (
        <Wrapper>
            <Sidebar currentUser={currentUser!} auth={auth} isSideBarActive={isSideBarActive} />

            <MainWrapper onClick={onRootElClick} isChatOpen={isChatOpen} >
                <Header>
                    <Title>Messages</Title>

                    <Hamburger onClick={onHamburgerClick} >
                        <button
                            className={isSideBarActive ? "hamburger hamburger--slider is-active" : "hamburger hamburger--slider"}
                            type="button"
                        >
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </Hamburger>
                </Header>


                {searchValue !== '' ?
                    <Suspense fallback={<FakeSearchPanel />}>
                        <SearchPanel chats={chats} chatsCollection={chatsCollection} />
                    </Suspense>
                    :
                    <FakeSearchPanel />
                }


                <SortBy>
                    <SortByText>Sort by</SortByText>

                    <DropdownWrapper>
                        <SortByParam onClick={toggleDropdown} >
                            {sortBy}
                            <IconContext.Provider value={{ style: { margin: '2px 0 0 0' } }}>
                                {isDropdownActive
                                    ? (<BiChevronUp />)
                                    : (<BiChevronDown />)
                                }
                            </IconContext.Provider>
                        </SortByParam>

                        <Dropdown isDropdownActive={isDropdownActive} >
                            {sortParams.map((param, index) => (
                                param !== sortBy && (
                                    <SortByParam key={`${param}_${index}`} onClick={() => toggleSortByParam(param)}>
                                        {param}
                                    </SortByParam>
                                )
                            ))}
                        </Dropdown>
                    </DropdownWrapper>
                </SortBy>



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