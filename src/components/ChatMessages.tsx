import React, { Fragment, useEffect, useRef, useState } from 'react'

import styled from 'styled-components';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';

import { MessageFields } from '../types/interfaces';

import { CSSTransition } from 'react-transition-group';
import { DocumentData } from 'firebase/firestore';










const Messages = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 55px - 62px);
    overflow-y: auto;
    color: ${({ theme }) => theme.colors.bgPrimary};
    background-color: ${({ theme}) => theme.colors.bgPrimary};

    &::scrollbar {
        width: 7px;
    }
    &::scrollbar-thumb {
        background-color: #D1D1D1;
        border-radius: 20px;
        border: 3px solid #D1D1D1;
    }


    .transition-enter {
        opacity: 0;
        bottom: 50px;
    }
    .transition-enter-active {
        opacity: 1;
        bottom: 80px;
        transition: 400ms;
    }
    .transition-exit {
        opacity: 1;
        bottom: 80px;
    }
    .transition-exit-active {
        opacity: 0;
        bottom: 50px;
        transition: 400ms;
    }
`;

const ScrollToBottomButton = styled.div`
    position: fixed;
    bottom: 80px;
    right: 10px;
    width: 38px;
    height: 38px;
    padding: 4px;
    padding-top: 5px;

    font-size: 29px;
    border-radius: 100px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.messageBg};
`;

const Message = styled.div<{ round: boolean, fromCurrentUser: boolean, isPhoto: boolean }>`
    max-width: 75vw;
    margin: 5px 8px;
    padding: 6px 12px;
    align-self: flex-start;
    background-color: ${({ theme }) => theme.colors.messageBg};
    border-radius: 0px 16px 16px 16px;

    ${({ round }) => round && `
        border-radius: 16px;
        margin-top: -2px;
    `}
    ${({ fromCurrentUser, isPhoto, theme }) => fromCurrentUser && `
        align-self: flex-end;
        border-radius: 16px 0px 16px 16px;
        background-color: ${!isPhoto ? theme.colors.messageFromCurrentUserBg : 'none'};
    `}
    ${({ isPhoto }) => isPhoto && `
        max-height: 240px;
        max-width: 75vw;
        padding: 0px;
        position: relative;
        background-color: none;
    `}
`;
const PhotoMessage = styled(props => <Message as='img' {...props} />)`
    max-height: 240px;
    max-width: 75vw;
    padding: 0px;
    margin: 0px;
`;
const Text = styled.p`
    display: inline;

    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;
const Link = styled(props => <Text as='a' {...props} />)`
    color: ${({ theme }) => theme.colors.highlited};
    text-decoration: none;
    word-break: break-all;
`;
const Time = styled.div<{ isPhoto: boolean, fromCurrentUser: boolean }>`
    position: relative;
    top: 4px;
    bottom: 0px;
    display: inline;
    float: right;
    margin-left: 6px;

    font-family: 'SFPro';
    font-weight: 300;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};

    ${({ isPhoto, fromCurrentUser }) => isPhoto && `
        position: absolute;
        right: ${fromCurrentUser ? `30px` : `12px`};
        top: unset;
        bottom: 4px;
    `}
`;
const ReadedIndicator = styled.div<{ isPhoto: boolean }>` 
    float: right;
    position: relative;
    top: 4px;
    bottom: 0;
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.status};

    ${({ isPhoto }) => isPhoto && `
        position: absolute;
        right: 10px;
        top: unset;
        bottom: 1px;
    `}
`;
const DateIndicator = styled.div`
    display: inline;
    margin: 6px auto;
    
    font-family: 'SFPro';
    font-weight: 500;
    font-size: 13px;
    line-height: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};
    opacity: 0.6;
`;










