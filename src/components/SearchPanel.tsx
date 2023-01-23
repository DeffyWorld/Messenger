import styled from 'styled-components';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { ChatFields } from '../types/interfaces';
import { DocumentData } from 'firebase/firestore';
import { User } from 'firebase/auth';

import { memo, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { findChats, findMessages, resetFoundItems, setSearchValue } from '../redux/slices/searchPanelSlice';
import Scrollbars from 'react-custom-scrollbars-2';

import ChatListItem from './ChatListItem';





interface Props {
    currentUser: User | null | undefined,
    chatList: ChatFields[] | undefined,
    membersData: DocumentData[] | undefined
}
function SearchPanel({ currentUser, membersData, chatList }: Props) {
    const dispatch = useAppDispatch();
    const { foundChats, foundMessages, searchValue } = useAppSelector(state => state.searchPanel);



    const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (currentUser !== null && currentUser !== undefined) {
            dispatch(setSearchValue(event.target.value));
            dispatch(findChats(chatList));
            dispatch(findMessages({
                chatList: chatList,
                membersData: membersData,
                searchValue: searchValue,
                currentUserEmail: currentUser.email
            }));
        }
    }

    useEffect(() => { searchValue === '' && dispatch(resetFoundItems()) }, [dispatch, searchValue]);

    const searchResultHeight = useMemo(() => {
        if (searchValue !== '') {
            const foundElemHeight = 58;
            if (foundMessages.length === 0) {
                return foundChats.length * foundElemHeight
            } else {
                return foundChats.length * foundElemHeight + foundMessages.length * foundElemHeight + 17
            }
        }
    }, [foundChats.length, foundMessages.length, searchValue])



    return (
        <SearchWrapper searchValue={searchValue !== ''} >
            <Label>
                <AiOutlineSearch />
                <Input placeholder='Search' value={searchValue} onChange={searchInputHandler} />
                <Close style={{ display: searchValue === '' ? 'none' : 'block' }} />
            </Label>

            {searchValue && currentUser &&
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
                        {foundChats.map((chat, index) => (
                            <ChatListItem
                                key={`${chat.memberData!.displayName}_${index}`}
                                id={chat.id}
                                email={chat.memberData!.email!}
                                displayName={chat.memberData!.displayName}
                                photoURL={chat.memberData!.photoURL}
                            />
                        ))}
                        {foundMessages.length !== 0 && (
                            <FoundMessagesAmount>
                                {`Found ${foundMessages.length} messages`}
                            </FoundMessagesAmount>
                        )}
                        {foundMessages.map((message, index) => (
                            <ChatListItem
                                key={`${message}_${index}`}
                                id={message.chatId}
                                email={message.from}
                                displayName={message.displayName!}
                                photoURL={message.photoURL!}
                                currentUser={currentUser.email!}
                                message={message}
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

export default memo(SearchPanel)





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



const SearchWrapper = styled.div<{ searchValue?: boolean }>`
    margin: 0px 14px 0px 14px;
    background: ${({ theme }) => theme.colors.searchPanelBg};
    border-radius: 12px; 

    ${({ searchValue }) => searchValue && `
        border-radius: 12px 12px 0px 0px;
    `}
`;
const SearchResult = styled.div<{ searchResultHeight: number | undefined }>`
    position: absolute;
    z-index: 200;
    left: 14px;
    right: 14px;
    max-height: calc(100vh - 28px - 30px - 35px);
    min-height: -webkit-fill-available;
    height: -webkit-fill-available;
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