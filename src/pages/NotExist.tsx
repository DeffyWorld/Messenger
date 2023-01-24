import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';





export default function NotExist() {
    const navigate = useNavigate();
    
    const moveBack = () => {
        navigate(-1);
    }



    return (
        <Wrapper>
            <Title>This page does not exist</Title>
            <Navigate onClick={moveBack} >Move back</Navigate>
        </Wrapper>
    )
}





const Wrapper = styled.div`
    width: 100vw;
    height: 70vh;
    min-height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.bgPrimary};
`;
const Title = styled.h1`
    font-family: 'SFPro';
    font-weight: 800;
    font-size: 46px;
    line-height: 52px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;
const Navigate = styled.div`
    margin-top: 4px;
    font-family: 'SFPro';
    font-weight: 700;
    font-size: 36px;
    line-height: 32px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.disabled};
    transition: 250ms all ease;

    &:hover {
        color: ${({ theme }) => theme.colors.highlited};
    }
`;