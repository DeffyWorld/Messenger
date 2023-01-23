import styled from 'styled-components';
import { RiQuillPenFill, RiSettings5Fill } from 'react-icons/ri';
import { MdOutlineLogout } from 'react-icons/md';
import { GrFormClose } from 'react-icons/gr';
import { useState, useRef, memo } from 'react'
import { getAuth, User } from 'firebase/auth';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAppSelector } from '../redux/hooks';





interface Props {
    isChatOpen: boolean,
    currentUser: User | null | undefined,
    currentUserLoading: boolean
}
function Sidebar({ isChatOpen, currentUser, currentUserLoading }: Props) {
    const auth = getAuth();

    const [isStartMessagingOpen, setIsStartMessagingOpen] = useState<boolean>(false);
    const { isSidebarActive } = useAppSelector(state => state.sidebar);
    const inputValue = useRef('');

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        inputValue.current = event.target.value;
    }

    const startMessagingOpenHandler = () => {
        setIsStartMessagingOpen(!isStartMessagingOpen);
    }

    const confirmHandler = async () => {
        const id = Date.now();

        await setDoc(doc(firestore, "chats", `${id}`), {
            id: id,
            lastTimeMembersRead: {},
            members: [currentUser!.email, inputValue.current],
            messages: arrayUnion({
                chatId: id,
                content: 'Hello!',
                from: currentUser!.email,
                time: Date.now(),
                type: 'text'
            })
        })

        const currentUserEmail = currentUser!.email!.split('.')[0];
        const inputEmail = inputValue.current.split('.')[0];
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            [`lastTimeMembersRead.${currentUserEmail}`]: 0,
            [`lastTimeMembersRead.${inputEmail}`]: 0
        })

        inputValue.current = '';
        setIsStartMessagingOpen(false);
    }

    const logOut = () => {
        auth.signOut();
    }


    if (currentUserLoading === false && currentUser === null) {
        return (
            <SidebarWrapper isSidebarActive={isSidebarActive} isChatOpen={isChatOpen} >
                <Settings>
                    <RiSettings5Fill />
                </Settings>

                <Pen >
                    <RiQuillPenFill />
                </Pen>

                <LogOut >
                    <MdOutlineLogout />
                </LogOut>
            </SidebarWrapper>
        )
    }

    return (<>
        <SidebarWrapper isSidebarActive={isSidebarActive} isChatOpen={isChatOpen} >
            <Settings>
                <RiSettings5Fill />
            </Settings>

            <Pen onClick={startMessagingOpenHandler} >
                <RiQuillPenFill />
            </Pen>

            <LogOut onClick={logOut} >
                <MdOutlineLogout />
            </LogOut>
        </SidebarWrapper>



        <StartMessagingBg isStartMessagingOpen={isStartMessagingOpen} >
            <StartMessaging isStartMessagingOpen={isStartMessagingOpen} >
                <Input placeholder='Start messaging with...' onChange={inputHandler} />

                <Confirm onClick={confirmHandler} >Confirm</Confirm>

                <Close onClick={startMessagingOpenHandler} >
                    <GrFormClose />
                </Close>
            </StartMessaging>
        </StartMessagingBg>
    </>)
}

export default memo(Sidebar)





const SidebarWrapper = styled.div<{ isSidebarActive: boolean, isChatOpen: boolean }>`
    position: relative;
    height: 100vh;
    width: 64px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    transition: 300ms all ease-in-out;

    ${({ isSidebarActive }) => !isSidebarActive && `
        width: 0px;
        padding: 6px 0px;
    `}  

    @media (${({ theme }) => theme.media.md}) {
        ${({ isChatOpen }) => isChatOpen && `
            width: 0px;
            padding: 6px 0px;
        `}   
    }
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



const StartMessagingBg = styled.div<{ isStartMessagingOpen: boolean }>`
    position: absolute;
    z-index: -10;
    width: 100vw;
    height: 100vh;
    display: flex;
    opacity: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0);
    transition: 400ms all ease-out;

    ${({ isStartMessagingOpen }) => isStartMessagingOpen && `
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 500;
        opacity: 1;
    `}
`;
const StartMessaging = styled.div<{ isStartMessagingOpen: boolean }>`
    transform: scale(0);
    position: absolute;
    z-index: 600;
    padding: 24px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    transition: 300ms all ease;

    display: flex;
    justify-content: center;
    align-items: center;

    ${({ isStartMessagingOpen }) => isStartMessagingOpen && `
        transform: scale(1);
    `}
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