import styled from 'styled-components';
import AvatarEditorComponent from 'react-avatar-editor'
import { ChangeEvent, useRef, useState, WheelEvent } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setEditedAvatar } from '../redux/slices/settingsSlice';
import { Control, UseFormResetField, useWatch } from 'react-hook-form';
import { SettingsFormInputs } from '../types/interfaces';





interface Props {
    control: Control<SettingsFormInputs, any>,
    resetField: UseFormResetField<SettingsFormInputs>
}
function AvatarEditor({ control, resetField }: Props) {
    const dispatch = useAppDispatch();
    const editor = useRef<any>();
    const avatarField = useWatch({ name: 'avatar', control: control });
    const [scale, setScale] = useState<number>(1.1);

    const handleScale = (event: ChangeEvent<HTMLInputElement> | WheelEvent<HTMLDivElement>) => {
        if (event.type === 'change') setScale(parseFloat((event as ChangeEvent<HTMLInputElement>).target.value));
        if (event.type === 'wheel') {
            if ((event as WheelEvent<HTMLDivElement>).nativeEvent.deltaY > 0) {
                if (scale > 1.0) setScale(scale - 0.1);
            } else {
                if (scale < 2) setScale(scale + 0.1);
            }
        }
    }

    const applyHandler = async () => {
        const dataUrl = editor.current!.getImageScaledToCanvas().toDataURL();
        const result = await fetch(dataUrl);
        const blob = await result.blob();

        dispatch(setEditedAvatar({ editedAvatarURL: window.URL.createObjectURL(blob), editedAvatarDataUrl: dataUrl }));
        resetField('avatar', { keepDirty: true });
    }



    return (
        <Bg showed={avatarField !== undefined} >
            <Wrapper showed={avatarField !== undefined} onWheel={handleScale}  >
                <AvatarEditorComponent
                    image={avatarField && avatarField[0]}
                    scale={scale}
                    borderRadius={100}
                    crossOrigin='anonymous'
                    ref={editor}
                />
                <ChangeScaleInput
                    name='scale'
                    type='range'
                    onChange={handleScale}
                    min='1'
                    max='2'
                    step='0.01'
                    value={scale}
                />
                <Apply onClick={applyHandler} >
                    <p>Apply</p>
                </Apply>
            </Wrapper>
        </Bg>
    )
}

export default AvatarEditor;





const Bg = styled.div<{ showed: boolean }>`
    position: absolute;
    z-index: -10;
    width: 100vw;
    height: 100%;
    display: flex;
    opacity: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: 400ms all ease-out;

    ${({ showed }) => showed && `
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
        opacity: 1;
    `}
`;
const Wrapper = styled.div<{ showed: boolean }>`
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.chatBgHover};
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    transform: scale(0);
    transition: 300ms all ease;

    ${({ showed }) => showed && `
        transform: scale(1);
    `}
`;
const ChangeScaleInput = styled.input`
    height: 24px;
    margin-top: 12px;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    cursor: pointer;

    &::-moz-range-track {
        background: ${({ theme }) => theme.colors.scrollbarTrack};
        border-radius: 4px;
        height: 0.5rem;
    }
    &::-webkit-slider-runnable-track {
        background: ${({ theme }) => theme.colors.scrollbarTrack};
        border-radius: 4px;
        height: 0.5rem;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 100px;
        background: ${({ theme }) => theme.colors.status};
        margin-top: -4px;
    }
    &::-moz-range-thumb {
        border: none;
        border-radius: 100px;
        background: ${({ theme }) => theme.colors.status};
    }
`;
const Apply = styled.div`
    padding: 4px 10px;
    margin-top: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 2px solid ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    cursor: pointer;
    transition: 200ms all ease;
    padding-top: 2px;
    white-space: nowrap;
    font-family: 'SFPro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    &:hover {
        transform: scale(1.03);
    }
`;