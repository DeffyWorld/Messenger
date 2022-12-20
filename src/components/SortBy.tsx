import React from 'react'

import styled from 'styled-components';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

import { EnumSortParams } from '../types/enums';

import { IconContext } from 'react-icons';
import { setIsDropdownActive, setSortBy } from '../redux/slices/mainSlice';










const SortByWrapper = styled.div`
    margin: 46px 0px 4px 13px;
    gap: 4px;
    display: flex;
`;
const SortByText = styled.p`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.textSecondary};
`;
const DropdownWrapper = styled.div`
    position: relative;
`;
const Dropdown = styled.div<{ isDropdownActive: boolean }>`
    display: none;

    ${({ isDropdownActive }) => isDropdownActive && `
        position: absolute;
        display: block;
    `}
`;
const SortByParam = styled.div`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #2D9CDB;

    display: flex;
    align-items: center;
    justify-content: center;
`;










interface Props {
    dispatch: any,
    isDropdownActive: boolean
    sortBy: EnumSortParams
}
export default function SortBy({ dispatch, isDropdownActive, sortBy }: Props) {
    const sortParams = [EnumSortParams.Alphabet, EnumSortParams.Newest];

    const toggleDropdown = () => {
        setIsDropdownActive(!isDropdownActive);
    }
    const toggleSortByParam = (param: string) => {
        dispatch(setSortBy(param));
        setIsDropdownActive(false);
    }



    return (
        <SortByWrapper>
                    <SortByText>Sort by</SortByText>

                    <DropdownWrapper>
                        <SortByParam onClick={toggleDropdown} >
                            {sortBy}
                            <IconContext.Provider value={{ style: { margin: '2px 0 0 0' } }}>
                                {isDropdownActive
                                    ? (<BiChevronUp />)
                                    : (<BiChevronDown />)
                                }
                            </IconContext.Provider>
                        </SortByParam>

                        <Dropdown isDropdownActive={isDropdownActive} >
                            {sortParams.map((param, index) => (
                                param !== sortBy && (
                                    <SortByParam key={`${param}_${index}`} onClick={() => toggleSortByParam(param)}>
                                        {param}
                                    </SortByParam>
                                )
                            ))}
                        </Dropdown>
                    </DropdownWrapper>
                </SortByWrapper>
    )
}
