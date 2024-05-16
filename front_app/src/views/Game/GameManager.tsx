import {useEffect, useRef, useState} from "react";
import './GameManager.scss';
import useAssetLoader from "../../hooks/UseAssetLoader.tsx";
import BoutiqueObjet from "../../components/BoutiqueObjet/BoutiqueObjet.tsx";
import LocationCTA from "../../components/LocationCallToAction/LocationCTA.tsx";
import Dialog from "../../components/Dialog/Dialog.tsx";
import {useDispatch, useSelector} from "react-redux";
import {chooseCompanion, chooseWeapon, updateScore} from "../../features/session/sessionSlice.ts";
import {SessionState} from "../../types/Types.ts";
import Enigme from "../../components/Enigme/Enigme.tsx";
import playSound from "../../utils/PlaySound.ts";
import {useLocation} from "react-router-dom";
import addScoreToSkill from "../../utils/AddScoreToSkill.ts";
// import DevLayout from "../../components/Layout/Game/DevLayout.tsx";
import GameLayout from "../../components/Layout/Game/GameLayout.tsx";
import selectWeapon from "../../utils/SelectWeapon.ts";
import selectCompanion from "../../utils/SelectCompanion.ts";
import Loader from "../../components/Loader/Loader.tsx";
import {useNavigate} from "react-router-dom";
import {getHsl} from "../../utils/ColorsUtils.ts";

