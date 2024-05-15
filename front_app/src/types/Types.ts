interface SessionState {
    session: {
       user_uuid: string,
        user_email: string,
        user_firstname: string,
        user_lastname: string,
        user_role: string,
        user_score: {
           development: number,
            creativity: number,
            marketing: number
        },
        user_weapon: "gant" | "lunettes" | "bague" | "aucun",
        user_companion: "maugy" | "ploucou" | "jada" | "aucun",
        user_status: string,
        user_created_at: string,
        user_updated_at: string,
        user_session_token: string,
        isSignedIn: boolean,
    }
}

type Skill = "development" | "creativity" | "marketing";

export type {
    SessionState,
    Skill
}