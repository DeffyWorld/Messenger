import React from 'react'

import styled from 'styled-components';










const FoundItemWrapper = styled.div`
  
`;










interface Props {
    photo: string,
    name: string,
    text?: string
}
export default function FoundItem( {photo, name, text}: Props ) {
    return (
        <FoundItemWrapper>

        </FoundItemWrapper>
    )
}
