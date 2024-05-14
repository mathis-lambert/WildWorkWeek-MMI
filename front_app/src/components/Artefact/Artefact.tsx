import './Artefact.scss';
// import {useSelector} from "react-redux";
import React, {useState} from "react";

const Artefact = () => {
    // const session = useSelector((state) => state.session);
    const [hue, setHue] = useState(0);

    const handleMouseOver = (e: React.MouseEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.filter = `drop-shadow(0 0 40px hsla(${hue}, 100%, 50%, 0.45))`;
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.filter = ``;
    };

    // const artefactColors = () => {
    //     const devColor = "hsla(0, 100%, 50%, 1)";
    //     const designColor = "hsla(240, 100%, 50%, 1)";
    //     const dataColor = "hsla(120, 100%, 50%, 1)";
    //
    //     // mix colors depending on the user's skills
    //     let color = "hsla(0, 100%, 50%, 1)";
    // }

    return (
        <div className={"artefact"}>
            <div className="artefact-scroll">
                <h1 className={"artefact-title"}>Mon artefact magique</h1>
                <input type={'range'} min={0} max={360} value={hue} onChange={(e) => setHue(parseInt(e.target.value))}/>
                <div className="artefact-picture" onMouseOver={handleMouseOver}
                     onMouseOut={handleMouseOut}>
                    <img src="/images/artefact/base.png" alt="artefact" style={{filter: `hue-rotate(${hue}deg)`}}/>
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