const GameManager = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [sceneNumber, setSceneNumber] = useState<string>("");
    const [sceneHistory, setSceneHistory] = useState<string[]>([])
    const [boutiqueSoundPlaying, setBoutiqueSoundPlaying] = useState(false)
    const [tavernSoundPlaying, setTavernSoundPlaying] = useState(false)
    const [forestSoundPlaying, setForestSoundPlaying] = useState(false)
    const [villageSoundPlaying, setVillageSoundPlaying] = useState(false)
    const [mountainSoundPlaying, setMountainSoundPlaying] = useState(false)
    const [forgeSoundPlaying, setForgeSoundPlaying] = useState(false)
    const [avanceSoundPlaying, setAvanceSoundPlaying] = useState(false)
    const [revealSoundPlaying, setRevealSoundPlaying] = useState(false)
    const [mountainCount, setMountainCount] = useState(15)

    const boutiqueAudioRef = useRef<HTMLAudioElement | null>(null);
    const tavernAudioRef = useRef<HTMLAudioElement | null>(null);
    const forestAudioRef = useRef<HTMLAudioElement | null>(null);
    const villageAudioRef = useRef<HTMLAudioElement | null>(null);
    const avanceAudioRef = useRef<HTMLAudioElement | null>(null);
    const mountainAudioRef = useRef<HTMLAudioElement | null>(null);
    const forgeAudioRef = useRef<HTMLAudioElement | null>(null);
    const revealAudioRef = useRef<HTMLAudioElement | null>(null);

    const [hsl, setHsl] = useState([0, 0, 0]);


    const session: SessionState["session"] = useSelector((state: SessionState) => state.session);
    const navigate = useNavigate();
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
        "/images/taverne.png",
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
        "/images/epreuve_crea/epreuve_crea3-P1.jpg",
        "/images/epreuve_crea/epreuve_crea-P2.png",
        "/images/epreuve_crea/epreuve_crea3-P2.jpg",
        "/images/epreuve_crea/epreuve_crea-P3.png",
        "/images/epreuve_crea/epreuve_crea3-P3.jpg",
        "/images/epreuve_crea/epreuve_crea-P4.png",
        "/images/epreuve_crea/epreuve_crea3-P4.jpg",
        "/images/epreuve_crea/epreuve_crea-main.png",
        "/images/epreuve_crea/epreuve_crea3-main.png",
        "/images/epreuve_crea/epreuve_crea2-logo1.png",
        "/images/epreuve_crea/epreuve_crea2-logo2.png",
        "/images/epreuve_crea/epreuve_crea2-logo3.png",
        "/images/epreuve_crea/epreuve_crea2-logo4.png",
        "/images/forest.webp",
        "/sounds/tavern-music.mp3",
        "/videos/meet-lezard.mp4",
        "/videos/death-lezard.mp4",
        "/videos/pass-lezard.mp4",
        "/videos/mountain.mp4",
        "/videos/village-entry.mp4",
        "/videos/village.mp4",
        "/images/forest-2.jpg",
        "/sounds/avance.mp3",
        "/sounds/shop-music.mp3",
        "/sounds/forest-music.mp3",
        "/sounds/village-music.mp3",
        "/sounds/mountain-music.mp3",
        "/sounds/collapsing.mp3",
        "/sounds/forge-music.mp3",
        "/sounds/reveal-music.mp3",
        "/videos/escape-village.mp4",
        "/videos/animated-frog.mp4",
        "/images/gardien-village.webp",
        "/images/enter-shop.webp",
        "/videos/mountain-collapse.mp4",
        "/videos/mountain-exit-1.mp4",
        "/videos/mountain-exit-2.mp4",
        "/videos/forge.mp4",
        "/images/blacksmith.webp",
        "/images/realisations/borne-arcade.png",
        "/images/realisations/pull-tinder.png",
        "/images/realisations/livre-tinder.png",
        "/images/realisations/affiche-2000.png",
        "/images/realisations/affiche-dao-1.png",
        "/images/realisations/affiche-askip.png",
        "/images/realisations/affiche-port-cros.png",
        "/images/realisations/affiche-dao-2.jpg",
        "/images/realisations/affiche-apple.png",
        "/images/realisations/lezard-real.png"
    ];

    const assetsLoaded = useAssetLoader(assets);

    useEffect(() => {
        if (assetsLoaded) {
            setLoading(false);
            loadGame();
        }
    }, [assetsLoaded]);

    useEffect(() => {
        sceneHistory.push(sceneNumber);
    }, [sceneHistory, sceneNumber]);

    useEffect(() => {
        if (sceneNumber) {
            if (sceneNumber.match(/^1(\.[0-9]+)+$/) && !boutiqueSoundPlaying) {
                boutiqueAudioRef.current = playSound("/sounds/shop-music.mp3", true);
                setBoutiqueSoundPlaying(true);
            } else if (tavernSoundPlaying && !sceneNumber.match(/^1(\.[0-9]+)+$/)) {
                setBoutiqueSoundPlaying(false);
                boutiqueAudioRef.current?.pause();
            }

            if (sceneNumber.match(/^2(\.[0-9]+)+$/) && !tavernSoundPlaying && sceneNumber !== "2.4") {
                tavernAudioRef.current = playSound("/sounds/tavern-music.mp3", true);
                setTavernSoundPlaying(true);
            } else if (tavernSoundPlaying && !sceneNumber.match(/^2(\.[0-9]+)+$/)) {
                setTavernSoundPlaying(false);
                tavernAudioRef.current?.pause();
            }

            if (sceneNumber.match(/^3(\.[0-9]+)+$/) && !forestSoundPlaying) {
                forestAudioRef.current = playSound("/sounds/forest-music.mp3", true);
                setForestSoundPlaying(true);
            } else if (forestSoundPlaying && !sceneNumber.match(/^3(\.[0-9]+)+$/)) {
                forestAudioRef.current?.pause();
                setForestSoundPlaying(false);
            }

            if (sceneNumber.match(/^4(\.[0-9]+)+$/) && !villageSoundPlaying) {
                villageAudioRef.current = playSound("/sounds/village-music.mp3", true);
                setVillageSoundPlaying(true);
            } else if (villageSoundPlaying && !sceneNumber.match(/^4(\.[0-9]+)+$/)) {
                villageAudioRef.current?.pause();
                setVillageSoundPlaying(false);
            }

            if (sceneNumber.match(/^5(\.[0-9]+)+$/) && !mountainSoundPlaying) {
                mountainAudioRef.current = playSound("/sounds/mountain-music.mp3", true);
                setMountainSoundPlaying(true);
            } else if (mountainSoundPlaying && !sceneNumber.match(/^5(\.[0-9]+)+$/)) {
                mountainAudioRef.current?.pause();
                setMountainSoundPlaying(false);
            }

            if (sceneNumber.match(/^6(\.[0-9]+)+$/) && !forgeSoundPlaying) {
                forgeAudioRef.current = playSound("/sounds/forge-music.mp3", true);
                setForgeSoundPlaying(true);
            } else if (forgeSoundPlaying && !sceneNumber.match(/^6(\.[0-9]+)+$/)) {
                forgeAudioRef.current?.pause();
                setForgeSoundPlaying(false);
            }

            if (sceneNumber.match(/^7(\.[0-9]+)+$/) && !revealSoundPlaying) {
                revealAudioRef.current = playSound("/sounds/reveal-music.mp3", true);
                setRevealSoundPlaying(true);
            } else if (revealSoundPlaying && !sceneNumber.match(/^7(\.[0-9]+)+$/)) {
                revealAudioRef.current?.pause();
                setRevealSoundPlaying(false);
            }


            if (sceneNumber === "3.2.1") {
                console.log("%cBravo ! tu as eu l'idée d'ouvrir la console de développement", "color: red; font-size: 20px;");
                console.log("%cTu as gagné 10 points en développement", "color: red; font-size: 20px;");
                console.log("%cMon nom est 'André'", "color: red; font-size: 20px;");
                console.log("%cTu peux continuer l'aventure", "color: red; font-size: 20px;");
            }

            if (sceneNumber === "4.0" && !avanceSoundPlaying) {
                avanceAudioRef.current = playSound("/sounds/avance.mp3", true);
                setAvanceSoundPlaying(true)
            } else if (sceneNumber !== "4.0" && avanceSoundPlaying) {
                avanceAudioRef.current?.pause();
                setAvanceSoundPlaying(false)
            }

            if (sceneNumber === "5.1") {
                playSound("/sounds/collapsing.mp3", false)
            }
        }
    }, [avanceSoundPlaying, boutiqueSoundPlaying, forestSoundPlaying, forgeSoundPlaying, mountainSoundPlaying, sceneNumber, tavernSoundPlaying, villageSoundPlaying]);

    useEffect(() => {
        if (sceneNumber === "5.1") {
            setMountainCount(15);
            const interval = setInterval(() => {
                setMountainCount(prevCount => {
                    if (prevCount === 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [sceneNumber]);

    useEffect(() => {
        if (!location.pathname.includes("/game")) {
            return () => {
                stopAllAudio();
            };
        }
    }, [location]);

    const stopAllAudio = () => {
        boutiqueAudioRef.current?.pause();
        tavernAudioRef.current?.pause();
        forestAudioRef.current?.pause();
        villageAudioRef.current?.pause();
        mountainAudioRef.current?.pause();
        forgeAudioRef.current?.pause();
        avanceAudioRef.current?.pause();
        revealAudioRef.current?.pause();
    }

    useEffect(() => {
        if (mountainCount === 0) {
            setSceneNumber("5.0");
        }
    }, [mountainCount]);

    useEffect(() => {
        setHsl(getHsl(session));
    }, [session]);


    const loadGame = () => {
        if (sceneNumber === "") setSceneNumber("0.0");
    };

    if (loading) {
        return <Loader/>
    }

    return (
        <>
            {/*<DevLayout sceneNumber={sceneNumber} setSceneNumber={(n: string) => setSceneNumber(n)}*/}
            {/*           sceneHistory={sceneHistory} setSceneHistory={(h) => setSceneHistory(h)}*/}
            {/*           stopAllAudio={stopAllAudio}/>*/}
            <GameLayout setSceneNumber={(n: string) => setSceneNumber(n)} sceneHistory={sceneHistory}
                        setSceneHistory={(h) => setSceneHistory(h)} stopAllAudio={stopAllAudio}/>

            {sceneNumber === "0.0" && (
                <div className={"scene intro"}>
                    <video src="/videos/intro.webm" autoPlay={true} muted={false}
                           onEnded={() => setSceneNumber("0.1")}/>

                    <div className="intro-actions">
                        <button onClick={() => setSceneNumber("0.1")}>Passer</button>
                    </div>
                </div>
            )}

            {sceneNumber === "0.1" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/enter-shop.webp'} alt="background" className="background"/>

                        <Dialog open={true}
                                content={"Après cette découverte, vous décidez de préparer vos affaires et de  faire un dernier tour en ville, comme un adieu, avant de partir pour  votre longue aventure. Vous commencez votre tour par la boutique des aventuriers afin d’acheter un équipement."}
                                showValidate={true}
                                onValidate={() => setSceneNumber("1.0")}
                                validateText={"Continuer l'aventure"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "1.0" && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={'/images/page-boutique.jpg'} alt="background" className="background"/>

                        <BoutiqueObjet
                            top={0}
                            left={0}
                            width={15}
                            height={40}
                            modal={{
                                title: "Borne d'arcade",
                                content: "L'affiche présente une borne d'arcade colorée et rétro. Elle a été créée par des étudiants de première année en BUT MMI (Métiers du Multimédia et de l'Internet) dans le cadre d'une SAE (Situation d'Apprentissage et d'Évaluation). Lors de cette SAE, les étudiants ont été répartis en différentes agences fictives, chacune chargée d'organiser un événement spécifique. Pour ce groupe particulier, l'événement consistait à installer une borne d'arcade au sein de l'université. " +
                                    "Pour cette SAE, les étudiants ont également été en charge de créer un site internet, un logo et plusieurs supports de communication, que ce soit print ou numérique.",
                                image: "/images/realisations/borne-arcade.png"
                            }}

                        />
                        <BoutiqueObjet top={70} left={20} width={6} height={15} modal={{
                            title: "Couverture d'un livre Tinder",
                            content: "La couverture du livre « bienvenue sur la planète Tinder baby », réalisée sur Figma, a été conçue par des étudiants de troisième année en parcours communication dans le cadre d'une SAE. Cette SAE avait pour but de développer une campagne de communication et de crowdfunding pour le lancement d'un livre sur les rencontres que l’ont peu faire sur Tinder.",
                            image: "/images/realisations/livre-tinder.png"
                        }}/>
                        <BoutiqueObjet top={12} left={82} width={9} height={22} modal={{
                            title: "Pull Tinder",
                            content: "Le mockup de ce pull créé par des étudiants de 3ème année en parcours communication dans le cadre d'une SAE. Dans cette SAE, les étudiants avaient pour objectif de développer une campagne de communication et de crowdfunding pour le lancement d'un livre sans budget. " +
                                "Sur le dos du pull, un QR code est imprimé, renvoyant au site permettant de commander le livre. Ce dernier regroupe des histoires courtes sur les personnes que l'on peut rencontrer sur Tinder.",
                            image: "/images/realisations/pull-tinder.png"
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
                                            if (await selectWeapon(session, "aucun", (p) => {
                                                dispatch(chooseWeapon(p))
                                            })) {
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
                                            if (await addScoreToSkill(session, "creativity", 20, (p) => {
                                                    dispatch(updateScore(p))
                                                }) &&
                                                await selectWeapon(session, "bague", (p) => {
                                                    dispatch(chooseWeapon(p))
                                                })) {
                                                setSceneNumber("1.2");
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }}>Acheter
                                        </button>

                                    </div>

                                    <div className="card">
                                        <img src={'/images/objets-magiques/gant.png'} alt='gant'/>
                                        <h3>BRAS MÉCANIQUE</h3>
                                        <p>Un gant colossal, forgé dans le métal le plus résistant, confère à son
                                            porteur une force surhumaine dans le bras qu'il équipe.</p>
                                        <button onClick={async () => {
                                            if (await addScoreToSkill(session, "development", 20, (p) => {
                                                    dispatch(updateScore(p))
                                                }) &&
                                                await selectWeapon(session, "gant", (p) => {
                                                    dispatch(chooseWeapon(p))
                                                })) {
                                                setSceneNumber("1.2");
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }}>Acheter
                                        </button>
                                    </div>

                                    <div className="card">
                                        <img src={'/images/objets-magiques/glasses.png'} alt='glasses'/>
                                        <h3>LUNETTE DE CONTRÔLE MENTAL</h3>
                                        <p>Ces lunettes sinistres, confèrent à leur porteur un pouvoir de contrôle
                                            mental redoutable.</p>
                                        <button onClick={async () => {
                                            if (await addScoreToSkill(session, "marketing", 20, (p) => {
                                                    dispatch(updateScore(p))
                                                }) &&
                                                await selectWeapon(session, "lunettes", (p) => {
                                                    dispatch(chooseWeapon(p))
                                                })) {
                                                setSceneNumber("1.2");
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }}>Acheter
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
                                        if (await selectCompanion(session, "aucun", (p) => {
                                            dispatch(chooseCompanion(p))
                                        })) {
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
                                        if (await addScoreToSkill(session, "development", 20, (p) => {
                                                dispatch(updateScore(p))
                                            }) &&
                                            await selectCompanion(session, "jada", (p) => {
                                                dispatch(chooseCompanion(p))
                                            })) {
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
                                        if (await addScoreToSkill(session, "creativity", 20, (p) => {
                                                dispatch(updateScore(p))
                                            }) &&
                                            await selectCompanion(session, "maugy", (p) => {
                                                dispatch(chooseCompanion(p))
                                            })) {
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
                                        if (await addScoreToSkill(session, "marketing", 20, (p) => {
                                                dispatch(updateScore(p))
                                            }) &&
                                            await selectCompanion(session, "ploucou", (p) => {
                                                dispatch(chooseCompanion(p))
                                            })) {
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
                        <img src={'/images/taverne.png'} alt="background" className="background"/>

                        <Dialog open={true}
                                content={"Mais quelle joyeuse ambiance ! Il y a des gens partout, des rires, des chansons, des verres qui s'entrechoquent. C'est agréable ici. "}
                                showClose={false} showValidate={false}
                        />

                        <BoutiqueObjet top={20} left={12} width={6} height={14} modal={{
                            title: "Summer Stars 2000",
                            content: "Cette affiche a été créée sur InDesign par un étudiant en MMI, spécialisé en création numérique. Le projet consistait à choisir une époque et un type de musique, puis à concevoir des supports de communication en rapport avec ces choix. L'étudiant a choisi les années 2000 avec le thème pop. ",
                            image: "/images/realisations/affiche-2000.png"
                        }}/>
                        <BoutiqueObjet top={19} left={31} width={4} height={14} modal={{
                            title: "Danse à l'opéra",
                            content: "J'ai élaboré une affiche pour l'événement \"2024 Danse à l'Opéra\" pour le lycée Dumont d'Urville. Cette année, l'événement s'est inspiré des Jeux Olympiques, associant des éléments modernes à des références emblématiques de l'Antiquité. L’étudiant a opté pour un design équilibré mettant en avant le titre de l'événement ainsi que les détails essentiels tels que la date, l'heure et le lieu. Des visuels dynamiques, tels que des danseurs en mouvement, apportent du dynamisme à l'affiche.",
                            image: "/images/realisations/affiche-dao-1.png"
                        }}/>
                        <BoutiqueObjet top={18} left={35} width={5} height={14} modal={{
                            title: "Affiche ASKIP",
                            content: "Cette affiche a été créée par des étudiants de première année dans le cadre d’une SAE. Les étudiants ont été répartis en différentes agences fictives, chacune chargée d'organiser un événement spécifique. Pour ce groupe, l'événement était une vente aux enchères de NFT au sein de l'université. Les étudiants ont également conçu un site internet, un logo et divers supports de communication, tant imprimés que numériques.",
                            image: "/images/realisations/affiche-askip.png"
                        }}/>
                        <BoutiqueObjet top={16} left={40} width={5} height={14} modal={{
                            title: "Affiche Port Cros",
                            content: "Cette affiche a été réalisée par un étudiant en troisième année de parcours création numérique dans le cadre d'une SAE. L'objectif du projet était de mettre en avant la faune et la flore du parc national de Port Cros. Les étudiants ont également conçu un web documentaire interactif, incluant une visite à 360° du lieu et des fonds marins, ainsi que des interviews de personnes travaillant dans le parc national.",
                            image: "/images/realisations/affiche-port-cros.png"
                        }}/>
                        <BoutiqueObjet top={14} left={46} width={6} height={16} modal={{
                            title: "Danse à l'opéra 2",
                            content: "J'ai conçu une affiche pour le lycée Dumont d'Urville pour l'événement \"2024 Danse à l'Opéra\". Cette année, l'événement s'inspire des Jeux Olympiques en mêlant des éléments modernes à des références emblématiques de l'Antiquité. Mon design met l'accent sur le titre de l'événement ainsi que sur les informations essentielles telles que la date, l'heure et le lieu, dans une mise en page équilibrée. Des images dynamiques, représentant des danseurs en mouvement, ajoutent de l'énergie à l'affiche.",
                            image: "/images/realisations/affiche-dao-2.jpg"
                        }}/>
                        <BoutiqueObjet top={0} left={56} width={10} height={17} modal={{
                            title: "Apple",
                            content: "Un étudiant en troisième année de MMI, spécialisé en création numérique, a créé une campagne publicitaire décalée pour Apple, rompant avec le style habituel de la marque. L’étudiant a conçu deux affiches humoristiques, dont l'une légèrement provocatrice, mettant en avant l'élégance de la marque tout en y ajoutant une touche d'humour. Cette approche audacieuse vise à susciter l'intérêt et à engager le spectateur d'une manière nouvelle et inattendue, explorant de nouveaux horizons créatifs tout en restant fidèle à l'essence même d'Apple.",
                            image: "/images/realisations/affiche-apple.png"
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
                                    if (await addScoreToSkill(session, "development", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                    if (await addScoreToSkill(session, "development", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                    if (await addScoreToSkill(session, "creativity", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                    if (await addScoreToSkill(session, "creativity", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                            modalImage={"/images/epreuve_com/epreuve_com_img1.jpeg"}
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
                                    if (await addScoreToSkill(session, "marketing", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                    if (await addScoreToSkill(session, "marketing", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                        <img src={'/images/taverne.png'} alt="background" className="background"/>

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

                        <BoutiqueObjet
                            top={40}
                            left={40}
                            width={30}
                            height={30}
                            modal={{
                                title: "Lézard 3D",
                                content: "Ce lézard est inspiré d’une création 3D réalisée par une étudiante en deuxième année de parcours création numérique. Le projet, mené en collaboration avec le Lycée Dumont d'Urville, consistait à créer un environnement inspiré du film « Au centre de la Terre ». La grotte en 3D et le lézard ont été projetés en arrière-plan lors du spectacle de fin d’année des danseurs du lycée.",
                                image: "/images/realisations/lezard-real.png"
                            }}
                        />

                        <Dialog open={true}
                                content={"Et comme rien ne se passe jamais comme prévu, un lézard vous bloque l’entrée à la foret ! Il n’a pas l’air sauvage mais n’a pas l’air bienveillant non plus... Vous avez vraiment besoin d’aller dans cette foret !"}
                                showClose={true} showValidate={true}
                                onClose={() => {
                                    setSceneNumber("3.1.1")
                                    playSound("/sounds/voice-death-lezard.wav", false);
                                }}
                                onValidate={async () => {
                                    if (await addScoreToSkill(session, "marketing", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                            if (await addScoreToSkill(session, "marketing", 10, (p) => {
                                                dispatch(updateScore(p))
                                            })) {
                                                setSceneNumber("3.2.3")
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }
                                    },
                                    {
                                        text: "Ta main dominante",
                                        onClick: async () => {
                                            if (await addScoreToSkill(session, "creativity", 10, (p) => {
                                                dispatch(updateScore(p))
                                            })) {
                                                setSceneNumber("3.2.2")
                                            } else {
                                                alert("Une erreur est survenue. Veuillez réessayer.");
                                            }
                                        }
                                    },
                                    {
                                        text: "Ta mémoire",
                                        onClick: async () => {
                                            if (await addScoreToSkill(session, "development", 10, (p) => {
                                                dispatch(updateScore(p))
                                            })) {
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
                                if (await addScoreToSkill(session, "development", 20, (p) => {
                                    dispatch(updateScore(p))
                                })) {
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
                                    if (await addScoreToSkill(session, "creativity", 20, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                    if (await addScoreToSkill(session, "marketing", 10, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                title: "Logo PROV'ANSE",
                                content: "La conception de ce logo a été réalisée en septembre 2023 dans le cadre d’un projet fictif pour mon cours de marketing. L’objectif était de concevoir une marque locale de vêtements tout en intégrant ses objectifs marketing. Nous avons choisi de créer des t-shirts mettant en avant les villes de la région PACA. Ainsi, nous avons nommé notre marque « Prov’anse », pour mettre en avant la Provence et son lien avec la Méditerranée.",
                                image: "/images/realisations/provanse.png"
                            }}
                        />

                        <BoutiqueObjet
                            top={11}
                            left={32}
                            width={10}
                            height={10}
                            modal={{
                                title: "Site Livraison nourriture",
                                content: "Ces maquettes de sites UX ont été réalisées par des étudiants en deuxième année de MMI. Le projet consistait à développer un site fonctionnel permettant de personnaliser sa commande et certains aliments.",
                                image: "/images/realisations/sites-nourriture.png"
                            }}
                        />

                        <BoutiqueObjet
                            top={40}
                            left={25}
                            width={10}
                            height={23}
                            modal={{
                                title: "GROTTE 3D",
                                content: "Cette grotte a été modélisée en 3D par des étudiants en deuxième année, parcours création numérique. Le projet consistait à créer un environnement inspiré du film « Au centre de la Terre ». La grotte en 3D a été projetée en arrière-plan lors du spectacle de fin d’année des danseurs du Lycée Dumont d’Urville.",
                                video: "/images/realisations/video-grotte.mp4"
                            }}
                        />

                        <BoutiqueObjet
                            top={50}
                            left={55}
                            width={45}
                            height={40}
                            modal={{
                                title: "Visite virtuelle sous-marine",
                                content: "Cette visite virtuelle sous-marine de Port-Cros a été réalisée par deux étudiants en troisième année de MMI, parcours création numérique, lors d’un projet visant à découvrir le parc naturel et sensibiliser à la préservation de l’environnement.",
                                image: "/images/realisations/vr-lac.png"
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
                                onValidate={() => setSceneNumber("4.1.1")}
                                validateText={"Choisir un autre chemin"}
                                enigme={{
                                    type: "text",
                                    answer: "avance",
                                    onValidate: async (answer) => {
                                        if (answer.toLowerCase() === "avance" || answer.toLowerCase() === "j'avance" || answer.toLowerCase() === "avancer") {
                                            if (await addScoreToSkill(session, "marketing", 10, (p) => {
                                                dispatch(updateScore(p))
                                            })) {
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
                                onValidate={() => setSceneNumber("4.5")}
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
                                    if (await addScoreToSkill(session, "development", 30, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
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
                                content={"Une porte vous barre la route...Vous apercevez une affiche déchiré sur la porte..."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("5.0")}
                                validateText={"Casser la porte"}
                        />

                        <LocationCTA
                            top={30}
                            left={30}
                            width={40}
                            height={40}
                            onClick={() => setSceneNumber("4.5.1")}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.5.1" && (
                // PORTE DE SORTIE
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/exit-village.webp" className={"background"} alt="village"/>

                        <Enigme
                            text={"Quel est le mot de passe pour ouvrir la porte ?"}
                            type={"puzzle"}
                            puzzleImages={{
                                original: "/images/epreuve_crea/epreuve_crea3-main.png",
                                pieces: [
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea3-P1.jpg",
                                        answer: "incorrect"
                                    },
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea3-P2.jpg",
                                        answer: "incorrect"
                                    },
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea3-P3.jpg",
                                        answer: "incorrect"
                                    },
                                    {
                                        url: "/images/epreuve_crea/epreuve_crea3-P4.jpg",
                                        answer: "correct"
                                    }]
                            }}
                            puzzleDragZone={{
                                top: 40,
                                left: 79,
                                width: 15,
                                height: 50
                            }}
                            onValidate={async (answer) => {
                                if (answer.toLowerCase() === "correct") {
                                    if (await addScoreToSkill(session, "creativity", 30, (p) => {
                                        dispatch(updateScore(p))
                                    })) {
                                        setSceneNumber("5.0")
                                    } else {
                                        alert("Une erreur est survenue. Veuillez réessayer.");
                                    }
                                } else {
                                    setSceneNumber("4.5.1.1")
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "4.5.1.1" && (
                // PORTE DE SORTIE
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/exit-village.webp" className={"background"} alt="village"/>

                        <Dialog open={true}
                                content={"ARG ! Mauvaise réponse. Vous avez une autre chance."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("4.5.1")}
                                validateText={"Réessayer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "5.0" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/mountain.mp4" className={"background"} autoPlay={true} muted={false}/>

                        <LocationCTA
                            top={60}
                            left={45}
                            width={10}
                            height={10}
                            onClick={() => {
                                setSceneNumber("5.1")
                            }}
                            debug={true}
                        />

                        <BoutiqueObjet
                            top={12}
                            left={38}
                            width={20}
                            height={40}
                            modal={{
                                title: "Low Poly",
                                content: "Ce low poly a été réalisé par un étudiant en première année. Le projet avait pour but d'apprendre aux étudiants à utiliser Illustrator. Ils devaient se représenter en utilisant de nombreux triangles. Le low poly devait reproduire au mieux l’image choisie au départ.",
                                image: "/images/realisations/lowpoly.png",
                                orientation: "column"
                            }}
                        />
                        <BoutiqueObjet
                            top={46}
                            left={24}
                            width={15}
                            height={20}
                            modal={{
                                title: "Court-métrage",
                                content: "Dans le cadre d'un projet universitaire, nous avons dû réaliser un court métrage sur le thème du feu. Notre film, intitulé \"Le Grand Froid\", suit l'histoire de Bruno, un jeune aventurier pris au piège dans une tempête de neige. Malgré les obstacles logistiques et météorologiques, nous avons su filmer, monter et produire ce court métrage, démontrant ainsi notre passion et notre compétence dans le domaine de l'audiovisuel.",
                                image: "/images/realisations/grand-froid.jpg",
                                orientation: "column"
                            }}
                        />

                        <Dialog open={true}
                                content={"Vous êtes au pied de la montagne, a quelques heures de votre but. La pause est terminée, où allez vous ? "}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "5.1" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/mountain-collapse.mp4" className={"background"} autoPlay={true}
                               muted={false}/>


                        <div className="counter">
                            <h2>{mountainCount}</h2>
                        </div>

                        <LocationCTA
                            // dev
                            top={60}
                            left={45}
                            width={13}
                            height={15}
                            onClick={async () => {
                                if (await addScoreToSkill(session, "development", 20, (p) => {
                                    dispatch(updateScore(p))
                                })) {
                                    setSceneNumber("5.2.1")
                                } else {
                                    alert("Une erreur est survenue. Veuillez réessayer.");
                                }
                            }}
                            debug={true}
                        />

                        <LocationCTA
                            // crea
                            top={40}
                            left={60}
                            width={13}
                            height={15}
                            onClick={async () => {
                                console.log("CREA")
                                if (await addScoreToSkill(session, "creativity", 20, (p) => {
                                    dispatch(updateScore(p))
                                })) {
                                    setSceneNumber("5.2.1")
                                } else {
                                    alert("Une erreur est survenue. Veuillez réessayer.");
                                }
                            }}
                            debug={true}
                        />

                        <LocationCTA
                            // com
                            top={60}
                            left={20}
                            width={13}
                            height={15}
                            onClick={async () => {
                                if (await addScoreToSkill(session, "marketing", 20, (p) => {
                                    dispatch(updateScore(p))
                                })) {
                                    setSceneNumber("5.2.2")
                                } else {
                                    alert("Une erreur est survenue. Veuillez réessayer.");
                                }
                            }}
                            debug={true}
                        />

                        <Dialog open={true}
                                content={"Trouvez un moyen de traverser la montagne effondrée."}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "5.2.1" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/mountain-exit-1.mp4" className={"background"} autoPlay={true}
                               muted={false}/>

                        <Dialog open={true}
                                content={"Vous avez réussi a éviter les gros rochers qui menaçaient vôtre vie. Vous faite maintenant route vers le sommet."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("6.0")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "5.2.2" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/mountain-exit-2.mp4" className={"background"} autoPlay={true}
                               muted={false}/>

                        <Dialog open={true}
                                content={"Vous aviez abandonné, pensant que tout était perdu. Une créature  colossale est venue à votre secours. Cette créature vous semble-t-elle  familière ? Si ce n’est pas le cas, peut-être n’êtes-vous qu’un lâche...  Vous faites maintenant route vers le sommet."}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("6.0")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "6.0" && (
                <div className="scene">
                    <div className="boutique">
                        <video src="/videos/forge.mp4" className={"background"} autoPlay={true}
                               muted={false}/>

                        <Dialog open={true}
                                content={"Apres votre longue aventure, vous arrivez enfin a la forge de l’Aube. Elle est magnifique et scintillante, peut-être comme votre parcours ?"}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("6.1")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "6.1" && (
                <div className="scene">
                    <div className="boutique">
                        <img src="/images/blacksmith.webp" className={"background"} alt="forge"/>

                        <Dialog open={true}
                                content={"Il est maintenant temps pour vous d’utiliser toute votre expériences et vos aventures !"}
                                showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber("7.0")}
                                validateText={"Continuer"}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === "7.0" && (
                <div className="scene release">
                    <div className="boutique">
                        <img src="/images/crystal-hand.png" className={"background"} alt="artefact"/>

                        <div className={"artefact"}>
                            <img src="/images/artefact/base.png" alt="artefact"
                            style={{filter: `hue-rotate(${hsl[0]}deg) saturate(${hsl[1]}%) brightness(100%)`}}/>
                        </div>

                        <Dialog open={true}
                                content={"Vous avez réussi à forger votre Artefact Magique. Il est unique et vous permettra de réaliser vos rêves les plus fous. Félicitations !"}
                                showClose={false} showValidate={true}
                                onValidate={() => {
                                    stopAllAudio()
                                    navigate("/")
                                }}
                                validateText={"Terminer l'aventure"}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default GameManager;
