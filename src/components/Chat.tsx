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
    width: 100vw;
    margin-right: -100vw;
    background: ${({ theme }) => theme.colors.bgPrimary};
`;
const ChatLoader = styled.div`
    background-color: black;
    height: 100vh;
    width: 100vw;
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
    let imageMessagesCount: number = 0;
    !chatsLoading && messages.forEach(message => {
        message.type === 'image' && imageMessagesCount++;
    })
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
                const currentUserEmail = currentUser.email!.split('.')[0];
                updateDoc(doc(db, 'chats', `${id}`), {
                    [`lastTimeMembersRead.${currentUserEmail}`]: Date.now()
                })
            }
        }

    }, [chatWith, currentUser, id, lastMessageTimestamp])



    return (
            <Wrapper>
                {chatWith !== '' ?
                    <>
                        <ChatHeader chatWith={chatWith} />

                        <ChatMessages
                            focusMessageTimestamp={focusMessageTimestamp}
                            messages={messages}
                            imageMessagesCount={imageMessagesCount}
                            chatWith={chatWith}
                            chat={chat!}
                        />

                        <ChatInputField id={id} currentUser={currentUser!.email!} />
                    </>
                    : 
                    <ChatLoader />
                }
            </Wrapper>
    )
}