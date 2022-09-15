import React from 'react'
import Main from '../components/Main'
import MainLoader from '../components/MainLoader'


interface Props {
    currentUserLoading: boolean
}
export default function MainPage({currentUserLoading}: Props) {
    return (
        currentUserLoading ?
            <MainLoader/>
        :
            <Main/>
    )
}