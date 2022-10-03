import React, { useMemo, useRef, useState } from 'react'

import styled from 'styled-components';
import { MessageFields } from '../types/interfaces';

import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { collection, DocumentData, query, where } from 'firebase/firestore'
import { useCollectionData, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

import FoundItem from './FoundItem';










const SearchWrapper = styled.div`
    position: absolute;
    z-index: 200;
    left: 14px;
    right: 14px;

    background: #EEEEEE;
    border-radius: 12px; 

    max-height: 90vh;
    overflow-y: scroll; 

    &::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #D1D1D1;
        border-radius: 20px;
        border: 3px solid #D1D1D1;
    }
`;
const Label = styled.label`
    padding: 8px 3px 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
`;
const Input = styled.input<{ ref: any }>`
    width: 100%;
    margin-left: 10px;
    border: none;
    background: #EEEEEE;

    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
`;



const SearchResults = styled.div`
  
`;

const FoundMessagesAmount = styled.div`
    margin-left: 8px;
`;










export default function SearchPanel() {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null!);

    const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }
    const hideSearchResult = () => {
        setInputValue('');
        inputRef.current.blur();
    }





    const auth = getAuth();
    const [currentUser] = useAuthState(auth);

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

    const [foundChatsCollection] = useCollectionDataOnce(
        query(collection(db, 'users'), where('email', 'in', membersExludeUser))
    );

    const foundChats = useMemo(() => {
        let returnArr: DocumentData[] = [];
        foundChatsCollection?.forEach(member => {
            if (member.displayName.toLocaleLowerCase().includes(inputValue.toLowerCase())) {
                returnArr = [...returnArr, member];
            }
        })
        return returnArr;

    }, [inputValue, foundChatsCollection])



    const foundMessages = useMemo(() => {
        let returnArr: MessageFields[] = [];
        chatsCollection?.forEach(chat => {
            chat.messages.forEach((message: MessageFields) => {
                if (message.type === 'text' && message.content.toLocaleLowerCase().includes(inputValue.toLowerCase())) {
                    returnArr = [...returnArr, message];
                }
            })
        })
        return returnArr;

    }, [chatsCollection, inputValue])

    const foundMessagesFrom = useMemo(() => {
        let returnArr: string[] = [''];
        foundMessages.forEach(message => {
            if (message.from === 'user') {
                message.from = currentUser?.email!
            }
            if (returnArr.indexOf(message.from) === -1) {
                returnArr = [...returnArr, message.from];
            }
        })
        return returnArr;

    }, [currentUser?.email, foundMessages])

    const [foundMessagesFromData] = useCollectionDataOnce(
        query(collection(db, 'users'), where('email', 'in', foundMessagesFrom))
    );

    const foundMessagesWithUserData = useMemo(() => {
        let returnArr: MessageFields[] = [];
        foundMessages.forEach(message => {
            foundMessagesFromData?.forEach(user => {
                for (const key in user) {
                    if (key === 'email' && message.from === user[key]) {
                        message.displayName = user.displayName;
                        message.photoURL = user.photoURL;
                        returnArr = [...returnArr, message];
                    }
                }
            })
        })
        return returnArr;

    }, [foundMessages, foundMessagesFromData])





    return (
        <SearchWrapper>
            <Label>
                <AiOutlineSearch />
                <Input placeholder='Search' value={inputValue} onChange={searchInputHandler} ref={inputRef} />
                <AiOutlineClose style={{ display: inputValue === '' ? 'none' : 'block' }} onClick={hideSearchResult} />
            </Label>

            {inputValue !== '' &&
                <SearchResults>
                    {foundChats.map((chat, index) => (
                        <FoundItem
                            key={`${chat.displayName}_${index}`}
                            displayName={chat.displayName}
                            photoURL={chat.photoURL}
                        />
                    ))}
                    {foundMessagesWithUserData.length !== 0 && (
                        <FoundMessagesAmount>
                            {`Found ${foundMessagesWithUserData.length} messages`}
                        </FoundMessagesAmount>
                    )}
                    {foundMessagesWithUserData.map((message, index) => (
                        <FoundItem
                            key={`${message}_${index}`}
                            displayName={message.displayName!}
                            photoURL={message.photoURL!}
                            content={message.content}
                            messageTime={message.time}
                        />
                    ))}
                </SearchResults>
            }
        </SearchWrapper>
    )
}