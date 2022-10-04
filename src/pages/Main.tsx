import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi';

import { EnumSortParams } from '../types/enums';
import { MemberFields } from '../types/interfaces';

import { db } from '../firebase';
import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setShouldSetNewDoc } from '../redux/slices/shouldSetNewDocSlice';

import Chat from '../components/Chat';
import FakeSearchPanel from '../components/FakeSearchPanel';

const SearchPanel = lazy(() => import('../components/SearchPanel'));










const MainWrapper = styled.section`
    
`;
const MainLoaderWrapper = styled.section`
  
`;
const MainHeader = styled.div`
    position: relative;
    padding: 14px;
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
    const [sortBy, setSortBy] = useState<string>(EnumSortParams.Newest);

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

    const sortedChats = useMemo(() => chatsCollection?.sort((firstValue, secondValue) => {
        if (sortBy === EnumSortParams.Alphabet) {
            let firstValueName: string = '';
            let secondValueName: string = '';
            firstValue.members.forEach((member: MemberFields) => {
                if (member.displayName !== currentUser?.displayName && member.displayName !== 'user') {
                    // firstValueName = member.displayName.split(' ')[0].toLowerCase();
                    // secondValueName = member.displayName.split(' ')[0].toLowerCase();
                }
            })
            return firstValueName < secondValueName ? -1 : 1;
        } else {
            const firstValueTime = firstValue.messages.reverse()[0].time;
            const secondValueTime = secondValue.messages.reverse()[0].time;
            return secondValueTime - firstValueTime;
        }

    }), [chatsCollection, sortBy, currentUser?.displayName])





    return (
        !currentUserLoading && !chatsCollectionLoading ?
            (<MainWrapper onClick={onRootElClick} >
                <MainHeader>
                    <Title onClick={() => auth.signOut()} >Messeges</Title>


                    {shouldSearchPanelRender
                        ? (<Suspense fallback={<FakeSearchPanel />}>
                            <SearchPanel chatsCollection={chatsCollection} membersExludeUser={membersExludeUser} />
                        </Suspense>)
                        : (<FakeSearchPanel />)
                    }


                    <SortBy>
                        <SortByText>Sort by</SortByText>

                        <DropdownWrapper>
                            <SortByParam onClick={toggleDropdown} >
                                {sortBy}
                                <IconContext.Provider value={{ style: {margin: '2px 0 0 0'} }}>
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
                </MainHeader>



                <ChatsWrapper>
                    {sortedChats?.map((chat, index) => (
                        <Chat key={`${chat}_${index}`} />
                    ))}
                </ChatsWrapper>
            </MainWrapper>)
            :
            (<MainLoaderWrapper>
                Loading
            </MainLoaderWrapper>)
    )
}