import './Artefact.scss';
// import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getHsl} from "../../utils/ColorsUtils.ts";
import {useSelector} from "react-redux";
import {SessionState} from "../../types/Types.ts";

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

    useEffect(() => {
        setHsl(getHsl(session));
    }, [session]);

    return (
        <div className={"artefact"}>
            <div className="artefact-scroll">
                <h1 className={"artefact-title"}>Mon artefact magique</h1>
                <div className="artefact-picture" onMouseOver={handleMouseOver}
                     onMouseOut={handleMouseOut}>
                    <img src="/images/artefact/base.png" alt="artefact" style={{filter: `hue-rotate(${hsl[0]}deg) saturate(${hsl[1]}%) brightness(${hsl[2]}%)`}}/>
                </div>
                <div className="artefact-description">
                    <p>Mon artefact est un artefact magique qui me permet de réaliser des projets incroyables. Il est
                        composé de plusieurs parties, chacune représentant une compétence que je maîtrise.</p>
                    <p>Il est composé de :</p>
                    <ul>
                        <li>La partie développement, qui me permet de réaliser des applications web et mobiles.</li>
                        <li>La partie design, qui me permet de réaliser des interfaces graphiques et des maquettes.</li>
                        <li>La partie data, qui me permet de réaliser des analyses de données et des visualisations.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Artefact;