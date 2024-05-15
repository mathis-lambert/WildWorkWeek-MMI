import {URL} from "../app/socket.ts";
import {SessionState} from "../types/Types.ts";
import {Skill} from "../types/Types.ts";

const setScoreToSkill = async (session: SessionState["session"], skill: Skill, score: number, callback: (payload: {skill: Skill, score: number}) => void) => {
    const response = await fetch(`${URL}/user/score/set`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.user_session_token
        },
        body: JSON.stringify({skill: skill, score: score}),
    });

    const data = await response.json();

    if (data.success) {
        callback({
            skill: skill,
            score: score
        });

        return true;
    } else {
        return false;
    }
}

export default setScoreToSkill;