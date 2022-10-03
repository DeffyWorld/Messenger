import React from 'react'

import styled from 'styled-components';










const Wrapper = styled.div`
    padding: 4px 0px;
    display: grid;
    gap: 15px;
    grid-template-columns: 50px 1fr 1fr;
`;



const Photo = styled.div<{ photoURL: string }>`
    height: 50px;
    width: 50px;
    margin-left: 8px;

    background-image: url(${({ photoURL }) => photoURL});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    border-radius: 100px;
`;

const TextWrapper = styled.div`
    padding: 5px 0px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const DisplayName = styled.div`
    width: 130px;
    font-family: SFPro;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const Text = styled.div`
    width: 130px;
    font-family: SFPro;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Time = styled.div`
    margin-top: 5px;
    font-family: SFPro;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    text-align: right;
`;










interface Props {
    displayName: string,
    photoURL: string,
    content?: string
    messageTime?: number
}
export default function FoundItem({ displayName, photoURL, content, messageTime }: Props) {
    return (
        <Wrapper>
            <Photo photoURL={photoURL} />

            <TextWrapper>
                <DisplayName>
                    {displayName}
                </DisplayName>
                {content && (
                    <Text>
                        {content}
                    </Text>
                )}
            </TextWrapper>

            {messageTime &&
                <Time>
                    {new Date().getTime() - messageTime < 172800000
                        ? new Date(+messageTime).toLocaleTimeString().split('', 5).join('')
                        : new Date().getTime() - messageTime < 604800000
                            ? new Date(+messageTime).toDateString().split(' ')[0]
                            : new Date().getTime() - messageTime < 31556926000
                                ? new Date(+messageTime).toDateString().split(' ', 2)[1]
                                : new Date(+messageTime).toLocaleDateString()
                    }
                </Time>
            }
        </Wrapper>
    )
}
