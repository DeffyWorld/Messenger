import React, { useRef, useState } from 'react'

import styled from 'styled-components';
import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { MessageFields } from '../types/interfaces';
import FoundItem from './FoundItem';










const SearchWrapper = styled.div`
    margin-top: 19px;
    width: 100%;
    background: #EEEEEE;
    border-radius: 12px; 
`;
const Label = styled.label`
    padding: 8px 12px;
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
  
`;










interface Props {
    chatsCollection: QuerySnapshot<DocumentData> | undefined
}
export default function SearchPanel({ chatsCollection }: Props) {
    const [foundValue, setfoundValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null!);

    const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfoundValue(event.target.value);
    }
    const hideSearchResult = () => {
        setfoundValue('');
        inputRef.current.blur();
    }


    // let chats: DocumentData[] = []
    // chatsCollection?.forEach(chat => {
    //     chats = [...chats, chat.data()];
    // })


    // const nameSearchResult = chats.filter(chat => {
    //     return chat.displayName.toLocaleLowerCase().includes(foundValue.toLowerCase());
    // })

    // let messages: MessageFields[] = [];
    // chats.forEach(chat => {
    //     chat.messages.forEach((message: MessageFields) => {
    //         if (message.type === 'text') {
    //             messages = [...messages, message];
    //         }
    //     })
    // })
    // const messagesSearchResult = messages.filter(message => {
    //     return message.content.toLocaleLowerCase().includes(foundValue.toLowerCase());
    // })



    return (
        <SearchWrapper>
            <Label>
                <AiOutlineSearch />
                <Input placeholder='Search' value={foundValue} onChange={searchInputHandler} ref={inputRef} />
                <AiOutlineClose style={{ display: foundValue === '' ? 'none' : 'block' }} onClick={hideSearchResult} />
            </Label>

            {foundValue !== '' &&
                <SearchResults>
                    {/* {nameSearchResult.map((chat, index) => (
                        <FoundItem
                            key={`${chat.displayName}_${index}`}
                            photo={chat.photo}
                            name={chat.displayName}
                        />
                    ))}
                    <FoundMessagesAmount>
                        {`Found ${messagesSearchResult.length} messages`}
                    </FoundMessagesAmount>
                    {messagesSearchResult.map((message, index) => (
                        <FoundItem
                            key={`${message}_${index}`}
                            photo={message.photo}
                            name={message.from}
                            text={message.content}
                        />
                    ))} */}
                </SearchResults>
            }
        </SearchWrapper>
    )
}