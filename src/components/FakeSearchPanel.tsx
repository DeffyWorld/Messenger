import React from 'react'

import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { useAppDispatch } from '../redux/hooks';
import { setShouldSearchPanelRender } from '../redux/slices/searchPanelSlice';











const SearchWrapper = styled.div`
    position: absolute;
    z-index: 200;
    left: 14px;
    right: 14px;

    background: #EEEEEE;
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

    const onFakeSearchPanelClick = () => {
        dispatch(setShouldSearchPanelRender());
    }


    return (
        <SearchWrapper onClick={onFakeSearchPanelClick} >
            <Label>
                <AiOutlineSearch />
                <Input placeholder='Search' />
            </Label>
        </SearchWrapper>
    )
}