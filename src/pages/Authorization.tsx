import React, { useEffect, useState } from 'react'

import { AuthorizationFormInputs } from '../types/global';
import { IconContext } from 'react-icons';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider, 
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";










const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${({theme}) => theme.colors.bgPrimary};
    display: flex;
    justify-content: center;
    align-items: center;
`
const Form = styled.form`
    padding: 90px;
    width: 458px;
    position: relative;
`


const Tabs = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 40px;
`
const Tab = styled.h2<{isActive: boolean, params: any}>`
    font-family: SFPro;
    font-weight: 700;
    font-size: 22px;
    color: ${({theme}) => theme.colors.textPrimary};
    cursor: pointer;
    opacity: 0.2;
    transition: 250ms;

    &:hover {
        opacity: 1;
    }

    ${({isActive}) => isActive && `
        opacity: 1;
        cursor: default
        &:hover {
            opacity: 1;
        }
    `}
`


const Input = styled.input<{isValid: boolean, isHidden: boolean}>`
    width: 100%;
    height: 40px;
    padding: 0px 16px;

    background: #F8F1FF;
    border-radius: 7px;
    border: none;

    font-family: SFPro;
    font-weight: 400;
    font-size: 13px;
    line-height: 14px;
    color: ${({theme}) => theme.colors.textSecondary};

    ${({isValid}) => !isValid && `
        border: 2px solid #fec2c2;
    `}
    ${({isHidden}) => isHidden && `
        display: none;
    `}
`
const ErrorMessage = styled.div`
    margin-top: 1.5px;
    margin-bottom: 9px;
    padding-left: 17px;

    font-family: SFPro;
    font-weight: 400;
    font-size: 13px;
    line-height: 14px;
    color: #fec2c2;
`
const ShowPassword = styled.div<{isHidden: boolean}>`
    position: absolute;
    right: 102px;
    margin-top: -28px;
    ${({isHidden}) => isHidden && `
        display: none;
    `}
`;


const Button = styled.div<{isValid: boolean}>`
    margin-top: 40px;
    width: 100%;
    height: 40px;
    background: #985ACE;
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
        background: #bebebe;
        color: ${({theme}) => theme.colors.textSecondary};
    }

    ${({isValid}) => isValid && `
        background: #b1b1b1;
        &:hover {
            background: #b1b1b1;
            color: #FFFFFF;
            cursor: default;
        }
    `}
`
const Loader = styled.div`
    margin-bottom: 40px;
    width: 100%;
    height: 40px;
    background: ${({theme}) => theme.colors.bgPrimary};
    border-radius: 7px;

    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({theme}) => theme.colors.textPrimary};
    font-family: SFPro;
    font-weight: 500;
    font-size: 50px;
`;


const Line = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    border-top: 0.5px solid ${({theme}) => theme.colors.textPrimary};
`;


const СontinueWithGoogle = styled.div`
    width: 100%;
    height: 40px;
    padding: 0px 40px;
    border: 1px solid #985ACE;
    border-radius: 7px;
    cursor: pointer;

    font-family: SFPro;
    font-weight: 400;
    font-size: 15px;
    line-height: 14px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    transition: 250ms;

    &:hover {
        background: #F8F1FF;
    }
