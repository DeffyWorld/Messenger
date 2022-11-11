import React, { useRef } from 'react'

import styled from 'styled-components';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSearchValue } from '../redux/slices/searchPanelSlice';











const SearchWrapper = styled.div`
    position: absolute;
    z-index: 200;
    left: 14px;
    right: 14px;

    background: ${({ theme }) => theme.colors.searchPanelBg};
    border-radius: 12px; 
`;
const Label = styled.label`
    padding: 8px 3px 8px 12px;
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










export default function FakeSearchPanel() {
    const dispatch = useAppDispatch();
    const { searchValue } = useAppSelector(state => state.searchPanel);
    const inputRef = useRef<HTMLInputElement>(null!);

    const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchValue(event.target.value));
    }
    const hideSearchResult = () => {
        dispatch(setSearchValue(''));
        inputRef.current.blur();
    }


    return (
        <SearchWrapper>
            <Label>
                <AiOutlineSearch />
                <Input placeholder='Search' value={searchValue} onChange={searchInputHandler} ref={inputRef} />
                <AiOutlineClose style={{ display: searchValue === '' ? 'none' : 'block' }} onClick={hideSearchResult} />
            </Label>
        </SearchWrapper>
    )
}