interface Props {
    focusMessageTimestamp: number | null,
    messages: MessageFields[],
    imageMessagesCount: number,
    chatWith: string,
    chat: DocumentData[]
}
export default function ChatMessages({ focusMessageTimestamp, messages, imageMessagesCount, chatWith, chat }: Props) {
    const messagesRef = useRef<HTMLDivElement>(null);
    const focusMessageRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const nodeRef = useRef(null);



    const [isViewportOnBottom, setIsViewportOnBottom] = useState<boolean>(false);

    const observerCallback = (entries: any) => {
        const [entry] = entries;
        setIsViewportOnBottom(entry.isIntersecting);
    }

    useEffect(() => {
        const lastMessageRefCurrent = messages.length === 1 ? focusMessageRef.current : lastMessageRef.current;

        const observer = new IntersectionObserver(observerCallback, {
            root: messagesRef.current,
            rootMargin: '0px',
            threshold: 1
        });

        lastMessageRefCurrent && observer.observe(lastMessageRefCurrent);

        return () => {
            lastMessageRefCurrent && observer.unobserve(lastMessageRefCurrent);
        }

    }, [messages.length])



    // const [shouldScrollToFocusMessage, setShouldScrollToFocusMessage] = useState<boolean>(true);

    // const timeout = () => {
    //     setTimeout(() => {
    //         setShouldScrollToFocusMessage(false);
    //     }, 3000)
    // }

    // const scrollToFocusMessage = useCallback(() => {
        // shouldScrollToFocusMessage && focusMessageTimestamp
        // ? focusMessageRef.current?.scrollIntoView()
        // // : lastMessageRef.current?.scrollIntoView();

    // }, [focusMessageTimestamp, shouldScrollToFocusMessage])

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView();
    }

    useEffect(() => {
        scrollToBottom();

    }, [messages])

    // useEffect(() => {
    //     scrollToFocusMessage();

    // }, [scrollToFocusMessage])




    return (
        <Messages ref={messagesRef} id={'messages'} >
            {messages.map((message, index) => (
                <Fragment key={`${message.time}_${index}`} >
                    {index === 0 || new Date(+message.time).toLocaleDateString() !== new Date(+messages[index - 1].time).toLocaleDateString() ?
                        Date.now() - new Date(+message.time).getTime() < 86400000
                            ? <DateIndicator>Today</DateIndicator>
                            : Date.now() - new Date(+message.time).getTime() < 172800000
                                ? <DateIndicator>Yesterday</DateIndicator>
                                : Date.now() - new Date(+message.time).getTime() < 604800000
                                    ? <DateIndicator>{new Date(+message.time).toLocaleString('eng', { weekday: 'long' })}</DateIndicator>
                                    : Date.now() - message.time < 31556926000
                                        ? <DateIndicator>
                                            {new Date(+message.time).toLocaleString('eng', { month: 'long' })}{' '}
                                            {new Date(+message.time).getDate()}
                                        </DateIndicator>
                                        : <DateIndicator>
                                            {new Date(+message.time).getDate()}{' '}
                                            {new Date(+message.time).toLocaleString('eng', { month: 'long' })}{' '}
                                            {new Date(+message.time).getFullYear()}
                                        </DateIndicator>
                        : null
                    }

                    <Message
                        round={!(index === 0 || message.from !== messages[index === 0 ? index : index - 1].from)}
                        fromCurrentUser={message.from !== chatWith}
                        isPhoto={message.type === 'image'}
                        ref={message.time === focusMessageTimestamp ? focusMessageRef : lastMessageRef}
                    >
                        {message.type === 'text' && <Text>{message.content}</Text>}
                        {message.type === 'link' && <Link href={message.content} >{message.content}</Link>}
                        {message.type === 'image' &&
                            <PhotoMessage
                                src={message.content}
                                // onLoad={timeout}
                                round={!(index === 0 || message.from !== messages[index === 0 ? index : index - 1].from)}
                                fromCurrentUser={message.from !== chatWith}
                            />
                        }
                        {message.from !== chatWith &&
                            <ReadedIndicator isPhoto={message.type === 'image'} >
                                {message.time < chat![0].lastTimeMembersRead[chatWith.split('.')[0]]
                                    ? <BsCheck2All />
                                    : <BsCheck2 />
                                }
                            </ReadedIndicator>
                        }
                        <Time fromCurrentUser={message.from !== chatWith} isPhoto={message.type === 'image'} >{new Date(+message.time).toLocaleTimeString().split('', 5).join('')}</Time>
                    </Message>
                </Fragment>
            ))}

            <CSSTransition nodeRef={nodeRef} classNames="transition" in={!isViewportOnBottom} timeout={280} mountOnEnter unmountOnExit >
                <ScrollToBottomButton ref={nodeRef} onClick={scrollToBottom} >
                    <FiChevronDown />
                </ScrollToBottomButton>
            </CSSTransition>
        </Messages>
    )
}
