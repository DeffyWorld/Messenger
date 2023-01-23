import { useEffect, useState } from 'react'

import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import { AuthorizationFormInputs } from '../types/interfaces';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getAuth, getRedirectResult } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authorizationWithGoogle, createUserOrSignIn, setActiveTab, setIsLoading, setLoader } from '../redux/slices/authorizationSlice';
import { EnumThunkStatus } from '../types/enums';





export default function Authorization() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = getAuth();
    const [currentUser, currentUserLoading] = useAuthState(auth);

    const { isLoading, loader, activeTab, authorizationStatus, authorizationErrors } = useAppSelector(state => state.authorization);
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        watch,
        setError,
        clearErrors
    } = useForm<AuthorizationFormInputs>({
        mode: "all"
    });



    const tabHandler = () => {
        activeTab === 'logIn' ? dispatch(setActiveTab('signIn')) : dispatch(setActiveTab('logIn'));
        if (errors.email?.message === 'User not found' || errors.email?.message === 'User with this email already exists' || errors.password?.message === 'Wrong password') {
            clearErrors();
        }
    }

    const currentPassword = watch('password');
    const [inputType, setInputType] = useState('password');

    const changeInputType = () => {
        inputType === 'password' ? setInputType('text') : setInputType('password');
    }
    const enterClickHandler = (event: React.KeyboardEvent) => {
        event.code === 'Enter' && handleSubmit(onSubmit)();
    }



    const onSubmit = (data: AuthorizationFormInputs): void => {
        dispatch(createUserOrSignIn({ auth, activeTab, data }));
    }

    const googleButtonHandler = () => {
        dispatch(authorizationWithGoogle({ isRedirectResultNeeded: false, auth }));
    }

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                result !== null 
                    ? dispatch(authorizationWithGoogle({ isRedirectResultNeeded: true, auth, currentUser: result.user }))
                    : dispatch(setIsLoading(false));
            })

    }, [auth, dispatch])

    useEffect(() => {
        authorizationErrors.createUserOrSignIn === 'auth/user-not-found'
            && setError('email', { type: 'custom', message: 'User not found' });
        authorizationErrors.createUserOrSignIn === 'auth/email-already-in-use'
            && setError('email', { type: 'custom', message: 'User with this email already exists' });
        authorizationErrors.createUserOrSignIn === 'auth/wrong-password'
            && setError('password', { type: 'custom', message: 'Wrong password' });

    }, [authorizationErrors.createUserOrSignIn, setError])



    useEffect(() => {
        isLoading && setTimeout(() => {
            loader === '.' && dispatch(setLoader('..'));
            loader === '..' && dispatch(setLoader('...'));
            loader === '...' && dispatch(setLoader('.'));
        }, 300);

    }, [dispatch, isLoading, loader])

    

    useEffect(() => {
        if (currentUserLoading !== true && currentUser !== null && currentUser !== undefined && authorizationStatus !== EnumThunkStatus.Pending) {
            navigate('/', { replace: true });
        }

    }, [authorizationStatus, currentUser, currentUserLoading, navigate])



    return (
        <Wrapper>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Tabs>
                    <Tab isActive={activeTab === 'logIn' ? true : false} activeTab={activeTab} onClick={tabHandler}>Log In</Tab>
                    <Tab isActive={activeTab === 'signIn' ? true : false} activeTab={activeTab} onClick={tabHandler}>Sign In</Tab>
                </Tabs>



                <Input
                    autoComplete='off'
                    type="text"
                    placeholder='Name'
                    {...register("name", {
                        required: "The field is required",
                        minLength: {
                            value: 3,
                            message: "At least three characters",
                        },
                        maxLength: {
                            value: 60,
                            message: "Not more than sixty characters",
                        },
                        disabled: activeTab === 'logIn' ? true : false
                    })}
                    isValid={errors?.name ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={activeTab === 'logIn' ? true : false}
                />
                <ErrorMessage>{errors?.name && errors?.name?.message}</ErrorMessage>


                <Input
                    autoComplete='off'
                    type="text"
                    placeholder='Surname'
                    {...register("surname", {
                        required: "The field is required",
                        minLength: {
                            value: 3,
                            message: "At least three characters",
                        },
                        maxLength: {
                            value: 60,
                            message: "Not more than sixty characters",
                        },
                        disabled: activeTab === 'logIn' ? true : false
                    })}
                    isValid={errors?.surname ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={activeTab === 'logIn' ? true : false}
                />
                <ErrorMessage>{errors?.surname && errors?.surname?.message}</ErrorMessage>


                <Input
                    autoComplete='off'
                    type="text"
                    placeholder='Email'
                    {...register("email", {
                        required: "The field is required",
                        minLength: {
                            value: 3,
                            message: "At least three characters",
                        },
                        maxLength: {
                            value: 100,
                            message:
                                "Not more than a hundred characters",
                        },
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Enter the email correctly",
                        }
                    })}
                    isValid={errors?.email ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={false}
                />
                <ErrorMessage>{errors?.email && errors?.email?.message}</ErrorMessage>


                <Input
                    autoComplete='off'
                    type={inputType}
                    placeholder='Password'
                    {...register("password", {
                        required: "The field is required",
                        minLength: {
                            value: 6,
                            message: "At least six characters",
                        },
                        maxLength: {
                            value: 100,
                            message:
                                "Not more than a hundred characters",
                        },
                        pattern: {
                            value: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/,
                            message: "The password must contain at least one number and contain mixed case letters",
                        }
                    })}
                    isValid={errors?.password ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={false}
                />
                <ShowPassword onClick={changeInputType} isHidden={inputType === 'password'}>
                    <AiOutlineEye />
                </ShowPassword>
                <ShowPassword onClick={changeInputType} isHidden={inputType === 'text'}>
                    <AiOutlineEyeInvisible />
                </ShowPassword>
                <ErrorMessage>{errors?.password && errors?.password?.message}</ErrorMessage>


                <Input
                    autoComplete='off'
                    type={inputType}
                    placeholder='Сonfirm password'
                    {...register("passwordConfirm", {
                        required: "The field is required",
                        minLength: {
                            value: 3,
                            message: "At least three characters",
                        },
                        maxLength: {
                            value: 100,
                            message:
                                "Not more than a hundred characters",
                        },
                        validate: value => value === currentPassword || "The passwords do not match",
                        disabled: activeTab === 'logIn' ? true : false
                    })}
                    isValid={errors?.passwordConfirm ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={activeTab === 'logIn' ? true : false}
                />
                <ShowPassword onClick={changeInputType} isHidden={activeTab === 'logIn' || inputType === 'password'}>
                    <AiOutlineEye />
                </ShowPassword>
                <ShowPassword onClick={changeInputType} isHidden={activeTab === 'logIn' || inputType === 'text'}>
                    <AiOutlineEyeInvisible />
                </ShowPassword>
                <ErrorMessage>{errors?.passwordConfirm && errors?.passwordConfirm?.message}</ErrorMessage>



                {!isLoading ?
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        isValid={
                            activeTab === 'logIn'
                                ? errors.email !== undefined ||
                                dirtyFields.email !== true ||
                                errors.password !== undefined ||
                                dirtyFields.password !== true
                                : errors.name !== undefined ||
                                dirtyFields.name !== true ||
                                errors.surname !== undefined ||
                                dirtyFields.surname !== true ||
                                errors.email !== undefined ||
                                dirtyFields.email !== true ||
                                errors.password !== undefined ||
                                dirtyFields.password !== true ||
                                errors.passwordConfirm !== undefined ||
                                dirtyFields.passwordConfirm !== true
                        }
                    >
                        {activeTab === 'logIn' ? 'Login' : 'Register'}
                    </Button>
                    :
                    <Loader>
                        {loader}
                    </Loader>
                }



                <Line />



                <СontinueWithGoogle onClick={googleButtonHandler}>
                    <IconContext.Provider value={{ size: '1.4rem' }}>
                        <FcGoogle />
                    </IconContext.Provider>
                    <СontinueWithGoogleText>
                        Сontinue with Google
                    </СontinueWithGoogleText>
                </СontinueWithGoogle>
            </Form>
        </Wrapper>
    )
}





const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    min-height: -webkit-fill-available;
    height: -webkit-fill-available;
    background-color: ${({ theme }) => theme.colors.authorizationBg};
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
`
const Form = styled.form`
    padding: 90px;
    width: 458px;
    position: relative;

    @media (${({ theme }) => theme.media.xxsm}) {
        padding: 0px;
        margin: 70px;
    }
    @media (${({ theme }) => theme.media.xxxsm}) {
        padding: 0px;
        margin: 50px;
    }
`



const Tabs = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 40px;
    
    @media ((max-height: 500px)) {
        margin-top: 60px;
    }
`
const Tab = styled.h2<{ isActive: boolean, activeTab: any }>`
    font-family: SFPro;
    font-weight: 700;
    font-size: 22px;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    opacity: 0.2;
    transition: 250ms;

    &:hover {
        opacity: 1;
    }

    ${({ isActive }) => isActive && `
        opacity: 1;
        cursor: default
        &:hover {
            opacity: 1;
        }
    `}
`



const Input = styled.input<{ isValid: boolean, isHidden: boolean }>`
    width: 100%;
    height: 40px;
    padding: 0px 16px;

    background: ${({ theme }) => theme.colors.authorizationPrimary};
    border-radius: 7px;
    border: none;

    font-family: SFPro;
    font-weight: 400;
    font-size: 13px;
    line-height: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};

    ${({ isValid, theme }) => !isValid && `
        border: 2px solid ${theme.colors.authorizationInvalid};
    `}
    ${({ isHidden }) => isHidden && `
        display: none;
    `}
`
const ErrorMessage = styled.div`
    margin-top: 1.5px;
    margin-bottom: 9px;
    padding: 0px 5px 0px 10px;

    font-family: SFPro;
    font-weight: 400;
    font-size: 13px;
    line-height: 14px;
    color: ${({ theme }) => theme.colors.authorizationInvalid};
`
const ShowPassword = styled.div<{ isHidden: boolean }>`
    position: absolute;
    right: 102px;
    margin-top: -28px;

    ${({ isHidden }) => isHidden && `
        display: none;
    `}

    @media (${({ theme }) => theme.media.xxsm}) {
        right: 12px;
    }
`;



const Button = styled.div<{ isValid: boolean }>`
    margin-top: 40px;
    width: 100%;
    height: 40px;
    background: ${({ theme }) => theme.colors.authorizationSecondary};
    border-radius: 7px;
    cursor: pointer;

    font-family: SFPro;
    font-weight: 500;
    font-size: 16px;
    line-height: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #FFFFFF;
    transition: 250ms;

    &:hover {
        background: ${({ theme }) => theme.colors.authorizationPrimary};
        color: ${({ theme }) => theme.colors.textSecondary};
    }

    ${({ isValid, theme }) => isValid && `
        background: ${theme.colors.disabled};
        &:hover {
            background: ${theme.colors.disabled};
            color: #FFFFFF;
            cursor: default;
        }
    `}
`
const Loader = styled.div`
    margin-bottom: 40px;
    width: 100%;
    height: 40px;
    background: ${({ theme }) => theme.colors.authorizationBg};
    border-radius: 7px;

    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: SFPro;
    font-weight: 500;
    font-size: 50px;
`;
const Line = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    border-top: 0.5px solid ${({ theme }) => theme.colors.textPrimary};
`;
const СontinueWithGoogle = styled.div`
    width: 100%;
    height: 40px;
    border: 1px solid ${({ theme }) => theme.colors.authorizationSecondary};
    border-radius: 7px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    transition: 250ms;

    &:hover {
        background: ${({ theme }) => theme.colors.authorizationPrimary};
    }
`;
const СontinueWithGoogleText = styled.p`
    padding-left: 5px;
    font-family: SFPro;
    font-weight: 400;
    font-size: 15px;
    line-height: 14px;
`;