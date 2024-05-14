interface SessionState {
    session: {
         user_uuid: string,
        user_firstname: string,
        user_lastname: string,
        user_email: string,
        user_picture: string,
        user_session_token: string,
        user_socket_id: string,
        isSignedIn: boolean,
    }
}

export type {
    SessionState
}