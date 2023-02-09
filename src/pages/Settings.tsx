import styled, { keyframes } from "styled-components";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm, useWatch } from "react-hook-form";
import { BiErrorCircle, BiImageAdd } from "react-icons/bi";
import { BsPencilFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { SettingsFormInputs } from "../types/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setEditedAvatar, setProfile } from "../redux/slices/settingsSlice";

import AvatarEditor from "../components/AvatarEditor";
import { useNavigate } from "react-router-dom";
import { EnumThunkStatus } from "../types/enums";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { theme } from "..";





export default function Settings() {
    const auth = getAuth()
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [currentUser] = useAuthState(auth);
    const { editedAvatarURL, editedAvatarDataUrl, setProfileStatus } = useAppSelector(state => state.settings)

    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        control,
        setError,
        clearErrors,
        setValue,
        resetField,
        reset
    } = useForm<SettingsFormInputs>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

    const nameField = useWatch({ name: 'name', control: control, defaultValue: '' });
    const { ref, ...rest } = register('name');

    const onGoBack = () => {
        navigate(-1);
    }

    const onDiscard = () => {
        dispatch(setEditedAvatar({ editedAvatarURL: null, editedAvatarDataUrl: null }));
        reset();
        currentUser && setValue('name', currentUser.displayName!);
    }

    const onSubmit = (data: SettingsFormInputs) => {
        dispatch(setProfile({ editedAvatarDataUrl: editedAvatarDataUrl, name: data.name, currentUserEmail: currentUser?.email! }))
            .then(() => {
                onDiscard();
            })
    }





    const changeNameBtnRef = useRef<any>();
    const nameInputRef = useRef<HTMLInputElement>();

    const setNameInputRef = (e: HTMLInputElement) => {
        ref(e);
        nameInputRef.current = e;
    }

    const [showNameInput, setShowNameInput] = useState<boolean>(false);

    const changeNameBtnHandler = () => {
        setShowNameInput(true);
    }

    useEffect(() => {
        if (!showNameInput) return;

        const hideNameInput = (e: any) => {
            if (!changeNameBtnRef.current || !nameInputRef.current || errors.name !== undefined) return;
            if (!changeNameBtnRef.current.contains(e.target) && !nameInputRef.current.contains(e.target)) {
                setShowNameInput(false);
            }
        }
        document.addEventListener('click', hideNameInput);

        return () => {
            document.removeEventListener('click', hideNameInput);
        }

    }, [errors.name, showNameInput])



    useEffect(() => { currentUser && setValue('name', currentUser.displayName!) }, [currentUser, setValue])

    useEffect(() => {
        if (nameField !== undefined && nameField !== '') {
            if (nameField.trim().length < 3 && errors.name === undefined) {
                setError('name', { type: 'custom', message: 'At least three characters' });
            }
            if (nameField.trim().length > 30 && errors.name === undefined) {
                setError('name', { type: 'custom', message: 'Not more than thirty characters' });
            }
            if (nameField.trim().length >= 3 && nameField.trim().length <= 30 && errors.name !== undefined) {
                clearErrors('name');
            }
        }

    }, [clearErrors, errors.name, nameField, setError])



    return (
        <SkeletonTheme baseColor={theme.colors.scrollbarTrack} >
            <Wrapper>
                <Form onSubmit={handleSubmit(onSubmit)} >
                    <ProfileSettings>
                        <AvatarLabel>
                            {currentUser
                                ? <>
                                    <AvatarImg src={editedAvatarURL ? editedAvatarURL : currentUser.photoURL!} />
                                    <ChangeAvatarBtn>
                                        <BiImageAdd />
                                        <AvatarInput
                                            type={'file'}
                                            accept={'image/*'}
                                            id={'avatar'}
                                            {...register('avatar')}
                                        />
                                    </ChangeAvatarBtn>
                                </>
                                : <Skeleton circle width={86} height={86} />
                            }
                        </AvatarLabel>

                        <NameWrapper>
                            {currentUser
                                ? <Name showNameInput={showNameInput} >
                                    {nameField === ''
                                        ? currentUser.displayName
                                        : nameField
                                    }
                                </Name>
                                : <Skeleton width={140} height={18} style={{ marginBottom: '4px' }} />
                            }

                            <NameInput
                                autoComplete={'off'}
                                type={'text'}
                                id={'name'}
                                showNameInput={showNameInput}
                                ref={setNameInputRef}
                                rightRound={errors.name === undefined}
                                {...rest}
                            />
                            {errors.name !== undefined &&
                                <>
                                    <NameError id='nameError' >
                                        <BiErrorCircle />
                                    </NameError>
                                    <Tooltip
                                        anchorId='nameError'
                                        place='bottom'
                                        content={errors.name.message}
                                        delayShow={300}
                                        className='nameErrorTooltip'
                                    />
                                </>

                            }
                            {currentUser &&
                                <ChangeNameBtn htmlFor={'name'} ref={changeNameBtnRef} onClick={changeNameBtnHandler} >
                                    <BsPencilFill />
                                </ChangeNameBtn>
                            }
                        </NameWrapper>

                        {currentUser
                            ? <Email>{currentUser.email}</Email>
                            : <Skeleton height={16}  style={{ marginTop: '4px' }} />
                        }

                        <Buttons>
                            <GoBack onClick={onGoBack} >
                                <IoIosArrowBack />
                                <p>Go back</p>
                            </GoBack>

                            {
                                setProfileStatus === EnumThunkStatus.Pending
                                    ?
                                    <Loader><div></div><div></div><div></div><div></div></Loader>
                                    :
                                    (dirtyFields.name || dirtyFields.avatar) && <>
                                        <Discard onClick={onDiscard} >Discard</Discard>
                                        <Submit active={errors.name === undefined && (editedAvatarURL !== null || dirtyFields.name)} >
                                            Submit
                                        </Submit>
                                    </>
                            }
                        </Buttons>
                    </ProfileSettings>
                </Form>

                <AvatarEditor control={control} resetField={resetField} />
            </Wrapper>
        </SkeletonTheme>
    )
}





