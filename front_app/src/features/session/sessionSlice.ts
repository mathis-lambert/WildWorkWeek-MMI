// src/features/session/sessionSlice.ts
import {createSlice} from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        user_uuid: "",
        user_firstname: "",
        user_lastname: "",
        user_email: "",
        // user_picture: "./user-icons/user-base-icon.svg",
        user_session_token: "",
        // user_socket_id: "",
        isSignedIn: false,
    },
    reducers: {
        signIn: (state, action) => {
            state.user_uuid = action.payload.user_info.user_uuid;
            state.user_firstname = action.payload.user_info.user_firstname;
            state.user_lastname = action.payload.user_info.user_lastname;
            state.user_email = action.payload.user_info.user_email;
            // state.user_picture = action.payload.user_info.user_picture;
            state.user_session_token = action.payload.user_info.user_session_token;
            // state.user_socket_id = action.payload.user_info.user_socket_id;
            state.isSignedIn = true;
        },
        signOut: (state) => {
            state.user_uuid = "";
            state.user_firstname = "";
            state.user_lastname = "";
            state.user_email = "";
            // state.user_picture = "./user-icons/user-base-icon.svg";
            state.user_session_token = "";
            // state.user_socket_id = "";
            state.isSignedIn = false;
        },
    },
});

export const {signIn, signOut} = sessionSlice.actions;

export default sessionSlice.reducer;
