import {URL} from "../app/socket.ts";
import {SessionState} from "../types/Types.ts";

const selectWeapon = async (session: SessionState["session"], weapon: 'bague' | 'gant' | 'lunettes' | 'aucun', callback: (payload: {
    weapon: 'bague' | 'gant' | 'lunettes' | 'aucun'
}) => void) => {
    const response = await fetch(`${URL}/user/weapon/choose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.user_session_token
        },
        body: JSON.stringify({weapon: weapon}),
    });

    const data = await response.json();

    if (data.success) {
        callback({weapon: weapon});
        return true;
    } else {
        return false;
    }
}

export default selectWeapon;