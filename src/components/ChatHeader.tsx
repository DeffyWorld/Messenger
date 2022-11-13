import React from 'react'

import styled from 'styled-components';
import { IoIosArrowBack } from 'react-icons/io';

import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

import { useAppDispatch } from '../redux/hooks';
import { resetChat, resetIsChatOpen } from '../redux/slices/chatSlice';















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
const Photo = styled.div<{ photo: string }>`
    width: 42px;
    height: 42px;
    margin-right: 10px;

    background-image: url(${({ photo }) => photo});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

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
    color: ${({ theme }) => theme.colors.status};
`;
const WasOnline = styled.div`
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;















interface Props {
    chatWith: string
}
export default function ChatHeader({ chatWith }: Props) {
    const [chatWithData, chatWithDataLoading] = useCollectionData(
        query(collection(db, 'users'), where('email', '==', chatWith))
    );


    const dispatch = useAppDispatch();
    const onBackButtonClick = () => {
        dispatch(resetIsChatOpen());
        setTimeout(() => {
            dispatch(resetChat());
        }, 400)
    }


    return (
        !chatWithDataLoading ?
            <Header>
                <Back>
                    <IoIosArrowBack onClick={onBackButtonClick} />
                </Back>

                <Photo photo={chatWithData![0].photoURL} />

                <TextWrapper>
                    <DisplayName>
                        {chatWithData![0].displayName}
                    </DisplayName>

                    {Date.now() + 5500 < chatWithData![0].wasOnline || chatWithData![0].wasOnline === 0
                        ? chatWithData![0].isTyping
                            ? <Status>Typing...</Status>
                            : <Status>Online</Status>
                        : Date.now() - chatWithData![0].wasOnline < 3600000
                            ? Date.now() - chatWithData![0].wasOnline < 60000
                                ? <WasOnline>last seen just now</WasOnline>
                                : <WasOnline>last seen {Math.floor((Date.now() - chatWithData![0].wasOnline) / 1000 / 60)} minutes ago</WasOnline>
                            : Date.now() - chatWithData![0].wasOnline < 86400000
                                ? <WasOnline>last seen at {new Date(chatWithData![0].wasOnline).toLocaleTimeString().split('', 5).join('')}</WasOnline>
                                : Date.now() - chatWithData![0].wasOnline < 172800000
                                    ? <WasOnline>last seen yesterday</WasOnline>
                                    : Date.now() - chatWithData![0].wasOnline < 604800000
                                        ? <WasOnline>last seen at {new Date(chatWithData![0].wasOnline).toDateString().split(' ')[0]}</WasOnline>
                                        : Date.now() - chatWithData![0].wasOnline < 31556926000
                                            ? <WasOnline>last seen at {new Date(chatWithData![0].wasOnline).toDateString().split(' ', 2)[1]}</WasOnline>
                                            : <WasOnline>last seen at {new Date(chatWithData![0].wasOnline).toLocaleDateString()}</WasOnline>
                    }
                </TextWrapper>
            </Header>
        :
            <></>
    )
}