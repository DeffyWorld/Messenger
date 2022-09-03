import React from 'react'
import { useAppDispatch } from '../redux/hooks';
import { removeUser } from '../redux/slices/userSlice';

export default function Main() {
    const dispatch = useAppDispatch();
    function a() {
        dispatch(removeUser());
    }
    return (
        <div onClick={a} >Main</div>
    )
}