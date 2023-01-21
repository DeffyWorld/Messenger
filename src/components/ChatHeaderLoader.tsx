import styled from "styled-components"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'





export default function ChatHeaderLoader() {
    return (
        <Wrapper>
            <Skeleton circle width={42} height={42} />

            <Text>
                <Skeleton width={150} height={12} />
                <Skeleton width={80} height={12} />
            </Text>
        </Wrapper>
    )
}





const Wrapper = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
`;
const Text = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 4px;
    margin-top: 4px;
`;