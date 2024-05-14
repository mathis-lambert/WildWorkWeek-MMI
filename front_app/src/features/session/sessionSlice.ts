// src/features/session/sessionSlice.ts
import {createSlice} from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        user_uuid: "",
        user_email: "",
        user_firstname: "",
        user_lastname: "",
        user_role: "",
        user_score: {development: 0, creativity: 0, marketing: 0},
        user_status: "",
        user_created_at: "",
        user_updated_at: "",
        user_session_token: "",
        isSignedIn: false,
    },
    reducers: {
        signIn: (state, action) => {
            state.user_uuid = action.payload.user_info.user_uuid;
            state.user_email = action.payload.user_info.user_email;
            state.user_firstname = action.payload.user_info.user_firstname;
            state.user_lastname = action.payload.user_info.user_lastname;
            state.user_role = action.payload.user_info.user_role;
            state.user_score = action.payload.user_info.user_score;
            state.user_status = action.payload.user_info.user_status;
            state.user_created_at = action.payload.user_info.user_created_at;
            state.user_updated_at = action.payload.user_info.user_updated_at;
            state.user_session_token = action.payload.token;
            state.isSignedIn = true;
        },
        signOut: (state) => {
           state.user_uuid = "";
            state.user_email = "";
            state.user_firstname = "";
            state.user_lastname = "";
            state.user_role = "";
            state.user_score = {development: 0, creativity: 0, marketing: 0};
            state.user_status = "";
            state.user_created_at = "";
            state.user_updated_at = "";
            state.user_session_token = "";
            state.isSignedIn = false;
        },
    },
});

export const {signIn, signOut} = sessionSlice.actions;

export default sessionSlice.reducer;
