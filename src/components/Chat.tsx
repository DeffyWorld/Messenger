import React, { useEffect, useMemo } from 'react'

import styled from 'styled-components';

import { MessageFields } from '../types/interfaces';

import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInputField from './ChatInputField';















const Wrapper = styled.div`
    width: 100%;
    background: ${({ theme }) => theme.colors.bgPrimary};



    .children-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 60px - 65px);
        overflow-y: scroll; 

        &::scrollbar {
            width: 7px;
        }
        &::scrollbar-thumb {
            background-color: #D1D1D1;
            border-radius: 20px;
            border: 3px solid #D1D1D1;
        }
    }
`;















interface Props {
    id: number,
    focusMessageTimestamp: number | null
}
export default function Chat({ id, focusMessageTimestamp }: Props) {
    const [chat, chatsLoading] = useCollectionData(
        query(collection(db, 'chats'), where('id', '==', id))
    );

    const messages: MessageFields[] = !chatsLoading && chat![0].messages;
    const lastMessageTimestamp = !chatsLoading && messages[messages.length - 1].time;



    const auth = getAuth();
    const [currentUser] = useAuthState(auth);

    const chatWith = useMemo(() => {
        let returnString: string = '';
        chat && chat[0].members.forEach((member: string) => {
            if (member !== currentUser?.email && member !== 'user') {
                returnString = member;
            }
        })
        return returnString

    }, [chat, currentUser])



    useEffect(() => {
        if (chatWith !== '' && currentUser) {
            if (chatWith === 'tailorswift@gmail.com' || chatWith === 'barakobama@gmail.com') {
                updateDoc(doc(db, 'chats', `${id}`), {
                    'lastTimeMembersRead.user': Date.now()
                })
            } else {
                updateDoc(doc(db, 'chats', `${id}`), {
                    [`lastTimeMembersRead.${currentUser.email}`]: Date.now()
                })
            }
        }

    }, [chatWith, currentUser, id, lastMessageTimestamp])



    return (
        chatWith !== '' ?
            <Wrapper>
                <ChatHeader chatWith={chatWith} />

                <ChatMessages 
                    focusMessageTimestamp={focusMessageTimestamp}
                    messages={messages}
                    chatWith={chatWith}
                    chat={chat!}
                />

                <ChatInputField id={id} currentUser={currentUser!.email!} />
            </Wrapper>
            :
            <></>
    )
}