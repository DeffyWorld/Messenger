import styled from 'styled-components';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { EnumThunkStatus } from '../types/enums';
import { ChatInputFields } from '../types/interfaces';
import { useForm, useWatch } from 'react-hook-form';
import { getJoke, sendMessage, setIsTyping } from '../redux/slices/chatSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useRef } from 'react';





interface Props {
    chatId: string,
    currentUserEmail: string | null,
    shouldDisableInputs: boolean
}
export default function InputField({ chatId, currentUserEmail, shouldDisableInputs }: Props) {
    const dispatch = useAppDispatch();

    const { sendMessageStatus } = useAppSelector(state => state.chat);

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue
    } = useForm<ChatInputFields>({
        mode: "onSubmit"
    });

    const imageField = useWatch({ name: 'image', control: control });
    const textField = useWatch({ name: 'text', control: control, defaultValue: '' });

    const isValid = sendMessageStatus !== EnumThunkStatus.Pending && ((imageField !== undefined && imageField.length !== 0) || (textField !== undefined && textField !== ''));



    const prevTextField = useRef<string | null>(null);

    useEffect(() => { prevTextField.current = textField; }, [textField]);

    useEffect(() => {
        textField !== '' && prevTextField.current === '' && dispatch(setIsTyping({ user: currentUserEmail!, value: true }));
        textField === '' && prevTextField.current !== '' && dispatch(setIsTyping({ user: currentUserEmail!, value: false }));

    }, [currentUserEmail, dispatch, textField])



    const onSubmit = async (data: ChatInputFields) => {
        await dispatch(sendMessage({ data: data, chatId: chatId, currentUserEmail: currentUserEmail! }))

        setValue('text', '');
        setValue('image', '');

        if (chatId === '0' || chatId === '1') {
            const chatWith = chatId === '0' ? 'tailorswift@gmail.com' : 'barakobama@gmail.com';

            dispatch(setIsTyping({ user: chatWith, value: true }));
            await dispatch(getJoke({ chatId: chatId }));
            await dispatch(setIsTyping({ user: chatWith, value: false }));
        }
    }



    return (
        <Form onSubmit={handleSubmit(onSubmit)} >
            <ImageInput
                type={'file'}
                accept={'image/*'}
                id={'image'}
                {...register('image', { disabled: shouldDisableInputs })}
            />
            <ImageLabel htmlFor={'image'} isEmpty={imageField === undefined || imageField.length === 0} >
                <AiOutlinePaperClip />
            </ImageLabel>

            <TextInput
                autoComplete='off'
                type={'text'}
                placeholder={'Type your message here...'}
                {...register('text', {
                    maxLength: {
                        value: 200,
                        message: 'Not more than two hundred characters',
                    },
                    disabled: shouldDisableInputs
                })}
            />

            <Send onClick={handleSubmit(onSubmit)} disabled={!isValid} isValid={isValid} >Send</Send>

            {errors && (<Errors></Errors>)}
        </Form>
    )
}





const Form = styled.form`
    height: 62px;
    border-top: 2px solid ${({ theme }) => theme.colors.bgSecondary};
    background-color: ${({ theme }) => theme.colors.bgPrimary};

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
    width: calc(100vw - 42px - 32px - 20px - 17px);
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
    cursor: pointer;

    ${({ isValid, theme }) => !isValid && `
        color: ${theme.colors.disabled};
        cursor: initial;
    `}
`;

const Errors = styled.div`
  
`;