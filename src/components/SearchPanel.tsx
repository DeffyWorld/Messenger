import styled, { keyframes } from 'styled-components';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { User } from 'firebase/auth';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { findMessages, findUsers, resetFoundItems, setIsSearchValueEmpty } from '../redux/slices/searchPanelSlice';
import Scrollbars from 'react-custom-scrollbars-2';

import ChatListItem from './ChatListItem';
import { EnumThunkStatus } from '../types/enums';





interface Props {
    currentUser: User | null | undefined
}
function SearchPanel({ currentUser }: Props) {
    const dispatch = useAppDispatch();
    const searchInput = useRef<any>();
    const { foundUsers, foundMessages, isSearchValueEmpty, findUsersStatus, findMessagesStatus, findOrCreateChatStatus } = useAppSelector(state => state.searchPanel);



    const close = useCallback(() => {
        if (searchInput.current) {
            searchInput.current.value = '';
            dispatch(setIsSearchValueEmpty(true));
        }
    }, [dispatch])


    const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (currentUser !== null && currentUser !== undefined) {
            event.target.value === '' && isSearchValueEmpty !== (event.target.value === '')
                ? dispatch(setIsSearchValueEmpty(true))
                : dispatch(setIsSearchValueEmpty(false));
            dispatch(findUsers({ currentUserEmail: currentUser.email!, searchValue: event.target.value }));
            dispatch(findMessages({ searchValue: event.target.value, currentUserEmail: currentUser.email! }));
        }
    }

    useEffect(() => { isSearchValueEmpty && dispatch(resetFoundItems()) }, [dispatch, isSearchValueEmpty]);

    const searchResultHeight = useMemo(() => {
        if (!isSearchValueEmpty) {
            const foundElemHeight = 58;
            if (foundUsers && foundUsers.length !== 0) {
                return foundUsers.length * foundElemHeight;
            }
            if (foundMessages && foundMessages.length !== 0) {
                return foundMessages.length * foundElemHeight + 17;
            }
            if (foundUsers && foundUsers.length !== 0 && foundMessages && foundMessages.length !== 0) {
                return foundUsers.length * foundElemHeight + foundMessages.length * foundElemHeight + 17;
            }
        }
    }, [foundUsers, foundMessages, isSearchValueEmpty])



    return (
        <SearchWrapper round={(foundUsers === undefined || foundUsers.length === 0) && (foundMessages === undefined || foundMessages.length === 0)} >
            <Label>
                <AiOutlineSearch />
                <Input placeholder='Search' ref={searchInput} onChange={searchInputHandler} />
                {findUsersStatus === EnumThunkStatus.Pending || findMessagesStatus === EnumThunkStatus.Pending || findOrCreateChatStatus === EnumThunkStatus.Pending
                    ? !isSearchValueEmpty && <Loader><div></div><div></div><div></div><div></div></Loader>
                    : !isSearchValueEmpty && <Close onClick={close} />
                }
            </Label>

            {!isSearchValueEmpty && currentUser &&
                <SearchResult searchResultHeight={searchResultHeight} >
                    <Scrollbars
                        autoHide
                        autoHideDuration={400}
                        renderView={({ style, ...props }) =>
                            <div
                                style={{ ...style, overflowX: 'auto', marginBottom: '0px' }}
                                {...props}
                            />
                        }
                        renderThumbVertical={({ style, ...props }) => <ThumbVertical style={{ width: '4px' }} {...props} />}
                        renderTrackVertical={props => <TrackVertical {...props} />}
                    >
                        {foundUsers && foundUsers.map((user, index) => (
                            <ChatListItem
                                key={`${user.displayName}_${index}`}
                                email={user.email}
                                displayName={user.displayName}
                                photoURL={user.photoURL}
                                currentUser={currentUser.email!}
                                closeSearchPanel={close}
                            />
                        ))}
                        {foundMessages && foundMessages.length !== 0 && (
                            <FoundMessagesAmount>
                                {`Found ${foundMessages.length} ${foundMessages.length === 1 ? 'message' : 'messages'}`}
                            </FoundMessagesAmount>
                        )}
                        {foundMessages && foundMessages.map((message, index) => (
                            <ChatListItem
                                key={`${message}_${index}`}
                                id={message.chatId}
                                email={message.from}
                                displayName={message.displayName!}
                                photoURL={message.photoURL!}
                                time={message.time}
                                type={message.type}
                                content={message.content}
                                currentUser={currentUser.email!}
                                lastTimeMembersRead={message.lastTimeMembersRead}
                                focusMessage
                            />
                        ))}
                    </Scrollbars>
                </SearchResult>
            }
        </SearchWrapper>
    )
}

export default SearchPanel





const Label = styled.label`
    padding: 8px 8px 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
`;
const Input = styled.input`
    width: 100%;
    margin-left: 10px;
    border: none;
    background: #EEEEEE;

    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
`;
const Close = styled(props => <AiOutlineClose {...props} />)`
    transform: scale(1.2, 1.1);
`;
const ldsRing = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`
const Loader = styled.div`
    display: inline-block;
    position: relative;
    width: 17px;
    height: 17px;
    margin-right: 2px;

    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 17px;
        height: 17px;
        border: 2px solid ${({ theme }) => theme.colors.border};
        border-radius: 50%;
        animation: ${ldsRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${({ theme }) => theme.colors.textSecondary} transparent transparent transparent;

        &:nth-child(1) {
            animation-delay: -0.45s;
        }
        &:nth-child(2) {
            animation-delay: -0.3s;
        }
        &:nth-child(3) {
            animation-delay: -0.15s;
        }
    }
`;



const SearchWrapper = styled.div<{ round?: boolean }>`
    margin: 0px 14px 0px 14px;
    background: ${({ theme }) => theme.colors.searchPanelBg};
    border-radius: 12px 12px 0px 0px;

    ${({ round }) => round && `
        border-radius: 12px; 
    `}
`;
const SearchResult = styled.div<{ searchResultHeight: number | undefined }>`
    margin-bottom: 14px;
    position: absolute;
    z-index: 200;
    left: 14px;
    right: 14px;
    max-height: calc(100% - 28px - 30px - 35px);
    height: ${({ searchResultHeight }) => searchResultHeight!}px;
    background: ${({ theme }) => theme.colors.searchPanelBg};
    border-radius: 0px 0px 12px 12px;
`;
const ThumbVertical = styled.div`
    background-color: ${({ theme }) => theme.colors.scrollbarThumb};
    border-radius: 2.5px;
`;
const TrackVertical = styled.div`
    height: 100%;
    right: 0px;
    background-color: ${({ theme }) => theme.colors.scrollbarTrack};
    cursor: pointer;
`;
const FoundMessagesAmount = styled.div`
    margin-left: 8px;
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
`;