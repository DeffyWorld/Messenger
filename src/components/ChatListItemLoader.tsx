import styled from "styled-components"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'





export default function ChatListItemLoader() {
    return (
        <Wrapper>
            <Skeleton circle width={46} height={46} />
            
            <Text>
                <Skeleton width={'50%'} height={13} style={{ maxWidth: 120 }} />
                <Skeleton width={'100%'} height={12} style={{ maxWidth: 440 }} />
            </Text>

            <Time>
                <Skeleton width={30} height={12} />
            </Time>
        </Wrapper>
    )
}




const Wrapper = styled.div`
    display: flex;
    height: 58px;
    padding: 6px 10px;
`;
const Text = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0px 10px;
    gap: 5px;
`;
const Time = styled.div`
  
`;