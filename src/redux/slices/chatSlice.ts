import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ChatInputFields, ChatSliceState } from "../../types/interfaces";
import { EnumMessageType, EnumThunkStatus } from "../../types/enums";
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from "../../firebase";
import Resizer from "react-image-file-resizer";



export const updateLastTimeMembersRead = createAsyncThunk<any, { chatWith: string, chatId: string, currentUserEmail: string }, { rejectValue: string }>(
    'chat/updateLastTimeMembersRead', async ({ chatWith, chatId, currentUserEmail }, { rejectWithValue }) => {
        try {
            if (chatWith === 'tailorswift@gmail.com' || chatWith === 'barakobama@gmail.com') {
                updateDoc(doc(firestore, 'chats', `${chatId}`), {
                    'lastTimeMembersRead.user': Date.now()
                })
            } else {
                updateDoc(doc(firestore, 'chats', `${chatId}`), {
                    [`lastTimeMembersRead.${currentUserEmail.split('.')[0]}`]: Date.now()
                })
            }
        } catch (error: any) {
            rejectWithValue(error.code);
        }
    }
)

export const sendMessage = createAsyncThunk<any, { data: ChatInputFields, chatId: string, currentUserEmail: string }, { rejectValue: string }>(
    'chat/sendMessage', async ({ data, chatId, currentUserEmail }, { rejectWithValue }) => {
        const sendMessage = async (
            type: EnumMessageType,
            content: string,
            minifiedContent?: string,
            imageResolution?: {
                imageWidth: number;
                imageHeight: number;
            }
        ) => {
            if (type !== EnumMessageType.Image) {
                await updateDoc(doc(firestore, 'chats', `${chatId}`), {
                    messages: arrayUnion({
                        chatId: chatId,
                        content: content,
                        from: chatId === '0' || chatId === '1' ? 'user' : currentUserEmail,
                        time: Date.now(),
                        type: type
                    })
                })
            } else {
                await updateDoc(doc(firestore, 'chats', `${chatId}`), {
                    messages: arrayUnion({
                        chatId: chatId,
                        content: content,
                        minifiedContent: minifiedContent,
                        from: chatId === '0' || chatId === '1' ? 'user' : currentUserEmail,
                        time: Date.now(),
                        type: type,
                        contentWidth: imageResolution!.imageWidth,
                        contentHeight: imageResolution!.imageHeight
                    })
                })
            }
        }

        const resizeImage = async (image: any) => {
            const resizedImage = await new Promise((resolve) => {
                Resizer.imageFileResizer(
                    image,
                    600,
                    240,
                    "JPEG",
                    6,
                    0,
                    (uri) => resolve(uri),
                    "file"
                );
            })
            return resizedImage
        }

        const getImageResolution = async (image: any) => {
            const imageResolution = await new Promise((resolve) => {
                const img = new Image();
                img.src = URL.createObjectURL(image);
                img.onload = () => {
                    resolve({ imageWidth: img.width, imageHeight: img.height })
                }
            })
            return imageResolution
        }

        const isStringUrl = (str: string): boolean => {
            try {
                new URL(str);
                return true;
            } catch {
                return false;
            }
        }



        try {
            if (data.text !== '') {
                const type = isStringUrl(data.text) ? EnumMessageType.Link : EnumMessageType.Text;

                await sendMessage(type, data.text);

                return
            }

            if (data.image !== undefined && data.image.length !== 0) {
                const image: any = data.image[0];
                const resizedImage: any = await resizeImage(image);
                const imageResolution: any = await getImageResolution(resizedImage);

                const dateNow = Date.now();
                const imageStorageRef = ref(storage, `images/${dateNow}${image.name}`);
                const resizedImageStorageRef = ref(storage, `images/resized${dateNow}${image.name}`);

                await uploadBytes(imageStorageRef, image);
                const imageUrl = await getDownloadURL(imageStorageRef);
                await uploadBytes(resizedImageStorageRef, resizedImage);
                const resizedImageUrl = await getDownloadURL(resizedImageStorageRef);

                await sendMessage(EnumMessageType.Image, imageUrl, resizedImageUrl, imageResolution);

                return
            }
        } catch (error: any) {
            rejectWithValue(error.code);
        }
    }
)



const initialState: ChatSliceState = {
    sendMessageStatus: null
}
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateLastTimeMembersRead.rejected, (state, action) => {
                console.error(action.payload);
            })

            .addCase(sendMessage.pending, (state) => {
                state.sendMessageStatus = EnumThunkStatus.Pending;
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.sendMessageStatus = EnumThunkStatus.Fulfilled;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendMessageStatus = EnumThunkStatus.Rejected;
                console.error(action.payload);
            })
    }
})



export const { } = chatSlice.actions;