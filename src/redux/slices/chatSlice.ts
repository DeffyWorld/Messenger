import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ChatInputFields, ChatSliceState, ImageResolution } from "../../types/interfaces";
import { EnumMessageType, EnumThunkStatus } from "../../types/enums";
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from "../../firebase";
import Resizer from "react-image-file-resizer";
import axios from "axios";



export const setLastTimeMembersRead = createAsyncThunk<any, { chatId: string, currentUserEmail: string }, { rejectValue: string }>(
    'chat/setLastTimeMembersRead', async ({ chatId, currentUserEmail }, { rejectWithValue }) => {
        try {
            if (chatId === '0' || chatId === '1') {
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

export const setIsTyping = createAsyncThunk<any, { user: string, value: boolean }, { rejectValue: string }>(
    'chat/setIsTyping', ({ user, value }, { rejectWithValue }) => {
        updateDoc(doc(firestore, 'users', `${user}`), {
            isTyping: value
        }).then(() => {
            return
        }).catch((error) => {
            rejectWithValue(error.code);
        })
    }
)

export const setLastMessage = createAsyncThunk<any, { chatId: string, lastMessage: any }, { rejectValue: string }>(
    'chat/setLastMessage', ({ chatId, lastMessage }, { rejectWithValue }) => {
        updateDoc(doc(firestore, 'chats', `${chatId}`), {
            lastMessage: lastMessage
        }).then(() => {
            return
        }).catch((error) => {
            rejectWithValue(error.code);
        })
    }
)

export const sendMessage = createAsyncThunk<any, { data: ChatInputFields, chatId: string, currentUserEmail: string }, { rejectValue: string }>(
    'chat/sendMessage', async ({ data, chatId, currentUserEmail }, { rejectWithValue }) => {
        const sendMessage = async (
            type: EnumMessageType,
            content: string,
            minifiedContent?: string,
            imageResolution?: ImageResolution
        ) => {
            const dateNow = Date.now();
            if (type !== EnumMessageType.Image) {
                await setDoc(doc(firestore, `messages/${chatId}/chatMessages`, `${dateNow}`), {
                    chatId: chatId,
                    content: content,
                    from: chatId === '0' || chatId === '1' ? 'user' : currentUserEmail,
                    time: dateNow,
                    type: type
                })
            } else {
                await setDoc(doc(firestore, `messages/${chatId}/chatMessages`, `${dateNow}`), {
                    chatId: chatId,
                    content: content,
                    minifiedContent: minifiedContent,
                    from: chatId === '0' || chatId === '1' ? 'user' : currentUserEmail,
                    time: dateNow,
                    type: type,
                    contentWidth: imageResolution!.imageWidth,
                    contentHeight: imageResolution!.imageHeight
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
            const imageResolution: ImageResolution = await new Promise((resolve) => {
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
                const imageResolution: ImageResolution = await getImageResolution(resizedImage);

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

export const getJoke = createAsyncThunk<any, { chatId: string }, { rejectValue: string }>(
    'chat/getJoke', async ({ chatId }, { rejectWithValue }) => {
        try {
            const joke = (await axios.get('https://api.chucknorris.io/jokes/random')).data.value;

            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dateNow = Date.now();
                    setDoc(doc(firestore, `messages/${chatId}/chatMessages`, `${dateNow}`), {
                        chatId: chatId,
                        content: joke,
                        from: chatId === '0' ? 'tailorswift@gmail.com' : 'barakobama@gmail.com',
                        time: dateNow,
                        type: EnumMessageType.Text
                    }).then(() => {
                        resolve(undefined);
                    })
                }, 2000);
            })

            return
        } catch (error: any) {
            rejectWithValue(error.message);
        }
    }
)



const initialState: ChatSliceState = {
    isChatOpen: false,
    sendMessageStatus: null
}
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setIsChatOpen(state, action) {
            state.isChatOpen = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(setLastTimeMembersRead.rejected, (state, action) => {
                console.error(action.payload);
            })

            .addCase(setIsTyping.rejected, (state, action) => {
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

            .addCase(getJoke.rejected, (state, action) => {
                console.error(action.payload);
            })
    }
})



export const { setIsChatOpen } = chatSlice.actions;