import React, { useState, useRef } from 'react'

import styled from 'styled-components';
import { RiQuillPenFill, RiSettings5Fill } from 'react-icons/ri';
import { MdOutlineLogout } from 'react-icons/md';
import { GrFormClose } from 'react-icons/gr';

import { CSSTransition } from 'react-transition-group';
import { Auth, User } from 'firebase/auth';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';















const SidebarWrapper = styled.div<{ isSideBarActive: boolean }>`
    position: relative;
    height: 100vh;
    width: 64px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    transition: 300ms all ease-in-out;

    ${({ isSideBarActive }) => !isSideBarActive && `
        width: 0px;
        padding: 6px 0px;
        z-index: -1;
    `}
`;
const Settings = styled.div`
    position: fixed;
    font-size: 38px;
    top: 8px;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    transition: 300ms all ease;

    &:hover {
        transform: scale(1.1);
    }
`;
const LogOut = styled.div`
    transform: rotateY(180deg);
    position: fixed;
    font-size: 33px;
    bottom: 0px;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    transition: 300ms all ease;

    &:hover {
        transform: rotateY(180deg) scale(1.1);
    }
`;
const Pen = styled.div`
    position: fixed;
    font-size: 36px;
    top: 56px;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    transition: 300ms all ease;

    &:hover {
        transform: scale(1.1);
    }
`;



const StartMessagingWithBg = styled.div<{ isStartMessagingWithOpen: boolean }>`
    position: absolute;
    z-index: -10;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0);
    transition: 300ms all ease;

    ${({ isStartMessagingWithOpen }) => isStartMessagingWithOpen && `
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 500;
    `}
`;
const StartMessagingWith = styled.div`
    position: absolute;
    z-index: 600;
    padding: 24px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.colors.bgPrimary};

    display: flex;
    justify-content: center;
    align-items: center;
`;
const Input = styled.input`
    height: 24px;
    padding: 8px;

    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => theme.colors.textSecondary};

    background: ${({ theme }) => theme.colors.messageBg};
    border: none;
    border-radius: 6px;
`;
const Confirm = styled.div`
    font-family: 'SFPro';
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-left: 8px;
    transition: 200ms all ease;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.highlited};
    }
`;
const Close = styled.div`
    position: absolute;
    z-index: 700;
    font-size: 26px;
    top: 2px;
    right: 2px;
    cursor: pointer;
    transition: 300ms all ease;

    &:hover {
        transform: scale(1.1);
    }
`;















interface Props {
    auth: Auth,
    currentUser: User,
    isSideBarActive: boolean
}
export default function Sidebar({ currentUser, auth, isSideBarActive }: Props) {
    const [isStartMessagingWithOpen, setIsStartMessagingWithOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const ref = useRef(null);

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const startMessagingWithOpenHandler = () => {
        setIsStartMessagingWithOpen(!isStartMessagingWithOpen);
    }

    const confirmHandler = async () => {
        const id = Date.now();

        await setDoc(doc(firestore, "chats", `${id}`), {
            id: id,
            lastTimeMembersRead: {},
            members: [currentUser.email, inputValue],
            messages: arrayUnion({
                chatId: id,
                content: 'Hello!',
                from: currentUser.email,
                time: Date.now(),
                type: 'text'
            }) 
        })

        const currentUserEmail = currentUser.email!.split('.')[0];
        const inputValueEmail = inputValue.split('.')[0];
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            [`lastTimeMembersRead.${currentUserEmail}`]: 0,
            [`lastTimeMembersRead.${inputValueEmail}`]: 0
        })

        setInputValue('');
        setIsStartMessagingWithOpen(false);
    }

    const logOut = () => {
        auth.signOut();
    }



    return (
        <>
            <SidebarWrapper isSideBarActive={isSideBarActive} >
                <Settings>
                    <RiSettings5Fill />
                </Settings>

                <Pen onClick={startMessagingWithOpenHandler} >
                    <RiQuillPenFill />
                </Pen>

                <LogOut onClick={logOut} >
                    <MdOutlineLogout />
                </LogOut>
            </SidebarWrapper>



            <StartMessagingWithBg isStartMessagingWithOpen={isStartMessagingWithOpen} >
                <CSSTransition
                    nodeRef={ref}
                    classNames="elem-transition"
                    in={isStartMessagingWithOpen}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <StartMessagingWith ref={ref} >
                        <Input placeholder='Start messaging with...' value={inputValue} onChange={inputHandler} />

                        <Confirm onClick={confirmHandler} >Confirm</Confirm>

                        <Close onClick={startMessagingWithOpenHandler} >
                            <GrFormClose />
                        </Close>
                    </StartMessagingWith>
                </CSSTransition>
            </StartMessagingWithBg>
        </>
    )
}
