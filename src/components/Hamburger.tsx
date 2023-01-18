import styled from 'styled-components';
import 'hamburgers/dist/hamburgers.min.css'

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setIsSidebarActive } from '../redux/slices/sidebarSlice';





export default function Hamburger() {
    const dispatch = useAppDispatch();
    const { isSidebarActive } = useAppSelector(state => state.sidebar);

    const onHamburgerClick = () => {
        dispatch(setIsSidebarActive(!isSidebarActive));
    }



    return (
        <HamburgerWrapper onClick={onHamburgerClick} >
            <button
                className={isSidebarActive ? "hamburger hamburger--slider is-active" : "hamburger hamburger--slider"}
                type="button"
            >
                <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                </span>
            </button>
        </HamburgerWrapper>
    )
}





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