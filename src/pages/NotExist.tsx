import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';





interface Props {
    chat? : boolean
}
export default function NotExist({ chat }: Props) {
    const navigate = useNavigate();
    
    const moveToMain = () => {
        navigate(-1);
    }



    return (
        <Wrapper>
            <Title>{chat ? 'This chat does not exist' : 'This page does not exist'}</Title>
            <Navigate onClick={moveToMain} >Move back</Navigate>
        </Wrapper>
    )
}





const Wrapper = styled.div`
    width: 100vw;
    height: 70vh;
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