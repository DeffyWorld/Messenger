import React, { useState } from 'react'

import { EnumSortParams } from '../types/global';
import styled from 'styled-components';

import SearchPanel from '../components/SearchPanel';
import { useDispatch } from 'react-redux';
import { removeUser } from '../redux/slices/userSlice';









const MainWrapper = styled.section`
    padding: 14px;
`;



const Title = styled.h1`
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 800;
    font-size: 23px;
    line-height: 16px;
    color: ${({theme}) => theme.colors.textPrimary};
`;



const SortBy = styled.div`
    
`;
const SortByText = styled.p`
  
`;
const Dropdown = styled.div`
  
`;
const SortByParam = styled.div`
  
`;










export default function Main() {
    const dispatch = useDispatch();



    // SortBy

    const sortParams = [EnumSortParams.Newest, EnumSortParams.Alphabet]
    const [sortBy, setSortBy] = useState<EnumSortParams>(EnumSortParams.Newest)

    const sortByHandler = (param: EnumSortParams) => {
        setSortBy(param);
    }


    return (
        <MainWrapper>
            <Title onClick={() => dispatch(removeUser())} >Messeges</Title>


            <SearchPanel/>


            <SortBy>
                <SortByText>SortBy</SortByText>
                <Dropdown>
                    <SortByParam>{sortBy}</SortByParam>
                    {sortParams.map((param, index) => (
                        param !== sortBy && (
                            <SortByParam key={`${param}_${index}`} onClick={() => sortByHandler(param)}>
                                {param}
                            </SortByParam>
                        )
                    ))}
                </Dropdown>
            </SortBy>
        </MainWrapper>
    )
}