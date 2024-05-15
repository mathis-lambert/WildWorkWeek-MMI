import {useLocation} from "react-router-dom";
import {ReactNode, useEffect, useState} from "react";
import './GameManager.scss';
import useAssetLoader from "../../hooks/UseAssetLoader.tsx";
import BoutiqueObjet from "../../components/BoutiqueObjet/BoutiqueObjet.tsx";
import LocationCTA from "../../components/LocationCallToAction/LocationCTA.tsx";
import Dialog from "../../components/Dialog/Dialog.tsx";
import {useDispatch, useSelector} from "react-redux";
import {chooseCompanion, chooseWeapon, updateScore} from "../../features/session/sessionSlice.ts";
import {SessionState} from "../../types/Types.ts";
import {URL} from "../../app/socket.ts";
import Enigme from "../../components/Enigme/Enigme.tsx";

const GameManager = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [sceneNumber, setSceneNumber] = useState<string>("");

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
    ]

    const assetsLoaded = useAssetLoader(assets);

    useEffect(() => {
        if (assetsLoaded) {
            setLoading(false);
            loadGame();
        }
    }, [assetsLoaded]);

    const [introVideo, setIntroVideo] = useState<ReactNode>(<></>);

    const loadGame = () => {
        const video: ReactNode = (
            <video src="/videos/intro.webm" autoPlay={true} muted={false} onEnded={() => setSceneNumber("1.0")}/>
        );
        setIntroVideo(video);
        setSceneNumber("0.0");
    };

    useEffect(() => {
        console.log("GameManager mounted");
        console.log(session)
        return () => console.log("GameManager unmounted");
    }, [session]);

    if (loading) {
        return <div>Loading...</div>; // or a loading spinner
    }

    function toggleFullScreen(elem: HTMLElement | null) {
        if (!document.fullscreenElement) {
            elem?.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen()
                .catch((err) => {
                    alert(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
                });
        }
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

    const playSound = async (sound: string) => {
        const audio = new Audio(sound);
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Audio played auto");
            })
                .catch(error => {
                    console.log("Audio play error", error);
                });
        }
    }

    return (
        <>
            <div className="game-layout">
                <h1>GameLayout</h1>
                <p>Current location: {location.pathname}</p>
                <p>Current scene: {sceneNumber}</p>
                <p>Current user: {session.user_firstname} {session.user_lastname}</p>
                <p>Current
                    score: {session.user_score.development} {session.user_score.creativity} {session.user_score.marketing}</p>
                <p>Current weapon: {session.user_weapon}</p>
                <p>Current companion: {session.user_companion}</p>
                <button onClick={() => toggleFullScreen(document.getElementById("root"))}>Fullscreen</button>
                <input type="text" value={sceneNumber} onChange={(e) => setSceneNumber(e.target.value)}
                       placeholder="Scene number"/>
            </div>
            {sceneNumber === "0.0" && (
                <div className={"scene"}>
                    {introVideo}
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
                                        <p>Cette bague incrustée de cristaux luminescents, octroie à son porteur le pouvoir de manipuler les objets à distance grâce à la télékinésie.</p>
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
                                        <p>Un gant colossal, forgé dans le métal le plus résistant, confère à son porteur une force surhumaine dans le bras qu'il équipe.</p>
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
                                        <p>Ces lunettes sinistres, confèrent  à leur porteur un pouvoir de contrôle mental redoutable.</p>
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
                                    <p>Jada est un Kiblun fin stratege doté d’une forte capacité d’analyse et très sociable.</p>
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
                                    <img src={'/images/companions/compagnon_com.png'} alt='Compagnon Com'/>
                                    <h3>MAUGY</h3>
                                    <p>Maugy est un Kiblun doté d'un esprit créatif et  d'une grande ouverture d'esprit. Il apporte une touche de magie et de fantaisie.</p>
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
                                    <img src={'/images/companions/compagnon_crea.png'} alt='Compagnon Crea'/>
                                    <h3>PLOUCOU</h3>
                                    <p>Ploucou est un petit Kiblun dynamique, agile et  intelligent, logique et  curieux.</p>
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
                                content={`En possession de votre ${session.user_weapon} et accompagné ${session.user_companion}, vous avancez vers la taverne afin de boire un dernier canon avant de commencer votre palpitante aventure !`}
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
                            playSound("/sounds/exit-tavern.wav");
                            setSceneNumber("2.3")
                        }}/>
                    </div>
                </div>
            )}

            {sceneNumber === "2.1" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le barman :"}
                                content={"Salut l'ami, que puis-je te servir ?"}
                                onClose={() => setSceneNumber("2.2")} showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("2.2")}
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
                                <p>Un café pour se réveiller</p>
                                <button onClick={() => setSceneNumber("2.2.1")}>Prendre</button>
                            </div>

                            <div className="card">
                                <h3>Épreuve artistique</h3>
                                <p>Un cocktail pour se détendre</p>
                                <button onClick={() => setSceneNumber("2.2.2")}>Prendre</button>
                            </div>

                            <div className="card">
                                <h3>Épreuve sociale</h3>
                                <p>Un verre pour se sociabiliser</p>
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
                                onClose={async () => {
                                    setSceneNumber("2.2");
                                }} showClose={true} showValidate={true}
                                closeText={"Je refais l'épreuve"}
                                validateText={"Continuer l'aventure"}
                                onValidate={() => setSceneNumber("2.2")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.2" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>
                    </div>
                </div>
            )}

            {sceneNumber === "2.2.3" && (
                <div className="scene">
                    <div className="boutique second">
                        <img src={'/images/tavern-game.webp'} alt="background" className="background"/>
                    </div>
                </div>
            )}

            {sceneNumber === "2.3" && (
                <div className="scene">
                    <div className="boutique second">
                        <h1>Sortie de la taverne</h1>
                    </div>
                </div>
            )}
        </>
    );
}

export default GameManager;
