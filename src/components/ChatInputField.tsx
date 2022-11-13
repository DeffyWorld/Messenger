import React from 'react'

import styled from 'styled-components';
import { AiOutlinePaperClip } from 'react-icons/ai';

import { ChatInputFields } from '../types/interfaces';

import { useForm } from 'react-hook-form';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import {  db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';














const Form = styled.form`
    height: 62px;
    border-top: 2px solid ${({ theme }) => theme.colors.bgSecondary};
    background-color: ${({ theme}) => theme.colors.bgPrimary};

    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageInput = styled.input`
    display: none;
`;
const ImageLabel = styled.label<{ isEmpty: boolean }>`
    width: 42px;
    height: 42px;
    padding: 12px;
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textSecondary};

    ${({ isEmpty, theme }) => !isEmpty && `
        color: ${theme.colors.highlited};
    `}
`;

const TextInput = styled.input`
    width: calc(100vw - 42px - 32px - 20px);
    height: 36px;
    padding: 12px 9px;

    font-family: 'SFPro';
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => theme.colors.textSecondary};

    background: ${({ theme }) => theme.colors.messageBg};
    border: none;
    border-radius: 12px;
`;

const Send = styled.button<{ isValid: boolean }>`
    margin: 0 10px;
    padding: 0px;
    width: 32px;
    height: 17px;

    font-family: 'SFPro';
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => theme.colors.status};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    border: none;

    ${({ isValid, theme }) => !isValid && `
        color: ${theme.colors.disabled};
    `}
`;

const Errors = styled.div`
  
`;















interface Props {
    id: number,
    currentUser: String
}
export default function ChatInputField({ id, currentUser }: Props) {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setValue
    } = useForm<ChatInputFields>({
        mode: "onSubmit"
    });

    const imageField = watch('image');
    const textField = watch('text');


    const isStringUrl = (str: string): boolean => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    const onSubmit = async (data: ChatInputFields) => {
        if (data.text !== '') {
            updateDoc(doc(db, 'chats', `${id}`), {
                messages: arrayUnion({
                    chatId: id,
                    content: data.text,
                    from: currentUser,
                    time: Date.now(),
                    type: isStringUrl(data.text) ? 'link' : 'text'
                }) 
            })
        }

        if (imageField?.length !== 0) {
            const image: any = imageField?.length !== 0 && data.image[0];
            const storageRef = ref(storage, `images/${Date.now()}${image.name}`)

            await uploadBytes(storageRef, image)
            const imageUrl = await getDownloadURL(storageRef);

            updateDoc(doc(db, 'chats', `${id}`), {
                messages: arrayUnion({
                    chatId: id,
                    content: imageUrl,
                    from: currentUser,
                    time: Date.now(),
                    type: 'image'
                }) 
            })
        }
        
        setValue('text', '');
        setValue('image', '');
    }



    return (
        <Form onSubmit={handleSubmit(onSubmit)} >
            <ImageInput
                type={'file'}
                accept={'image/*'}
                id={'image'}
                {...register('image', {
                    
                })}
            />
            <ImageLabel htmlFor={'image'} isEmpty={imageField?.length === 0} >
                <AiOutlinePaperClip />
            </ImageLabel>

            <TextInput
                type={'text'}
                placeholder={'Type your message here..'}
                {...register('text', {
                    maxLength: {
                        value: 200,
                        message: 'Not more than two hundred characters',
                    }
                })}
            />

            <Send onClick={handleSubmit(onSubmit)} isValid={imageField?.length !== 0 || textField !== ''} >Send</Send>

            {errors && (
                <Errors></Errors>
            )}
        </Form>
    )
}
