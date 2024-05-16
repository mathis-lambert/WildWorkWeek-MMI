import {URL} from "../app/socket.ts";
import {SessionState} from "../types/Types.ts";

const selectCompanion = async (session: SessionState["session"], companion: 'jada' | 'maugy' | 'ploucou' | 'aucun', callback: (payload: {
    companion: 'jada' | 'maugy' | 'ploucou' | 'aucun'
}) => void) => {
    const response = await fetch(`${URL}/user/companion/choose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.user_session_token
        },
        body: JSON.stringify({companion: companion}),
    });

    const data = await response.json();

    if (data.success) {
        callback({companion: companion});
        return true;
    } else {
        return false;
    }
}

export default selectCompanion;