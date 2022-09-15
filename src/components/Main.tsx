import React, { useEffect, useMemo, useState } from 'react'

import styled from 'styled-components';
import { EnumSortParams } from '../types/enums';
import { MemberFields } from '../types/interfaces';
import { db } from '../firebase';
import { collection, DocumentData, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import SearchPanel from './SearchPanel';










const MainWrapper = styled.section`
    
`;
const MainHeader = styled.div`
    padding: 14px;
`;
const ChatsWrapper = styled.div`
  
`;



const Title = styled.h1`
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 800;
    font-size: 23px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;



const SortBy = styled.div`
    
`;
const SortByText = styled.p`
  
`;
const Dropdown = styled.div`
  
`;
const SortByParam = styled.div`
  
`;










export default function Main() {
    // SortBy

    const sortParams = [EnumSortParams.Newest, EnumSortParams.Alphabet];
    const [sortBy, setSortBy] = useState<EnumSortParams>(EnumSortParams.Newest)

    const sortByHandler = (param: EnumSortParams) => {
        setSortBy(param);
    }



    // Chats
    const auth = getAuth();
	const [currentUser, currentUserLoading] = useAuthState(auth);

    const [chatsCollection, chatsCollectionLoading, chatsCollectionError] = useCollection(
        query(collection(db, 'chats'), where('uid', 'array-contains-any', currentUser === null ? ['0'] : ['0', currentUser?.uid!]))
    );

    let chatsCollectionData: DocumentData[] = [];
    chatsCollection?.forEach(chat => {
        chatsCollectionData = [...chatsCollectionData, chat.data()];
    });

    const sortedChatsCollection = useMemo(() => chatsCollectionData.sort((firstValue, secondValue) => {
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
    }), [chatsCollectionData, currentUser?.displayName, sortBy])
    // console.log(chatsCollectionData);



    return (
        <MainWrapper>
            <MainHeader>
                <Title onClick={() => auth.signOut()} >Messeges</Title>


                <SearchPanel chatsCollection={chatsCollection} />


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

            </ChatsWrapper>
        </MainWrapper>
    )
}