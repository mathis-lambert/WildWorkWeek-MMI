import toggleFullScreen from "../../../utils/ToggleFullscreen.ts";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {SessionState, Skill} from "../../../types/Types.ts";
import "./Layout.scss";
import {ArrowLeft, ChevronLeft, ChevronRight, Home, Maximize, RefreshCw} from "react-feather";
import {useEffect, useState} from "react";
import {getHsl} from "../../../utils/ColorsUtils.ts";
import setScoreToSkill from "../../../utils/SetScoreToSkill.ts"
import {setScore} from "../../../features/session/sessionSlice.ts";

interface GameLayoutProps {
    setSceneNumber: (scene: string) => void;
    sceneHistory: string[];
    setSceneHistory: (sceneHistory: string[]) => void;
    stopAllAudio: () => void;
}

const DevLayout = ({setSceneNumber, sceneHistory, setSceneHistory, stopAllAudio}: GameLayoutProps) => {
    const session = useSelector((state: SessionState) => state.session);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showTopRight, setShowTopRight] = useState(false);
    const [hsl, setHsl] = useState([0, 0, 0]);

    const getPercentage = (skill: Skill) => {
        const sum = session.user_score.development + session.user_score.creativity + session.user_score.marketing;
        if (sum === 0) return 0;
        return Math.round((session.user_score[skill] / sum) * 100);
    }

    useEffect(() => {
        setHsl(getHsl(session));
    }, [session]);

    return (
        <div className="game-layout">
            <div className={"top-right " + (showTopRight ? "show" : "")}>
                <div className="chevron" onClick={() => setShowTopRight(!showTopRight)}>
                    {showTopRight ? <ChevronLeft/> : <ChevronRight/>}
                </div>
                <div className="crystal">
                    <img src="/images/artefact/base.png" alt="Crystal"
                         style={{filter: `hue-rotate(${hsl[0]}deg) saturate(${hsl[1]}%) brightness(${hsl[2]}%)`}}/>
                </div>
                <div className="score">
                    <p>Development</p>
                    <div className="progress">
                        <div className="progress-bar dev" style={{width: getPercentage("development") + "%"}}/>
                    </div>
                    <p>Creativity</p>
                    <div className="progress">
                        <div className="progress-bar crea" style={{width: getPercentage("creativity") + "%"}}/>
                    </div>
                    <p>Marketing</p>
                    <div className="progress">
                        <div className="progress-bar mark" style={{width: getPercentage("marketing") + "%"}}/>
                    </div>
                </div>
            </div>

            <div className="bottom-left">
                <button onClick={() => toggleFullScreen(document.getElementById("root"))}><Maximize size={18}/>
                </button>
                <button onClick={() => {
                    setSceneNumber(sceneHistory[sceneHistory.length - 2]);
                    setSceneHistory(sceneHistory.slice(0, sceneHistory.length - 2));
                }}><ArrowLeft size={18}/></button>
                <button onClick={() => {
                    stopAllAudio();
                    navigate("/");
                }}><Home size={18}/></button>
                <button onClick={async () => {
                    if (confirm("Voulez-vous vraiment réinitialiser vos scores ?")) {
                        if (await setScoreToSkill(session, "development", 0, (p) => {
                                console.log(p)
                                dispatch(setScore(p))
                            }) &&
                            await setScoreToSkill(session, "creativity", 0, (p) => {
                                console.log(p)
                                dispatch(setScore(p))
                            }) &&
                            await setScoreToSkill(session, "marketing", 0, (p) => {
                                console.log(p)
                                dispatch(setScore(p))
                            })) {
                            console.log("Scores reset")
                        } else {
                            alert("Une erreur est survenue. Veuillez réessayer.");
                        }
                    } else {
                        console.log("Scores reset cancelled")
                    }
                }}><RefreshCw size={18}/></button>
            </div>
        </div>
    );
}

export default DevLayout;