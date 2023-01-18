import styled from 'styled-components';
import { AiOutlinePaperClip } from 'react-icons/ai';

import { ChatInputFields } from '../types/interfaces';
import { User } from 'firebase/auth';

import { useForm, useWatch } from 'react-hook-form';
import { sendMessage } from '../redux/slices/chatSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { EnumThunkStatus } from '../types/enums';





interface Props {
    chatId: string,
    currentUser: User | null | undefined,
    currentUserLoading: boolean
}
export default function InputField({ chatId, currentUser }: Props) {
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

    const imageField = useWatch({ name: 'image', control: control })
    const textField = useWatch({ name: 'text', control: control, defaultValue: '' });

    const isValid = sendMessageStatus !== EnumThunkStatus.Pending && ((imageField !== undefined && imageField.length !== 0) || (textField !== undefined && textField !== ''));



    const onSubmit = async (data: ChatInputFields) => {
        dispatch(sendMessage({ data: data, chatId: chatId, currentUserEmail: currentUser!.email! }))
            .then(() => {
                setValue('text', '');
                setValue('image', '');
            })
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
                    }
                })}
            />

            <Send onClick={handleSubmit(onSubmit)} disabled={!isValid} isValid={isValid} >Send</Send>

            {errors && (
                <Errors></Errors>
            )}
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