const Wrapper = styled.div`
    width: 100vw;
    height: 100%;
    padding: 36px;
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Form = styled.form`
    width: 100%;
    max-width: 460px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.chatBgHover};
    border-radius: 12px;
    position: relative;
`;



const ProfileSettings = styled.div`
    display: grid;
    grid-template: 43px 43px auto / 86px auto;
    grid-column-gap: 10px;
`;

const AvatarLabel = styled.label`
    grid-column: 1;
    grid-row: 1 / 3;
    border-radius: 100px;
    position: relative;
    cursor: pointer;

    &:after { 
        content: ''; 
        position: absolute; 
        top: 0; 
        left: 0; 
        right: 0; 
        bottom: 0; 
        background: rgba(0,0,0,.3);  
        transition: 200ms all ease;
        border-radius: 100px;
        opacity: 0; 
    }
    
    &:hover { 
        &:after {
            opacity: 1;
        }
        label {
            transform: scale(1.05);
        }   
    }    
`;
const AvatarImg = styled.img`
    width: 86px;
    height: 86px;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.textPrimary};
    border-radius: 100px;
`;
const ChangeAvatarBtn = styled.label`
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    width: 36px;
    height: 36px;
    border: 2px solid ${({ theme }) => theme.colors.textPrimary};
    border-radius: 100px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0px;
    right: 0px;
    z-index: 1;
    cursor: pointer;
    transition: 200ms all ease;
`;
const AvatarInput = styled.input`
    display: none;
