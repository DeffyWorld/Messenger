import styled from 'styled-components';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

import { EnumSortParams } from '../types/enums';

import { IconContext } from 'react-icons';
import { useAppDispatch } from '../redux/hooks';
import { setIsDropdownActive, setSortBy } from '../redux/slices/sortBySlice';





interface Props {
    isDropdownActive: boolean
    sortBy: EnumSortParams
}
export default function SortBy({ isDropdownActive, sortBy }: Props) {
    const dispatch = useAppDispatch();
    const sortParams = [EnumSortParams.Alphabet, EnumSortParams.Newest];

    const toggleDropdown = () => {
        dispatch(setIsDropdownActive(!isDropdownActive));
    }
    const toggleSortByParam = (param: EnumSortParams) => {
        dispatch(setSortBy(param))
        dispatch(setIsDropdownActive(false));
    }



    return (
        <SortByWrapper>
                    <SortByText>Sort by</SortByText>

                    <DropdownWrapper>
                        <SortByParam active onClick={toggleDropdown} >
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





const SortByWrapper = styled.div`
    margin: 8px 0px 0px 26px;
    gap: 4px;
    display: inline-flex;
    position: relative;
    z-index: 10;
`;
const SortByText = styled.p`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 15px;
    line-height: 16px;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.textSecondary};
`;
const DropdownWrapper = styled.div`
    position: relative;
    cursor: pointer;
`;
const Dropdown = styled.div<{ isDropdownActive: boolean }>`
    display: none;

    ${({ isDropdownActive }) => isDropdownActive && `
        position: absolute;
        display: block;
    `}
`;
const SortByParam = styled.div<{active?: boolean}>`
    font-family: 'SFPro';
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.disabled};
    transition: 200ms all ease;

    display: flex;
    align-items: center;
    justify-content: center;

    ${({ active }) => active === true && `
        color: #2D9CDB;
    `}

    &:hover {
        color: #2D9CDB;
    }
`;