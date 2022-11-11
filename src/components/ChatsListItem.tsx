import React from 'react'

import styled from 'styled-components';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';

import { MessageFields } from '../types/interfaces'
import { useAppDispatch } from '../redux/hooks';
import { setChat } from '../redux/slices/chatSlice';










const Wrapper = styled.div`
    padding: 6px 6px;
    border-radius: 6px;
    transition: all 300ms ease;
    cursor: pointer;

    gap: 10px;
    display: grid;
    grid-template-columns: 1fr 19fr;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.chatBgHover};
    }
`;
const LinesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3px 0px;
`;
const LineWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
`;
const ContentWrapper = styled.div`
    display: grid;
`;



const IsUserOnlineIndicator = styled.div`
    position: absolute;
    z-index: 101;
    width: 11px;
    height: 11px;
    left: 34px;
    top: 34px;

    background: ${({ theme }) => theme.colors.status};
    border: 1px solid ${({ theme }) => theme.colors.bgPrimary};
    border-radius: 100px;
`;
const IsYourMessegeReadedIndicator = styled.div`
    margin-left: auto;
    color: ${({ theme }) => theme.colors.status};
`;
const UnreadMessegeIndicator = styled.div`
    flex-shrink: 0;
    margin-left: auto;
    width: 11px;
    height: 11px;
    background: ${({ theme }) => theme.colors.status};
    border-radius: 100px;
`;


const UserImageWrapper = styled.div`
    position: relative;
`;
const UserImage = styled.div<{ photoURL: string }>`
    width: 46px;
    height: 46px;

    background-image: url(${({ photoURL }) => photoURL});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    border-radius: 100px;
`;

const DisplayName = styled.div`
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TextFromUser = styled.div`
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;
const Text = styled.div`
    flex: 1;
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const HighlightedText = styled(Text)`
    color: ${({ theme }) => theme.colors.highlited};
`;

const ImageMessegeWrapper = styled.div`
    display: flex;
    align-items: center;
`;
const ContentImage = styled.div<{ image: string }>`
    height: 16px;
    width: 16px;
    margin-right: 4px;

    background-image: url(${({ image }) => image});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
`;


const Time = styled.div`
    margin-left: auto;

    font-family: 'SFPro';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
`;











interface Props {
    id: number,
    email: string,
    displayName: string,
    photoURL: string,
    wasOnline?: number,
    currentUser?: string,
    message?: MessageFields,
    lastTimeMembersRead?: any
}
export default function ChatListItem({ 
    id, 
    email, 
    displayName,
    photoURL, 
    wasOnline = 1, 
    currentUser, 
    message, 
    lastTimeMembersRead 
}: Props) {
    const ismessageFromCurrentUser = message?.from === 'user' || message?.from === currentUser ? true : false;
    const isChatUserOnline = Date.now() + 5500 < wasOnline || wasOnline === 0 ? true : false;


    const dispatch = useAppDispatch();
    const onChatListItemClick = () => {
        const focusMessageTimestamp = message ? message.time : null;
        dispatch(setChat({email, id, focusMessageTimestamp}));
    }


    return (
        <Wrapper onClick={onChatListItemClick} >
            <UserImageWrapper>
                <UserImage photoURL={photoURL} />
                {isChatUserOnline &&
                    (<IsUserOnlineIndicator />)
                }
            </UserImageWrapper>




            <LinesWrapper>
                <LineWrapper>
                    <ContentWrapper>
                        <DisplayName>
                            {displayName}
                        </DisplayName>
                    </ContentWrapper>

                    {message &&
                        <Time>
                            {Date.now() - message.time < 172800000
                                ? new Date(+message.time).toLocaleTimeString().split('', 5).join('')
                                : Date.now() - message.time < 604800000
                                    ? new Date(+message.time).toDateString().split(' ')[0]
                                    : Date.now() - message.time < 31556926000
                                        ? new Date(+message.time).toDateString().split(' ', 2)[1]
                                        : new Date(+message.time).toLocaleDateString()
                            }
                        </Time>
                    }
                </LineWrapper>



                {message &&
                    <LineWrapper>
                        {ismessageFromCurrentUser && <TextFromUser>You:</TextFromUser>}
                        <ContentWrapper>
                            {message.type === 'text' &&
                                (<Text>
                                    {message.content}
                                </Text>)
                            }
                            {message.type === 'link' &&
                                (<HighlightedText>
                                    {message.content}
                                </HighlightedText>)
                            }
                            {message.type === 'image' && (
                                <ImageMessegeWrapper>
                                    <ContentImage image={message.content} />
                                    <HighlightedText>
                                        Photo
                                    </HighlightedText>
                                </ImageMessegeWrapper>
                            )}
                        </ContentWrapper>

                        {ismessageFromCurrentUser
                            ? <IsYourMessegeReadedIndicator>
                                {message.time < lastTimeMembersRead[email]
                                    ? <BsCheck2All />
                                    : <BsCheck2 />
                                }
                            </IsYourMessegeReadedIndicator>
                            : email === 'tailorswift@gmail.com' && email === 'tailorswift@gmail.com'
                                ? message.time > lastTimeMembersRead['user'] && <UnreadMessegeIndicator />
                                : message.time > lastTimeMembersRead[currentUser!] && <UnreadMessegeIndicator />
                        }
                    </LineWrapper>
                }
            </LinesWrapper>
        </Wrapper>
    )
}