`;

const NameWrapper = styled.div`
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: flex-end;
    min-width: 0;

    .nameErrorTooltip {
        background-color: ${({ theme }) => theme.colors.invalid};
        color: ${({ theme }) => theme.colors.bgPrimary};
        font-family: 'SFPro';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        padding: 6px 8px;
    }
`;
const Name = styled.p<{ showNameInput: boolean }>`
    width: 100%;
    margin-right: 12px;
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 600;
    font-size: 19px;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.textPrimary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ showNameInput }) => showNameInput && `
        display: none;
    `}
`;
const NameInput = styled.input<{ showNameInput: boolean, rightRound: boolean }>`
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    width: 100%;
    height: 28px;
    border: none;
    border-radius: 4px 0px 0px 4px;
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    display: none;

    ${({ showNameInput }) => showNameInput && `
        display: initial;
    `}
    ${({ rightRound }) => rightRound && `
        border-radius: 4px;
    `}
`;
const ChangeNameBtn = styled.label`
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    border: 2px solid ${({ theme }) => theme.colors.textPrimary};
    margin-left: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0px;
    right: 0px;
    z-index: 1;
    cursor: pointer;
    transition: 200ms all ease;
    width: 31px;
    height: 28px;
    border-radius: 4px;

    &:hover {
        transform: scale(1.05);
    }
`;
const NameError = styled.div`
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 0px 4px 4px 0px;
    color: ${({ theme }) => theme.colors.invalid};
`;

const Email = styled.div`
    grid-column: 2;
    grid-row: 2;
    padding-top: 4px;

    font-family: 'SFPro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.disabled};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
`;



const Buttons = styled.div`
    grid-column: 1 / 3;
    display: flex;
    margin-top: 24px;
`;
const GoBack = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 10px 4px 4px;
    border-radius: 6px;
    border: 2px solid ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    font-size: 20px;
    cursor: pointer;
    transition: 200ms all ease;

    p {
        padding-top: 2px;
        white-space: nowrap;
        font-family: 'SFPro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
    }

    &:hover {
        transform: scale(1.03);
    }
`;
const Discard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: 12px;
    padding: 4px 10px;
    border-radius: 6px;
    border: 2px solid ${({ theme }) => theme.colors.invalid};
    color: ${({ theme }) => theme.colors.invalid};
    transition: 200ms all ease;
    cursor: pointer;

    white-space: nowrap;
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.invalid};

    ${({ theme }) => `
        &:hover {
            background-color: ${theme.colors.invalid};
            color: ${theme.colors.bgPrimary};
        }
    `};
`;
const Submit = styled(props => <Discard as={'button'} {...props} />) <{ active: boolean }>`
    margin-left: initial;
    margin-right: initial;
    background-color: ${({ theme }) => theme.colors.disabled};
    color: ${({ theme }) => theme.colors.bgPrimary};
    border-color: ${({ theme }) => theme.colors.disabled};
    cursor: default;

    &:hover {
        background-color: ${({ theme }) => theme.colors.disabled};
    }

    ${({ active, theme }) => active && `
        background-color: ${theme.colors.bgPrimary};
        border: 2px solid ${theme.colors.highlited};
        color: ${theme.colors.highlited};
        cursor: pointer;

        &:hover {
            background-color: ${theme.colors.highlited};
            color: ${theme.colors.bgPrimary};
        }
    `}
`;
const ldsRing = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`
const Loader = styled.div`
    display: inline-block;
    position: absolute;
    right: 42px;
    width: 34px;
    height: 34px;
    margin-right: 2px;

    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 34px;
        height: 34px;
        border: 5px solid ${({ theme }) => theme.colors.bgPrimary};
        border-radius: 50%;
        animation: ${ldsRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${({ theme }) => theme.colors.textPrimary} transparent transparent transparent;

        &:nth-child(1) {
            animation-delay: -0.45s;
        }
        &:nth-child(2) {
            animation-delay: -0.3s;
        }
        &:nth-child(3) {
            animation-delay: -0.15s;
        }
    }
`;