import React from 'react'

import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';










const Label = styled.label`
    margin-top: 19px;
    width: 100%;
    padding: 8px 12px;
    background: #EEEEEE;
    border-radius: 12px;
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
    return (
        <Label>
            <AiOutlineSearch/>
            <Input placeholder='Search'/>
        </Label>
    )
}