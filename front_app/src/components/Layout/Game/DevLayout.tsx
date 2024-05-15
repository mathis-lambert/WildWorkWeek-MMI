import toggleFullScreen from "../../../utils/ToggleFullscreen.ts";
import setScoreToSkill from "../../../utils/SetScoreToSkill.ts";
import {setScore} from "../../../features/session/sessionSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {SessionState} from "../../../types/Types.ts";
import "./Layout.scss";

interface DevLayoutProps {
    sceneNumber: string;
    setSceneNumber: (sceneNumber: string) => void;
    sceneHistory: string[];
    setSceneHistory: (sceneHistory: string[]) => void;
    stopAllAudio: () => void;
}

const DevLayout = ({sceneNumber, setSceneNumber, sceneHistory, setSceneHistory, stopAllAudio}: DevLayoutProps) => {
    const session = useSelector((state: SessionState) => state.session);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="dev-layout">
            <h1>Dev Layout</h1>
            <p>Current scene: {sceneNumber}</p>
            <p>Current user: {session.user_firstname} {session.user_lastname}</p>
            <p>Current
                score: {session.user_score.development} {session.user_score.creativity} {session.user_score.marketing}</p>
            <p>Current weapon: {session.user_weapon}</p>
            <p>Current companion: {session.user_companion}</p>
            <button onClick={() => toggleFullScreen(document.getElementById("root"))}>Fullscreen</button>
            <input type="text" value={sceneNumber} onChange={(e) => setSceneNumber(e.target.value)}
                   placeholder="Scene number"/>
            <button onClick={() => {
                setSceneNumber(sceneHistory[sceneHistory.length - 2])
                setSceneHistory(sceneHistory.slice(0, sceneHistory.length - 2))
            }}>Back
            </button>
            <button onClick={async () => {
                if (await setScoreToSkill(session, "development", 0, (p) => {
                        dispatch(setScore(p))
                    }) &&
                    await setScoreToSkill(session, "creativity", 0, (p) => {
                        dispatch(setScore(p))
                    }) &&
                    await setScoreToSkill(session, "marketing", 0, (p) => {
                        dispatch(setScore(p))
                    })) {
                    console.log("Scores reset")
                } else {
                    alert("Une erreur est survenue. Veuillez réessayer.");
                }
            }}>Reset scores
            </button>
            <button onClick={() => {
                stopAllAudio();
                navigate("/");
            }}>Retour à l'accueil
            </button>
        </div>
    );
}

export default DevLayout;