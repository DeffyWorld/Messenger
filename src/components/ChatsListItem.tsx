import React from 'react'

import styled from 'styled-components';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';

import { MessageFields } from '../types/interfaces'










const Wrapper = styled.div`
    margin: 12px 0px;
    gap: 10px;
    display: grid;
    grid-template-columns: 1fr 19fr;
`;
const LinesWrapper = styled.div``;
const LineWrapper = styled.div`
    position: relative;
    padding: 3.5px 0;
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

    background: ${({ theme }) => theme.colors.highlited};
    border: 1px solid ${({ theme }) => theme.colors.bgSecondary};
    border-radius: 100px;
`;
const IsYourMessegeReadedIndicator = styled.div`
    margin-left: auto;
    color: ${({ theme }) => theme.colors.highlited};
`;
const UnreadMessegeIndicator = styled.div`
    margin-left: auto;
    width: 11px;
    height: 11px;
    background: ${({ theme }) => theme.colors.highlited};
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
    uid: string,
    displayName: string,
    photoURL: string,
    isTyping: boolean,
    wasOnline: number,
    currentUser: string
    lastMessage: MessageFields
}
export default function ChatListItem({ uid, displayName, photoURL, isTyping, wasOnline, currentUser, lastMessage }: Props) {
    const nowTimestamp = new Date().getTime();
    const isLastMessageFromCurrentUser = lastMessage.from === 'user' || lastMessage.from === currentUser ? true : false;
    const isChatUserOnline = nowTimestamp + 5500 < wasOnline || wasOnline === 0 ? true : false;


    return (
        <Wrapper>
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
                    

                    <Time>
                        {new Date().getTime() - lastMessage.time < 172800000
                            ? new Date(+lastMessage.time).toLocaleTimeString().split('', 5).join('')
                            : new Date().getTime() - lastMessage.time < 604800000
                                ? new Date(+lastMessage.time).toDateString().split(' ')[0]
                                : new Date().getTime() - lastMessage.time < 31556926000
                                    ? new Date(+lastMessage.time).toDateString().split(' ', 2)[1]
                                    : new Date(+lastMessage.time).toLocaleDateString()
                        }
                    </Time>
                </LineWrapper>



                <LineWrapper>
                    {isLastMessageFromCurrentUser && <TextFromUser>You:</TextFromUser>}
                    <ContentWrapper>
                        {lastMessage.type === 'text' &&
                            (<Text>
                                {lastMessage.content}
                            </Text>)
                        }
                        {lastMessage.type === 'link' &&
                            (<HighlightedText>
                                {lastMessage.content}
                            </HighlightedText>)
                        }
                        {lastMessage.type === 'image' && (
                            <ImageMessegeWrapper>
                                <ContentImage image={lastMessage.content} />
                                <HighlightedText>
                                    Photo
                                </HighlightedText>
                            </ImageMessegeWrapper>
                        )}
                    </ContentWrapper>

                    {isLastMessageFromCurrentUser
                        ? (<IsYourMessegeReadedIndicator>
                            {lastMessage.readed
                                ? <BsCheck2All/>
                                : <BsCheck2 />
                            }
                        </IsYourMessegeReadedIndicator>)
                        : (<UnreadMessegeIndicator />)
                    }
                </LineWrapper>
            </LinesWrapper>
        </Wrapper>
    )
}
