import React from 'react'

import styled from 'styled-components';

import { setIsSideBarActive } from '../redux/slices/mainSlice';





const HamburgerWrapper = styled.div`
    transform: scale(0.6);
    margin-top: -13px;

    .hamburger {
        padding: 0;
    }
    .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
        background-color: ${({ theme }) => theme.colors.textPrimary};
    }
`;





interface Props {
    dispatch: any,
    isSideBarActive: boolean
}
export default function Hamburger({ dispatch, isSideBarActive }: Props) {
    const onHamburgerClick = () => {
        dispatch(setIsSideBarActive());
    }



    return (
        <HamburgerWrapper onClick={onHamburgerClick} >
            <button
                className={isSideBarActive ? "hamburger hamburger--slider is-active" : "hamburger hamburger--slider"}
                type="button"
            >
                <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                </span>
            </button>
        </HamburgerWrapper>
    )
}
