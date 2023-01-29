import styled from 'styled-components';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setIsChatOpen } from '../redux/slices/chatSlice';

import ChatHeaderLoader from './ChatHeaderLoader';





interface Props {
    photoURL: string | undefined,
    displayName: string | undefined,
    isTyping: boolean | undefined,
    isOnline: boolean | undefined,
    wasOnline: number | undefined
}
function ChatHeader({ photoURL, displayName, isTyping, isOnline, wasOnline }: Props) {
    const dispatch = useAppDispatch();

    const dateNow = Date.now();
    const dateWasOnline = wasOnline !== undefined ? new Date(wasOnline) : undefined;
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const navigate = useNavigate();

    const onBackButtonClick = () => {
        dispatch(setIsChatOpen(false));
        window.innerWidth > 992 
            ? navigate('/')
            : setTimeout(() => navigate('/'), 400);
    }



    return (
        <Header>
            <Back>
                <IoIosArrowBack onClick={onBackButtonClick} />
            </Back>

            {
                (photoURL === undefined || displayName === undefined || isTyping === undefined || isOnline === undefined || wasOnline === undefined)
                    ? <ChatHeaderLoader />
                    : <>
                        <Photo src={photoURL} referrerPolicy="no-referrer" />

                        <TextWrapper>
                            <DisplayName>
                                {displayName}
                            </DisplayName>

                            {isOnline === true
                                ? isTyping === true
                                    ? <Status>Typing...</Status>
                                    : <Status>Online</Status>
                                : dateNow - wasOnline < 3600000
                                    ? dateNow - wasOnline < 60000
                                        ? <WasOnline>last seen just now</WasOnline>
                                        : <WasOnline>last seen {Math.floor((dateNow - wasOnline) / 1000 / 60)} minutes ago</WasOnline>
                                    : dateNow - wasOnline < 86400000
                                        ? <WasOnline>last seen at {dateWasOnline!.toLocaleTimeString().split('', 5).join('')}</WasOnline>
                                        : dateNow - wasOnline < 172800000
                                            ? <WasOnline>last seen yesterday</WasOnline>
                                            : dateNow - wasOnline < 604800000
                                                ? <WasOnline>last seen at {dayNames[dateWasOnline!.getDay()]}</WasOnline>
                                                : dateNow - wasOnline < 31556926000
                                                    ? <WasOnline>last seen at {monthNames[dateWasOnline!.getMonth()]}{' '}{dateWasOnline!.getDate()}</WasOnline>
                                                    : <WasOnline>last seen at {dateWasOnline!.toLocaleDateString()}</WasOnline>
                            }
                        </TextWrapper>
                    </>
            }


        </Header>
    )
}

export default memo(ChatHeader);





const Header = styled.div`
    padding: 6px;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.bgPrimary};
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.border};
`;

const Back = styled.button`
    border: none;
    font-size: 28px;
    margin: 0px 0px -8px -7px;
    background: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
`;

const Photo = styled.img`
    width: 42px;
    height: 42px;
    margin-right: 10px;
    object-fit: cover;
    border-radius: 100px;
`;

const TextWrapper = styled.div`
    padding: 3px 0px;
`;
const DisplayName = styled.div`
    padding-bottom: 3px;
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
    white-space: nowrap;
`;
const Status = styled.div`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.highlited};
`;
const WasOnline = styled.div`
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;