import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import './GameManager.scss';
import useAssetLoader from "../../hooks/UseAssetLoader.tsx";
import BoutiqueObjet from "../../components/BoutiqueObjet/BoutiqueObjet.tsx";
import LocationCTA from "../../components/LocationCallToAction/LocationCTA.tsx";
import Dialog from "../../components/Dialog/Dialog.tsx";
import {useDispatch, useSelector} from "react-redux";
import {chooseCompanion, chooseWeapon, setScore, updateScore} from "../../features/session/sessionSlice.ts";
import {SessionState} from "../../types/Types.ts";
import {URL} from "../../app/socket.ts";
import Enigme from "../../components/Enigme/Enigme.tsx";
import toggleFullScreen from "../../utils/ToggleFullscreen.ts";
import playSound from "../../utils/PlaySound.ts";

const GameManager = () => {
    const [loading, setLoading] = useState(true);
    // const location = useLocation();
    const [sceneNumber, setSceneNumber] = useState<string>("");
    const [sceneHistory, setSceneHistory] = useState<string[]>([])
    const [tavernAudio, setTavernAudio] = useState<HTMLAudioElement | undefined>(undefined)
    const [tavernSoundPlaying, setTavernSoundPlaying] = useState(false)
    const [avanceAudio, setAvanceAudio] = useState<HTMLAudioElement | undefined>(undefined)
    const [avanceSoundPlaying, setAvanceSoundPlaying] = useState(false)

    const session = useSelector((state: SessionState) => state.session);
    const dispatch = useDispatch();

    const assets = [
        "/videos/intro.webm",
        "/images/page-boutique.jpg",
        "/images/etale-marchand.png",
        "/images/exit_shop.png",
        "/images/objets-magiques/bague.png",
        "/images/objets-magiques/gant.png",
        "/images/objets-magiques/glasses.png",
        "/images/companions/compagnon_dev.png",
        "/images/companions/compagnon_crea.png",
        "/images/companions/compagnon_com.png",
        "/images/taverne.jpg",
        "/images/tavern-game.webp",
        "/sounds/exit-tavern.wav",
        "/images/epreuve_com/epreuve_com_img1.jpeg",
        "/images/epreuve_com/epreuve_com_img2.png",
        "/images/epreuve_com/epreuve_com_img3.png",
        "/images/epreuve_com/epreuve_com2-post1.png",
        "/images/epreuve_com/epreuve_com2-post2.png",
        "/images/epreuve_com/epreuve_com2-post3.png",
        "/images/epreuve_com/epreuve_com2-post4.png",
        "/images/epreuve_crea/epreuve_crea-P1.png",
        "/images/epreuve_crea/epreuve_crea-P2.png",
        "/images/epreuve_crea/epreuve_crea-P3.png",
        "/images/epreuve_crea/epreuve_crea-P4.png",
        "/images/epreuve_crea/epreuve_crea-main.png",
        "/images/epreuve_crea/epreuve_crea2-logo1.png",
        "/images/epreuve_crea/epreuve_crea2-logo2.png",
        "/images/epreuve_crea/epreuve_crea2-logo3.png",
        "/images/epreuve_crea/epreuve_crea2-logo4.png",
        "/images/forest.webp",
        "/sounds/tavern-music.mp3",
        "/videos/meet-lezard.mp4",
        "/videos/death-lezard.mp4",
        "/videos/pass-lezard.mp4",
        "/videos/village-entry.mp4",
        "/videos/village.mp4",
        "/images/forest-2.jpg",
        "/sounds/avance.mp3",
        "/videos/escape-village.mp4",
        "/videos/animated-frog.mp4",
        "/images/gardien-village.webp"

    ]

    const assetsLoaded = useAssetLoader(assets);

    useEffect(() => {
        if (assetsLoaded) {
            setLoading(false);
            loadGame();
        }
    }, [assetsLoaded]);

    useEffect(() => {
        sceneHistory.push(sceneNumber);
        console.log(sceneHistory)
    }, [sceneHistory, sceneNumber]);

    useEffect(() => {
        if (sceneNumber) {
            if (sceneNumber.match(/^2\.[0-9]+$/) && !tavernSoundPlaying && sceneNumber !== "2.4") {
                setTavernAudio(playSound("/sounds/tavern-music.mp3", true));
                setTavernSoundPlaying(true);
            } else if (tavernSoundPlaying && !sceneNumber.match(/^2\.[0-9]+$/)) {
                setTavernSoundPlaying(false);
                tavernAudio?.pause();
            }

            if (sceneNumber === "3.2.1") {
                console.log("%cBravo ! tu as eu l'idée d'ouvrir la console de développement", "color: red; font-size: 20px;");
                console.log("%cTu as gagné 10 points en développement", "color: red; font-size: 20px;");
                console.log("%cMon nom est 'André'", "color: red; font-size: 20px;");
                console.log("%cTu peux continuer l'aventure", "color: red; font-size: 20px;");
            }

            if (sceneNumber === "4.0" && !avanceSoundPlaying) {
                setAvanceAudio(playSound("/sounds/avance.mp3", true))
                setAvanceSoundPlaying(true)
            } else if (sceneNumber !== "4.0" && avanceSoundPlaying) {
                avanceAudio?.pause();
                setAvanceSoundPlaying(false)
            }
        }
    }, [sceneNumber, tavernAudio, tavernSoundPlaying]);


    const loadGame = () => {
        if (sceneNumber === "") setSceneNumber("0.0");
    };

    if (loading) {
        return <div>Loading...</div>; // or a loading spinner
    }

    const addScoreToSkill = async (skill: "development" | "creativity" | "marketing", score: number) => {
        const response = await fetch(`${URL}/user/score/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.user_session_token
            },
            body: JSON.stringify({skill: skill, score: score}),
        });

        const data = await response.json();

        if (data.success) {
            dispatch(updateScore({skill: skill, score: score}))
            return true;
        } else {
            return false;
        }
    }

    const setScoreToSkill = async (skill: "development" | "creativity" | "marketing", score: number) => {
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
            dispatch(setScore({skill: skill, score: score}))
            return true;
        } else {
            return false;
        }
    }

    const selectWeapon = async (weapon: 'bague' | 'gant' | 'lunettes' | 'aucun') => {
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
            dispatch(chooseWeapon({weapon: weapon}))
            return true;
        } else {
            return false;
        }
    }

    const selectCompanion = async (companion: 'jada' | 'maugy' | 'ploucou' | 'aucun') => {
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
            dispatch(chooseCompanion({companion: companion}))
            return true;
        } else {
            return false;
        }
    }

    return (
        <>
            <div className="game-layout">
                <h1>GameLayout</h1>
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
                    if (await setScoreToSkill("development", 0) && await setScoreToSkill("creativity", 0) && await setScoreToSkill("marketing", 0)) {
                        console.log("Scores reset")
                    } else {
                        alert("Une erreur est survenue. Veuillez réessayer.");
                    }
                }}>Reset scores
                </button>
                <Link to={"/"}>Back to home</Link>
            </div>

            {sceneNumber === "0.0" && (
                <div className={"scene intro"}>
                    <video src="/videos/intro.webm" autoPlay={true} muted={false}
                           onEnded={() => setSceneNumber("1.0")}/>

                    <div className="intro-actions">
                        <button onClick={() => setSceneNumber("1.0")}>Passer</button>
                    </div>
                </div>
            )}

            {sceneNumber === "1.0" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/page-boutique.jpg'} alt="background" className="background"/>

                        <BoutiqueObjet top={0} left={0} width={15} height={40} modal={{
                            title: "Borne d'arcade",
                            content: "Jouez à des jeux rétro"
                        }}/>
                        <BoutiqueObjet top={70} left={20} width={6} height={15} modal={{
                            title: "Cadre photo",
                            content: "Affichez vos plus beaux souvenirs"
                        }}/>
                        <BoutiqueObjet top={12} left={82} width={9} height={22} modal={{
                            title: "Pull tinder",
                            content: "Trouvez l'amour"
                        }}/>
                        <LocationCTA top={28} left={43} width={10} height={30} onClick={() => setSceneNumber("1.0.1")}/>
                    </div>
                </div>
            )}

            {sceneNumber === "1.0.1" && (
                <div className={"scene"}>
                    <div className="boutique second">
                        <img src={'/images/page-boutique.jpg'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le marchand :"}
                                content={"Avec votre budget, je vais pouvoir vous proposer une de ces 3 Objets Magiques. Alors ?"}
                                onClose={() => setSceneNumber("1.1")} showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("1.1")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "1.1" && (
                <>
                    <div className={"scene"}>
                        <div className="boutique">
                            <img src={'/images/etale-marchand.png'} alt="background" className="background"/>

                            {session.user_weapon !== "aucun" && (
                                <Dialog open={true} title={"- Le marchand :"}
                                        content={"Vous avez déjà un objet magique. Vous ne pouvez en avoir qu'un seul. Désolé."}
                                        onClose={async () => {
                                            if (await selectWeapon("aucun")) {
                                                setSceneNumber("1.1");
                                            }
                                        }} showClose={true} showValidate={true}
                                        closeText={"Je refais mon choix"}
                                        validateText={"Continuer l'aventure"}
                                        onValidate={() => setSceneNumber("1.2")}
                                />
                            )}

                            {session.user_weapon === "aucun" && (
                                <div className="cards objets-magiques">
                                    <div className="card">
                                        <img src={'/images/objets-magiques/bague.png'} alt="bague"/>
                                        <h3>BAGUE DE TÉLÉKINÉSIE</h3>
                                        <p>Cette bague incrustée de cristaux luminescents, octroie à son porteur le
                                            pouvoir de manipuler les objets à distance grâce à la télékinésie.</p>
                                        <button onClick={async () => {
                                            if (await addScoreToSkill("creativity", 20) && await selectWeapon("bague")) {
                                                setSceneNumber("1.2");
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }}>Choisir
                                        </button>

                                    </div>

                                    <div className="card">
                                        <img src={'/images/objets-magiques/gant.png'} alt='gant'/>
                                        <h3>BRAS MÉCANIQUE</h3>
                                        <p>Un gant colossal, forgé dans le métal le plus résistant, confère à son
                                            porteur une force surhumaine dans le bras qu'il équipe.</p>
                                        <button onClick={async () => {
                                            if (await addScoreToSkill("development", 20) && await selectWeapon("gant")) {
                                                setSceneNumber("1.2");
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }}>Choisir
                                        </button>
                                    </div>

                                    <div className="card">
                                        <img src={'/images/objets-magiques/glasses.png'} alt='glasses'/>
                                        <h3>LUNETTE DE CONTRÔLE MENTAL</h3>
                                        <p>Ces lunettes sinistres, confèrent à leur porteur un pouvoir de contrôle
                                            mental redoutable.</p>
                                        <button onClick={async () => {
                                            if (await addScoreToSkill("marketing", 20) && await selectWeapon("lunettes")) {
                                                setSceneNumber("1.2");
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }}>Choisir
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )}

            {sceneNumber === "1.2" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/etale-marchand.png'} alt="background" className="background"/>

                        {session.user_companion !== "aucun" && (
                            <Dialog open={true} title={"- Le marchand :"}
                                    content={"Vous avez déjà un compagnon. Vous ne pouvez en avoir qu'un seul. Désolé."}
                                    onClose={async () => {
                                        if (await selectCompanion("aucun")) {
                                            setSceneNumber("1.2");
                                        }
                                    }} showValidate={true} showClose={true}
                                    onValidate={() => setSceneNumber("1.3")}
                                    closeText={"Je refais mon choix"}
                                    validateText={"Continuer l'aventure"}
                            />
                        )}

                        {session.user_companion === "aucun" && (
                            <div className="cards companions">
                                <div className="card">
                                    <img src={'/images/companions/compagnon_dev.png'} alt='Compagnon Dev'/>
                                    <h3>JADA</h3>
                                    <p>Jada est un Kiblun dynamique, agile et intelligent, logique et curieux.</p>
                                    <button onClick={async () => {
                                        if (await addScoreToSkill("development", 20) && await selectCompanion("jada")) {
                                            setSceneNumber("1.3");
                                        } else {
                                            alert("Une erreur est survenue. Veuillez réessayer.");
                                        }
                                    }}>Choisir
                                    </button>
                                </div>

                                <div className="card">
                                    <img src={'/images/companions/compagnon_crea.png'} alt='Compagnon Crea'/>
                                    <h3>MAUGY</h3>
                                    <p>Maugy est un Kiblun doté d'un esprit créatif et d'une grande ouverture d'esprit.
                                        Il apporte une touche de magie et de fantaisie.</p>
                                    <button onClick={async () => {
                                        if (await addScoreToSkill("creativity", 20) && await selectCompanion("maugy")) {
                                            setSceneNumber("1.3");
                                        } else {
                                            alert("Une erreur est survenue. Veuillez réessayer.");
                                        }
                                    }}>Choisir
                                    </button>
                                </div>

                                <div className="card">
                                    <img src={'/images/companions/compagnon_com.png'} alt='Compagnon Com'/>
                                    <h3>PLOUCOU</h3>
                                    <p>Ploucou est un petit Kiblun fin stratege doté d’une forte capacité d’analyse et
                                        très sociable.</p>
                                    <button onClick={async () => {
                                        if (await addScoreToSkill("marketing", 20) && await selectCompanion("ploucou")) {
                                            setSceneNumber("1.3");
                                        } else {
                                            alert("Une erreur est survenue. Veuillez réessayer.");
                                        }
                                    }}>Choisir
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {sceneNumber === "1.3" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/exit_shop.png'} alt="background" className="background"/>

                        <Dialog open={true}
                                content={`En possession de votre ${session.user_weapon} et accompagné de ${session.user_companion}, vous avancez vers la taverne afin de boire un dernier canon avant de commencer votre palpitante aventure !`}
                                onClose={() => setSceneNumber("2.0")} showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("2.0")}
                                validateText={"Continuer l'aventure"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.0" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/taverne.jpg'} alt="background" className="background"/>

                        <Dialog open={true}
                                content={"Mais quelle joyeuse ambiance ! Il y a des gens partout, des rires, des chansons, des verres qui s'entrechoquent. C'est agréable ici. "}
                                showClose={false} showValidate={false}
                        />

                        <BoutiqueObjet top={20} left={12} width={6} height={14} modal={{
                            title: "Summer Stars 2000",
                            content: "Une affiche du tonnerre !"
                        }}/>
                        <BoutiqueObjet top={19} left={31} width={4} height={14} modal={{
                            title: "iPhone ?",
                            content: "Un téléphone portable"
                        }}/>
                        <BoutiqueObjet top={18} left={35} width={5} height={14} modal={{
                            title: "Evenement",
                            content: "Un événement à ne pas rater"
                        }}/>
                        <BoutiqueObjet top={16} left={40} width={5} height={14} modal={{
                            title: "ile de Porquerolles",
                            content: "une île paradisiaque"
                        }}/>
                        <BoutiqueObjet top={14} left={46} width={6} height={16} modal={{
                            title: "Danse à l'opéra",
                            content: "Plus vite, plus haut, plus fort, ENSEMBLE!"
                        }}/>
                        <BoutiqueObjet top={0} left={56} width={10} height={17} modal={{
                            title: "Danse à l'opéra 2",
                            content: "Plus vite, plus haut, plus fort, ENSEMBLE!"
                        }}/>
                        <LocationCTA top={37} left={33} width={10} height={20} onClick={() => {
                            // BARMAN BEGIN SCENE 2.1
                            setSceneNumber("2.1")
                        }}/>
                        <LocationCTA top={35} left={59} width={15} height={50} onClick={() => {
                            // DOOR EXIT TAVERN BEGIN SCENE 2.3
                            // playSound("/sounds/exit-tavern.wav", false);
                            setSceneNumber("2.4")
                        }}/>
                    </div>
                </div>
            )}

            {sceneNumber === "2.1" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"Alors le jeune ! Tu veux jouer ?  Si tu gagnes, tu prends la mise, sinon tu payes le double. Actuellement, on est à 15 pieces d’or ! Tu as le choix de m’affronter dans un jeu de bon sens, un jeu artistique ou social !"}
                                onClose={() => setSceneNumber("2.3")} showClose={true} showValidate={true}
                                onValidate={() => setSceneNumber("2.2")}
                                validateText={"Voyons voir ce que tu proposes ..."}
                                closeText={"Je ne suis pas intéressé"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.2" && (
                <div className={"scene"}>
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <div className="cards">
                            <div className="card">
                                <h3>Épreuve de bon-sens</h3>
                                <button onClick={() => setSceneNumber("2.2.1")}>Prendre</button>
                            </div>

                            <div className="card">
                                <h3>Épreuve artistique</h3>
                                <button onClick={() => setSceneNumber("2.2.2")}>Prendre</button>
                            </div>

                            <div className="card">
                                <h3>Épreuve sociale</h3>
                                <button onClick={() => setSceneNumber("2.2.3")}>Prendre</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.1" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Enigme
                            text={"Quelle est la commande qui permet d’afficher du texte en Python ?"}
                            answer={"print"}
                            type={"text"}
                            onValidate={async (response) => {
                                if (response === "print") {
                                    if (await addScoreToSkill("development", 10)) {
                                        setSceneNumber("2.2.1.1");
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                } else {
                                    setSceneNumber("2.2.4");
                                }
                            }}/>
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.1.1" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"Bravo ! Tu as réussi l'épreuve de bon-sens. Tu as gagné 10 points en développement."}
                                onClose={async () => {
                                    if (await addScoreToSkill("development", 10)) {
                                        setSceneNumber("2.3");
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                }} showClose={false} showValidate={true}
                                validateText={"Continuer l'aventure"}
                                onValidate={() => setSceneNumber("2.3")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.4" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"ARG ! Mauvaise réponse. Tu as le choix entre recommencer ou changer d'épreuve."}
                                onClose={async () =>
                                    setSceneNumber(sceneHistory[sceneHistory.length - 2])
                                } showClose={true} showValidate={true}
                                closeText={"Je refais l'épreuve"}
                                validateText={"Je change d'épreuve"}
                                onValidate={() => setSceneNumber("2.2")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.2" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Enigme
                            text={"Un morceau du logo est manquant. Trouve le bon morceau pour compléter le logo."}
                            type={"puzzle"}
                            puzzleImages={{
                                original: "/images/epreuve_crea/epreuve_crea-main.png",
                                pieces: [
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea-P1.png",
                                        answer: "correct"
                                    },
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea-P2.png",
                                        answer: "incorrect"
                                    },
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea-P3.png",
                                        answer: "incorrect"
                                    },
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea-P4.png",
                                        answer: "incorrect"
                                    }]

                            }}
                            onValidate={async (response) => {
                                console.log(response)
                                if (response === "correct") {
                                    if (await addScoreToSkill("creativity", 10)) {
                                        setSceneNumber("2.2.2.1")
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                } else {
                                    setSceneNumber("2.2.4");
                                }
                            }}
                            puzzleDragZone={{
                                top: 10,
                                left: 55,
                                width: 35,
                                height: 37
                            }}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.2.1" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"Bravo ! Tu as réussi l'épreuve de créativité. Tu as gagné 10 points en création numérique."}
                                onClose={async () => {
                                    if (await addScoreToSkill("creativity", 10)) {
                                        setSceneNumber("2.3");
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                }} showClose={false} showValidate={true}
                                validateText={"Continuer l'aventure"}
                                onValidate={() => setSceneNumber("2.3")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.3" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Enigme
                            text={
                                "Pour réaliser une communication efficace d’un festival de musique, quel support est le plus adapté à être affiché en grand (ville, arrêt de bus, entrée du festival...) ?"
                            }
                            description={"Ces supports de communication imprimés ont été créés sur Illustrator par deux étudiants en MMI, spécialisés en création numérique. Le projet consistait à choisir une époque et un type de musique, puis à concevoir des supports de communication en rapport avec ces choix. Les étudiants ont opté pour les années 70 avec le thème disco."}
                            answer={"1"}
                            type={"image-choice"}
                            images={[{
                                url: "/images/epreuve_com/epreuve_com_img1.jpeg",
                                answer: "correct"
                            }, {
                                url: "/images/epreuve_com/epreuve_com_img2.png",
                                answer: "incorrect"
                            }, {
                                url: "/images/epreuve_com/epreuve_com_img3.png",
                                answer: "incorrect"
                            }]}

                            onValidate={async (response) => {
                                console.log(response)
                                if (response === "correct") {
                                    if (await addScoreToSkill("marketing", 10)) {
                                        setSceneNumber("2.2.3.1");
                                    }
                                } else {
                                    setSceneNumber("2.2.4");
                                }
                            }}
                        />


                    </div>
                </div>
            )}

            {sceneNumber === "2.2.3.1" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"Bravo ! Tu as réussi l'épreuve de social. Tu as gagné 10 points en marketing."}
                                onClose={async () => {
                                    if (await addScoreToSkill("marketing", 10)) {
                                        setSceneNumber("2.3");
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                }} showClose={false} showValidate={true}
                                validateText={"Continuer l'aventure"}
                                onValidate={() => setSceneNumber("2.3")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.3" && (
                <div className="scene">
                    <div className="boutique">
                        <img src={'/images/taverne.jpg'} alt="background" className="background"/>

                        <LocationCTA top={35} left={59} width={15} height={50} onClick={() => {
                            // DOOR EXIT TAVERN BEGIN SCENE 2.3
                            setSceneNumber("2.4")
                        }}/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"Il est temps de partir à l'aventure. Bonne chance !"}
                                showClose={false} showValidate={false}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.4" && (
                <div className="scene">
                    <div className="boutique">
                        <img src={'/images/forest.webp'} alt="background" className="background"/>

                        <Dialog open={true}
                                content={"Quoi qu’il se soit passé dans cette taverne, c’est maintenant derriere vous, mais retenez simplement que les choix ont leurs importance."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("3.0")}
                                validateText={"Continuer l'aventure"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.0" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/meet-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"Et comme rien ne se passe jamais comme prévu, un lézard vous bloque l’entrée à la foret ! Il n’a pas l’air sauvage mais n’a pas l’air bienveillant non plus... Vous avez vraiment besoin d’aller dans cette foret !"}
                                showClose={true} showValidate={true}
                                onClose={() => {
                                    setSceneNumber("3.1.1")
                                    playSound("/sounds/voice-death-lezard.wav", false);
                                }}
                                onValidate={async () => {
                                    if (await addScoreToSkill("marketing", 10)) {
                                        setSceneNumber("3.1.2")
                                    }
                                }}
                                validateText={"Parler au lézard"}
                                closeText={"Tuer le lézard"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.1.1" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/death-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={`
                                    Vous décidez de sortir votre ${session.user_weapon} et de dégager vous même le passage en assénant au vieux Lézard, un coup unique et mortel.  
                                    Celui-ci couché, vous regardera en poussant des cris d’agonie, jusqu’a ce que la vie quitte son corps...
                                    Une voie inconnu dans sa tête lui parle
                                `}
                                buttons={[
                                    {
                                        text: "Continuer",
                                        onClick: () => setSceneNumber("3.1.2")
                                    }
                                ]}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.1.2" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/meet-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"Humain, si tu souhaites passer, indique-moi simplement quel atout voudrais-tu sauver parmi ces trois là :"}
                                buttons={[
                                    {
                                        text: "Ta voix",
                                        onClick: async () => {
                                            if (await addScoreToSkill("marketing", 10)) {
                                                setSceneNumber("3.2.3")
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }
                                    },
                                    {
                                        text: "Ta main dominante",
                                        onClick: async () => {
                                            if (await addScoreToSkill("creativity", 10)) {
                                                setSceneNumber("3.2.2")
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }
                                    },
                                    {
                                        text: "Ta mémoire",
                                        onClick: async () => {
                                            if (await addScoreToSkill("development", 10)) {
                                                setSceneNumber("3.2.1")
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }
                                    }
                                ]}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.2.1" && (
                // DEVELOPMENT SCENE
                <div className="scene">
                    <div className="boutique second">
                        <video src="/videos/meet-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>
                    </div>

                    <Enigme
                        text={"Quel est mon nom ? Au plus profond de la foret, dans un espace invisible sauf pour les créateurs tu le trouveras"}
                        type={"text"}
                        answer={"andré"}
                        onValidate={async (answer) => {
                            if (answer.toLowerCase() === "andré") {
                                if (await addScoreToSkill("development", 20)) {
                                    setSceneNumber("3.3")
                                } else {
                                    alert("Une erreur est survenue. Veuillez réessayer.");
                                }
                            } else {
                                setSceneNumber("3.2.4")
                            }
                        }}
                    />
                </div>
            )}

            {sceneNumber === "3.2.2" && (
                // CREATIVE SCENE
                <div className="scene">
                    <div className="boutique second">
                        <video src="/videos/meet-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Enigme
                            text={"Quel logo est le meilleur pour une agence audiovisuelle ?"}
                            type={"image-choice"}
                            images={[{
                                url: "/images/epreuve_crea/epreuve_crea2-logo3.png",
                                answer: "incorrect"
                            }, {
                                url: "/images/epreuve_crea/epreuve_crea2-logo2.png",
                                answer: "incorrect"
                            }, {
                                url: "/images/epreuve_crea/epreuve_crea2-logo1.png",
                                answer: "correct"
                            }, {
                                url: "/images/epreuve_crea/epreuve_crea2-logo4.png",
                                answer: "incorrect"
                            }]}
                            onValidate={async (answer) => {
                                if (answer.toLowerCase() === "correct") {
                                    if (await addScoreToSkill("creativity", 20)) {
                                        setSceneNumber("3.3")
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                } else {
                                    setSceneNumber("3.2.4")
                                }
                            }}
                            description={"Ces logos ont été réalisés par des étudiants de première et deuxième année en parcours création numérique pour divers projets."}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.2.3" && (
                // MARKETING SCENE
                <div className="scene">
                    <div className="boutique second">
                        <video src="/videos/meet-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Enigme
                            text={"Quel post Instagram est le meilleur pour une agence de développement web ?"}
                            type={"image-choice"}
                            images={[{
                                url: "/images/epreuve_com/epreuve_com2-post3.png",
                                answer: "incorrect"
                            }, {
                                url: "/images/epreuve_com/epreuve_com2-post2.png",
                                answer: "incorrect"
                            }, {
                                url: "/images/epreuve_com/epreuve_com2-post1.png",
                                answer: "correct"
                            }, {
                                url: "/images/epreuve_com/epreuve_com2-post4.png",
                                answer: "incorrect"
                            }]}
                            onValidate={async (answer) => {
                                if (answer.toLowerCase() === "correct") {
                                    if (await addScoreToSkill("marketing", 10)) {
                                        setSceneNumber("3.3")
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                } else {
                                    setSceneNumber("3.2.4")
                                }
                            }}
                            description={"Ces posts Instagram ont été réalisés par des étudiants en deuxième et troisième année de MMI, spécialisés en création numérique et stratégie de communication. Ces créations ont été utilisées dans plusieurs projets différents."}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.2.4" && (
                <div className="scene">
                    <div className="boutique second">
                        <video src="/videos/meet-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"ARG ! Mauvaise réponse. Tu as le choix entre recommencer ou changer d'épreuve."}
                                onClose={async () =>
                                    setSceneNumber(sceneHistory[sceneHistory.length - 2])
                                } showClose={true} showValidate={true}
                                closeText={"Je refais l'épreuve"}
                                validateText={"Je change d'épreuve"}
                                onValidate={() => setSceneNumber("3.1.2")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.3" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/pass-lezard.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                title={"- Le lézard :"}
                                content={"Humain, ta valeur te permet d'accéder à cette forêt. En définitive, ma  question était superflue. Je cherchais simplement à m'assurer que tu ne  portais pas une intention destructrice. Mon existence encore présente me donne la réponse que je cherchais."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("3.4")}
                                validateText={"Continuer l'aventure"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.4" && (
                <div className="scene forest-2">
                    <div className="boutique">
                        <img src="/images/forest-2.jpg" className={"background"} alt="forest"/>


                        <div className="forest-actions">
                            <button onClick={() => setSceneNumber("3.5")}>Sortir de la fôret</button>
                        </div>

                        <BoutiqueObjet
                            top={40}
                            left={10}
                            width={15}
                            height={10}
                            modal={{
                                title: "PROV'ANSE",
                                content: "La conception de ce logo a été réalisée en septembre 2023 dans le cadre d’un projet fictif pour mon cours de marketing. L’objectif était de concevoir une marque locale de vêtements tout en intégrant ses objectifs marketing. Nous avons choisi de créer des t-shirts mettant en avant les villes de la région PACA. Ainsi, nous avons nommé notre marque « Prov’anse », pour mettre en avant la Provence et son lien avec la Méditerranée."
                            }}
                        />

                        <BoutiqueObjet
                            top={11}
                            left={32}
                            width={10}
                            height={10}
                            modal={{
                                title: "BURGER",
                                content: "Ces maquettes de sites UX ont été réalisées par des étudiants en deuxième année de MMI. Le projet consistait à développer un site fonctionnel permettant de personnaliser sa commande et certains aliments."
                            }}
                        />

                        <BoutiqueObjet
                            top={40}
                            left={25}
                            width={10}
                            height={23}
                            modal={{
                                title: "GROTTE",
                                content: "Cette grotte a été modélisée en 3D par des étudiants en deuxième année, parcours création numérique. Le projet consistait à créer un environnement inspiré du film « Au centre de la Terre ». La grotte en 3D a été projetée en arrière-plan lors du spectacle de fin d’année des danseurs du Lycée Dumont d’Urville."
                            }}
                        />

                        <BoutiqueObjet
                            top={50}
                            left={55}
                            width={45}
                            height={40}
                            modal={{
                                title: "LAC",
                                content: "Cette visite virtuelle sous-marine de Port-Cros a été réalisée par deux étudiants en troisième année de MMI, parcours création numérique, lors d’un projet visant à découvrir le parc naturel et sensibiliser à la préservation de l’environnement."
                            }}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "3.5" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/village-entry.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"Vous avez enfin quitté la forêt. Avez-vous apprécié votre immersion dans la nature ? Tout individu ordinaire est capable de vivre en harmonie avec les animaux, et c'est véritablement magnifique... Vos pas vous mènent maintenant vers le village de Prov’anse, ou ce qu’il en reste..."}
                                showClose={false} showValidate={true}
                                onValidate={() => {
                                    setSceneNumber("4.0")
                                }}
                                validateText={"Continuer l'aventure"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.0" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/village.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"En arrivant au village, vous êtes confronté à un spectacle lugubre : le village est complètement abandonné et un gaz toxique s'échappe des habitations. Une voix faible semble vous appeler. Que faites-vous ?"}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.1.2")}
                                validateText={"Choisir un autre chemin"}
                                enigme={{
                                    type: "text",
                                    answer: "avance",
                                    onValidate: async (answer) => {
                                        if (answer.toLowerCase() === "avance" || answer.toLowerCase() === "j'avance" || answer.toLowerCase() === "avancer") {
                                            if (await addScoreToSkill("marketing", 10)) {
                                                setSceneNumber("4.1.2")
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        } else {
                                            setSceneNumber("4.0.1")
                                        }
                                    }
                                }}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.0.1" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/village.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"ARG ! Mauvaise réponse. Vous avez une autre chance."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.0")}
                                validateText={"Réessayer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.1.1" && (
                // LEAVE VILLAGE
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/escape-village.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"Vous décidez donc de contourner le village du côté opposé à la voix afin de ne pas être touché par le gaz. En passant, les fantômes semblent se moquer de vous... En même temps, vous les abandonnez, vous aussi. Juste avant de partir, vous vous retrouvez devant une grande porte avec une pierre  cassée en son centre."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.1.2")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.1.2" && (
                // AVANCE
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/gardien-village.webp" className={"background"} alt="village"/>

                        <Dialog open={true}
                                content={"Vous vous trouvez face à face avec un gardien Atmosud. Ces créatures sont le  reflet de l'âme des aventuriers et peuvent apparaître pour les plus courageux dans les situations les plus critiques. \n" +
                                    "Le vôtre semble essayer de vous dire quelque chose... Parviendrez-vous à comprendre son  message ?"}
                                buttons={[
                                    {
                                        text: "Déchiffrer le message",
                                        onClick: () => setSceneNumber("4.2")
                                    },
                                    {
                                        text: "Rebrousser chemin",
                                        onClick: () => setSceneNumber("4.3")
                                    }
                                ]}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.2" && (
                // AVANCE
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/gardien-village.webp" className={"background"} alt="village"/>

                        <Enigme
                            text={"“Buufoujpo bvy hba upyjrvft”"}
                            type={"text"}
                            answer={"attention aux gaz toxiques"}
                            onValidate={async (answer) => {
                                if (answer.toLowerCase() === "attention aux gaz toxiques") {
                                    if (await addScoreToSkill("development", 30)) {
                                        setSceneNumber("4.4")
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                } else {
                                    setSceneNumber("4.2.1")
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.2.1" && (
                // AVANCE
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/gardien-village.webp" className={"background"} alt="village"/>

                        <Dialog open={true}
                                content={"ARG ! Mauvaise réponse. Vous avez une autre chance."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.2")}
                                validateText={"Réessayer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.3" && (
                // AVANCE
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/escape-village.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"Vous décidez de rebrousser chemin. Vous n'avez pas réussi à comprendre le message du gardien. Vous avez peur de vous aventurer dans ce village abandonné. Vous décidez de partir."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.5")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.4" && (
                // AVANCE
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/animated-frog.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <Dialog open={true}
                                content={"Après que vous ayez pris le temps de déchiffrer l’avertissement du  gardien, il s’éleva et fit disparaître le gaz, vous laissant l’accès à la traversée du village."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.5")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.5" && (
                // PORTE DE SORTIE
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/exit-village.webp" className={"background"} alt="village"/>

                        <Dialog open={true}
                                content={"Une porte vous barre la route...\n" +
                                    "Vous appercevez une affiche déchiré sur la porte..."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("5.0")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default GameManager;