`;










export default function Authorization() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = getAuth();


    const [params, setParams] = useState('logIn');
    function changeParams() {
        params === 'logIn' ? setParams('signIn') : setParams('logIn');
    }


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loader, setLoader] = useState<string>('.');
    useEffect(() => {
        if(isLoading) {
            setTimeout(() => {
                loader === '.' && setLoader('..');
                loader === '..' && setLoader('...');
                loader === '...' && setLoader('.');
            }, 300);
        }
    
    }, [isLoading, loader])
    


    const {
        register,
        formState: {errors, dirtyFields},
        handleSubmit,
        watch,
        setError
    } = useForm<AuthorizationFormInputs>({
        mode: "all"
    });

    const currentPassword = watch('password');
    const [inputType, setInputType] = useState('password');
    function changeInputType() {
        inputType === 'password' ? setInputType('text') : setInputType('password');
    }

    function enterClickHandler(event: React.KeyboardEvent) {
        event.code === 'Enter' && handleSubmit(onSubmit)();
    }

    function onSubmit(data: AuthorizationFormInputs): void {
        setIsLoading(true);
        if (params === 'logIn') {
            signInWithEmailAndPassword(auth, data.email, data.password)
                .then(() => {
                    dispatch(setUser({
                        displayName: auth.currentUser?.displayName!,
                        email: auth.currentUser?.email!,
                        uid: auth.currentUser?.uid!
                    }));
                    setIsLoading(false);
                    navigate('/', { replace: true });
                })
                .catch(error => {
                    console.log(error.message);
                });
        } else {
            createUserWithEmailAndPassword(auth, data.email, data.password)
                .then(() => {
                    updateProfile(auth.currentUser!, {
                        displayName: `${data.name} ${data.surname}`
                    }).then(() => {
                        dispatch(setUser({
                            displayName: auth.currentUser?.displayName!,
                            email: auth.currentUser?.email!,
                            uid: auth.currentUser?.uid!
                        }));
                        setIsLoading(false);
                        navigate('/', { replace: true });
                    })
                })
                .catch(error => {
                    console.log(error.message);
                    error.message === 'Firebase: Error (auth/email-already-in-use).' 
                        && setError('email', {type: 'custom', message: 'User with this email already exists'});
                });
        }        
    }

    function AuthorizationWithGoogle() {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    }

    useEffect(() => {
        getRedirectResult(auth)
            .then(() => {
                dispatch(setUser({
                    displayName: auth.currentUser?.displayName!,
                    email: auth.currentUser?.email!,
                    uid: auth.currentUser?.uid!
                }));
                navigate('/', { replace: true });
            })
    
      
    }, [auth, dispatch, navigate])
    


    return (
        <Wrapper>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Tabs>
                    <Tab isActive={params === 'logIn' ? true : false} params={params} onClick={changeParams}>Log In</Tab>
                    <Tab isActive={params === 'signIn' ? true : false} params={params} onClick={changeParams}>Sign In</Tab>
                </Tabs>



                <Input
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
                        disabled: params === 'logIn' ? true : false
                    })}
                    isValid={errors?.name ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={params === 'logIn' ? true : false}
                />
                <ErrorMessage>{errors?.name && errors?.name?.message}</ErrorMessage>


                <Input
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
                        disabled: params === 'logIn' ? true : false
                    })}
                    isValid={errors?.surname ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={params === 'logIn' ? true : false}
                />
                <ErrorMessage>{errors?.surname && errors?.surname?.message}</ErrorMessage>


                <Input
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
                    <AiOutlineEye/>
                </ShowPassword>
                <ShowPassword onClick={changeInputType} isHidden={inputType === 'text'}>
                    <AiOutlineEyeInvisible/>
                </ShowPassword>
                <ErrorMessage>{errors?.password && errors?.password?.message}</ErrorMessage>


                <Input
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
                        disabled: params === 'logIn' ? true : false
                    })}
                    isValid={errors?.passwordConfirm ? false : true}
                    onKeyDown={enterClickHandler}
                    isHidden={params === 'logIn' ? true : false}
                />
                <ShowPassword onClick={changeInputType} isHidden={params === 'logIn' || inputType === 'password'}>
                    <AiOutlineEye/>
                </ShowPassword>
                <ShowPassword onClick={changeInputType} isHidden={params === 'logIn' || inputType === 'text'}>
                    <AiOutlineEyeInvisible/>
                </ShowPassword>
                <ErrorMessage>{errors?.passwordConfirm && errors?.passwordConfirm?.message}</ErrorMessage>



                {!isLoading ?
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        isValid={
                            params === 'logIn'
                                ?   errors.email !== undefined ||
                                    dirtyFields.email !== true ||
                                    errors.password !== undefined ||
                                    dirtyFields.password !== true 
                                :   errors.name !== undefined ||
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
                        {params === 'logIn' ? 'Login' : 'Register'}
                    </Button>
                    :
                    <Loader>
                        {loader}
                    </Loader>
                }



                <Line/>



                <СontinueWithGoogle onClick={AuthorizationWithGoogle}>
                    <IconContext.Provider value={{ size: '1.4rem' }}>
                        <div>
                            <FcGoogle />
                        </div>
                    </IconContext.Provider>
                    Сontinue with Google
                </СontinueWithGoogle>
            </Form>
        </Wrapper>
    )
}