import React from 'react'

import styled from 'styled-components';










const Wrapper = styled.div`
    padding: 4px 0px;
    gap: 15px;
    display: grid;
    grid-template-columns: 40px auto auto;
`;



const Photo = styled.div<{ photoURL: string }>`
    width: 40px;
    height: 40px;
    margin-left: 8px;

    background-image: url(${({ photoURL }) => photoURL});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    border-radius: 100px;
`;

const TextWrapper = styled.div`
    padding: 2px 0px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    overflow: hidden;
`;
const DisplayName = styled.div`
    font-family: SFPro;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const Text = styled.div`
    font-family: SFPro;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Time = styled.div`
    margin-top: 5px;
    font-family: SFPro;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
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
