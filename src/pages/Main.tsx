import React, { useEffect, useMemo, useState } from 'react'

import styled from 'styled-components';
import { EnumSortParams } from '../types/enums';
import { MemberFields } from '../types/interfaces';
import { db } from '../firebase';
import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setShouldSetNewDoc } from '../redux/slices/shouldSetNewDocSlice';

import SearchPanel from '../components/SearchPanel';
import Chat from '../components/Chat';










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
    margin-top: 60px; 
`;
const SortByText = styled.p`
  
`;
const Dropdown = styled.div`
  
`;
const SortByParam = styled.div`
  
`;











export default function Main() {
    const dispatch = useAppDispatch();
    const { shouldSetNewDoc } = useAppSelector(state => state.shouldSetNewDoc);
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
    const [sortBy, setSortBy] = useState<string>(EnumSortParams.Newest)

    const sortByHandler = (param: string) => {
        setSortBy(param);
    }





    // Chats

    const [chatsCollection, chatsCollectionLoading] = useCollectionData(
        query(collection(db, 'chats'), where('members', 'array-contains-any', currentUser === null ? ['user'] : ['user', currentUser?.email!]))
    );

    const sortedChats = useMemo(() => chatsCollection?.sort((firstValue, secondValue) => {
        if (sortBy === EnumSortParams.Alphabet) {
            let firstValueName: string = '';
            let secondValueName: string = '';
            firstValue.members.forEach((member: MemberFields) => {
                if (member.displayName !== currentUser?.displayName && member.displayName !== 'user') {
                    firstValueName = member.displayName.split(' ')[0].toLowerCase();
                    secondValueName = member.displayName.split(' ')[0].toLowerCase();
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
            (<MainWrapper>
                <MainHeader>
                    <Title onClick={() => auth.signOut()} >Messeges</Title>


                    <SearchPanel/>


                    <SortBy>
                        <SortByText>SortBy</SortByText>
                        <Dropdown>
                            <SortByParam>{sortBy}</SortByParam>
                            {sortParams.map((param, index) => (
                                param !== sortBy && (
                                    <SortByParam key={`${param}_${index}`} onClick={() => sortByHandler(param)}>
                                        {param}
                                    </SortByParam>
                                )
                            ))}
                        </Dropdown>
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