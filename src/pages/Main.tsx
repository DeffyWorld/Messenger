import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import styled from 'styled-components';
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

const SearchPanel = lazy(() => import('../components/SearchPanel'));










const MainWrapper = styled.section`
    position: relative;
    padding: 14px;
`;
const MainLoaderWrapper = styled.section`
  
`;
const ChatsWrapper = styled.div`
  
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
    margin-top: 66px; 
    margin-left: 13px;
    gap: 4px;
    display: flex;
`;
const SortByText = styled.p`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
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
    const { shouldSetNewDoc } = useAppSelector(state => state.shouldSetNewDoc);
    const { shouldSearchPanelRender } = useAppSelector(state => state.searchPanel);

    const auth = getAuth();
    const [currentUser, currentUserLoading] = useAuthState(auth);

    useEffect(() => {
        if (shouldSetNewDoc && !currentUserLoading) {
            setDoc(doc(collection(db, "users"), `${currentUser?.email}`), {
                displayName: `${currentUser?.displayName}`,
                email: `${currentUser?.email}`,
                isOnline: true,
                photoURL: `${currentUser?.photoURL}`,
                wasOnline: Date.now(),
                uid: `${currentUser?.uid}`
            }).then(() => {
                dispatch(setShouldSetNewDoc(false));
            })
        }

    }, [currentUser?.displayName, currentUser?.email, currentUser?.photoURL, currentUser?.uid, currentUserLoading, dispatch, shouldSetNewDoc])





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





    // Chats

    const [chatsCollection, chatsCollectionLoading] = useCollectionData(
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
                            messages: chat.messages,
                            membersData: membersData
                        }];
                    }
                })
            })
        })

        return returnArr;

    }, [chatsCollection, membersDataCollection])

    const sortedChats = useMemo(() => chats?.sort((firstValue, secondValue) => {
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
        !currentUserLoading && !chatsCollectionLoading ?
            (<MainWrapper onClick={onRootElClick} >
                <Title>Messages</Title>


                {shouldSearchPanelRender
                    ? (<Suspense fallback={<FakeSearchPanel />}>
                        <SearchPanel chatsCollection={chatsCollection} membersDataCollection={membersDataCollection} />
                    </Suspense>)
                    : (<FakeSearchPanel />)
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
                    {sortedChats?.map((chat, index) => (
                        <ChatListItem
                            key={`${chat}_${index}`}
                            uid={chat.membersData![0].uid}
                            displayName={chat.membersData![0].displayName}
                            photoURL={chat.membersData![0].photo}
                            isTyping={chat.membersData![0].isTyping!}
                            wasOnline={chat.membersData![0].wasOnline!}
                            currentUser={currentUser?.email!}
                            lastMessage={chat.messages[chat.messages.length - 1]}
                        />
                    ))}
                </ChatsWrapper>
            </MainWrapper>)
            :
            (<MainLoaderWrapper>
                Loading
            </MainLoaderWrapper>)
    )
}