import { EnumMessageType } from '../types/enums';
import 'react-lazy-load-image-component/src/effects/blur.css';

import styled from 'styled-components';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { ForwardedRef, forwardRef, memo } from 'react';
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component';






interface Props {
    time: number,
    from: string,
    type: EnumMessageType,
    content: string,
    minifiedContent?: string,
    contentWidth?: number,
    contentHeight?: number,
    isFirstMessage: boolean
    prevMessageTime?: number,
    prevMessageFrom?: string,
    chatWith: string,
    readed?: boolean
    scrollPosition?: ScrollPosition
}
function Message(props: Props, ref: ForwardedRef<HTMLDivElement>) {
    const nowDate = Date.now();
    const messageDate = new Date(props.time);
    const prevMessageDate = props.prevMessageTime ? new Date(props.prevMessageTime) : null;
    const contentWidth = props.contentWidth;
    const contentHeight = props.contentHeight;



    return (<>
        {(prevMessageDate === null || messageDate.toLocaleDateString() !== prevMessageDate.toLocaleDateString()) ?
            nowDate - props.time < 3600000
                ? <DateIndicator>Today</DateIndicator>
                : nowDate - props.time < 172800000
                    ? <DateIndicator>Yesterday</DateIndicator>
                    : nowDate - props.time < 604800000
                        ? <DateIndicator>{messageDate.toLocaleString('eng', { weekday: 'long' })}</DateIndicator>
                        : nowDate - props.time < 31556926000
                            ? <DateIndicator>
                                {messageDate.toLocaleString('eng', { month: 'long' })}{' '}
                                {messageDate.getDate()}
                            </DateIndicator>
                            : <DateIndicator>
                                {messageDate.getDate()}{' '}
                                {messageDate.toLocaleString('eng', { month: 'long' })}{' '}
                                {messageDate.getFullYear()}
                            </DateIndicator>
            : null
        }

        <MessageWrapper
            round={props.from === props.prevMessageFrom && !props.isFirstMessage && messageDate.toLocaleDateString() === prevMessageDate!.toLocaleDateString()}
            fromCurrentUser={props.from !== props.chatWith}
            isPhoto={props.type === EnumMessageType.Image}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            ref={ref}
        >
            {props.type === EnumMessageType.Text && <Text>{props.content}</Text>}
            {props.type === EnumMessageType.Link && <Link href={props.content} >{props.content}</Link>}
            {props.type === EnumMessageType.Image &&
                <LazyLoadImage
                    src={props.content}
                    placeholderSrc={props.minifiedContent}
                    effect="blur"
                    threshold={30}
                    scrollPosition={props.scrollPosition}
                    wrapperClassName={'blur-wrapper'}
                    style={{ width: 'inherit', height: 'inherit', maxWidth: '100%', maxHeight: '240px', borderRadius: 'inherit', objectFit:'cover' }}
                />
            }

            {props.from !== props.chatWith &&
                <ReadedIndicator isPhoto={props.type === 'image'} >
                    {props.readed
                        ? <BsCheck2All />
                        : <BsCheck2 />
                    }
                </ReadedIndicator>
            }

            <Time fromCurrentUser={props.from !== props.chatWith} isPhoto={props.type === 'image'} >
                {messageDate.toLocaleTimeString().split('', 5).join('')}
            </Time>
        </MessageWrapper>
    </>)
}

export default memo(forwardRef(Message));





const MessageWrapper = styled.div<{ round: boolean, fromCurrentUser: boolean, isPhoto: boolean, contentWidth?: number, contentHeight?: number }>`
    max-width: 75%;
    margin: 5px 8px;
    padding: 6px 12px;
    align-self: flex-start;
    background-color: ${({ theme }) => theme.colors.messageBg};
    border-radius: 0px 16px 16px 16px;

    ${({ fromCurrentUser, theme }) => fromCurrentUser && `
        align-self: flex-end;
        border-radius: 16px 0px 16px 16px;
        background-color: ${theme.colors.messageFromCurrentUserBg};
    `}
    ${({ round }) => round && `
        border-radius: 16px;
        margin-top: -2px;
    `}
    ${({ isPhoto }) => isPhoto && `
        padding: 0px;
        margin: 6px 12px;
        position: relative;
        background-color: initial;
    `}
    ${({ contentWidth, contentHeight}) => contentWidth && contentHeight && `
        height: ${contentHeight}px;
        width: ${contentWidth}px;
    `}

    .blur-wrapper {
        width: inherit;
        max-width: 100%;
        height: inherit;
        max-height: 240px;
        display: flex;
        border-radius: inherit;
    }
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

    ${({ isPhoto, fromCurrentUser, theme }) => isPhoto && `
        color: ${theme.colors.messageBg};
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