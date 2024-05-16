import './Artefact.scss';
// import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getHsl} from "../../utils/ColorsUtils.ts";
import {useSelector} from "react-redux";
import {SessionState, Skill} from "../../types/Types.ts";

const Artefact = () => {
    const session = useSelector((state: SessionState) => state.session);

    const [hsl, setHsl] = useState([0, 0, 0]);

    const handleMouseOver = (e: React.MouseEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.filter = `drop-shadow(0 0 40px hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 0.45))`;
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.filter = ``;
    };

    const getPercentage = (skill: Skill) => {
        const sum = session.user_score.development + session.user_score.creativity + session.user_score.marketing;
        if (sum === 0) return 0;
        return Math.round((session.user_score[skill] / sum) * 100);
    }

    useEffect(() => {
        setHsl(getHsl(session));
    }, [session]);

    return (
        <div className={"artefact"}>
            <div className="artefact-scroll">
                <h1 className={"artefact-title"}>Mon artefact magique</h1>
                <p className={"artefact-subtitle"}>Dominance :
                    {session.user_score.development > session.user_score.creativity && session.user_score.development > session.user_score.marketing ? " Développement web" : ""}
                    {session.user_score.creativity > session.user_score.development && session.user_score.creativity > session.user_score.marketing ? " Création numérique" : ""}
                    {session.user_score.marketing > session.user_score.development && session.user_score.marketing > session.user_score.creativity ? " Stratégie de communication" : ""}
                </p>
                <div className="artefact-picture" onMouseOver={handleMouseOver}
                     onMouseOut={handleMouseOut}>
                    <img src="/images/artefact/base.png" alt="artefact"
                         style={{filter: `hue-rotate(${hsl[0]}deg) saturate(${hsl[1]}%) brightness(90%)`}}/>
                </div>
                <div className="artefact-description">
                    <div className="score">
                        <div className="skill dev">
                            <p>Développement</p>
                            <div className="progress">
                                <div className="progress-bar dev" style={{width: getPercentage("development") + "%"}}/>
                            </div>
                        </div>
                        <div className="skill crea">
                            <p>Créativité</p>
                            <div className="progress">
                                <div className="progress-bar crea" style={{width: getPercentage("creativity") + "%"}}/>
                            </div>
                        </div>
                        <div className="skill mark">
                            <p>Communication</p>
                            <div className="progress">
                                <div className="progress-bar mark" style={{width: getPercentage("marketing") + "%"}}/>
                            </div>
                        </div>
                    </div>
                    <p>Voici votre artefact magique, il est composé de trois cristaux qui représentent vos compétences
                        en développement, en créativité et en marketing. Plus vous avez de compétences dans un domaine,
                        plus le cristal associé est grand et brillant.</p>
                </div>
            </div>
        </div>
    );
}

export default Artefact;