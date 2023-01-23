import styled from 'styled-components';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { MessageFields } from '../types/interfaces'
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setIsChatOpen } from '../redux/slices/chatSlice';





interface Props {
    id: number,
    email: string,
    displayName: string,
    photoURL: string,
    isOnline?: boolean,
    currentUser?: string,
    message?: MessageFields,
    lastTimeMembersRead?: any,
    focusMessage?: boolean,
    isActive?: boolean
}
function ChatListItem({ 
    id, 
    email, 
    displayName,
    photoURL,
    isOnline,
    currentUser, 
    message, 
    lastTimeMembersRead,
    focusMessage,
    isActive
}: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const nowDate = Date.now();
    const messageDate = message ? new Date(message.time) : null;

    const onChatListItemClick = () => {
        const focusMessageTimestamp = message ? message.time : null;

        dispatch(setIsChatOpen(true));
        navigate(focusMessage === undefined ? `/chat/${id}` : `/chat/${id}?focusMessage=${focusMessageTimestamp}`);
    }

    const isMessageFromCurrentUser = message?.from === 'user' || message?.from === currentUser ? true : false;


    return (
        <Wrapper onClick={onChatListItemClick} isActive={isActive} >
            <UserImageWrapper>
                <UserImage src={photoURL} referrerPolicy="no-referrer" />
                {isOnline && <IsUserOnlineIndicator />}
            </UserImageWrapper>



            <LinesWrapper>
                <LineWrapper>
                    <ContentWrapper>
                        <DisplayName>{displayName}</DisplayName>
                    </ContentWrapper>

                    {messageDate && message &&
                        <Time>
                            {nowDate - message.time < 172800000
                                ? messageDate.toLocaleTimeString().split('', 5).join('')
                                : nowDate - message.time < 604800000
                                    ? messageDate.toDateString().split(' ')[0]
                                    : nowDate - message.time < 31556926000
                                        ? messageDate.toDateString().split(' ', 2)[1]
                                        : messageDate.toLocaleDateString()
                            }
                        </Time>
                    }
                </LineWrapper>



                {message &&
                    <LineWrapper>
                        {isMessageFromCurrentUser && <TextFromUser>You:</TextFromUser>}
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
                                    <HighlightedText>Photo</HighlightedText>
                                </ImageMessegeWrapper>
                            )}
                        </ContentWrapper>

                        {isMessageFromCurrentUser
                            ? 
                                <IsYourMessegeReadedIndicator>
                                    {
                                        message.time < lastTimeMembersRead[email.split('.')[0]]
                                            ? <BsCheck2All />
                                            : <BsCheck2 />
                                    }
                                </IsYourMessegeReadedIndicator>

                            : email === 'tailorswift@gmail.com' || email === 'barakobama@gmail.com'
                                ? message.time > lastTimeMembersRead['user'] && <UnreadMessegeIndicator />
                                : message.time > lastTimeMembersRead[currentUser!.split('.')[0]] && <UnreadMessegeIndicator />
                        }
                    </LineWrapper>
                }
            </LinesWrapper>
        </Wrapper>
    )
}

export default memo(ChatListItem)





const Wrapper = styled.div<{ isActive?: boolean }>`
    padding: 6px 10px;
    border-radius: 6px;
    transition: all 300ms ease;
    cursor: pointer;

    gap: 10px;
    display: grid;
    grid-template-columns: 1fr 19fr;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.chatBgHover};
    }

    ${({ isActive, theme }) => isActive && `
        background-color: ${theme.colors.chatBgHover};
    `}
`;
const LinesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0px;
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
    width: 46px;
    height: 46px;
`;
const UserImage = styled.img`
    width: 46px;
    height: 46px;
    object-fit: cover;
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
    color: ${({ theme }) => theme.colors.highlited};
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