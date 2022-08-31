import React from 'react'
import { useAppDispatch } from '../redux/hooks';
import { resetActiveUser } from '../redux/slices/activeUserSlice';

export default function Main() {
    const dispatch = useAppDispatch();
    function a() {
        dispatch(resetActiveUser());
    }
    return (
        <div onClick={a} >Main</div>
    )
}