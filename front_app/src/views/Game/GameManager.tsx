import {useLocation} from "react-router-dom";
import {ReactNode, useEffect, useState} from "react";
import './GameManager.scss';
import useAssetLoader from "../../hooks/UseAssetLoader.tsx";
import BoutiqueObjet from "../../components/BoutiqueObjet/BoutiqueObjet.tsx";
import LocationCTA from "../../components/LocationCallToAction/LocationCTA.tsx";
import Dialog from "../../components/Dialog/Dialog.tsx";
import {useDispatch, useSelector} from "react-redux";
import {updateScore} from "../../features/session/sessionSlice.ts";
import {SessionState} from "../../types/Types.ts";

const GameManager = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [sceneNumber, setSceneNumber] = useState(0);

    const session = useSelector((state: SessionState) => state.session);
    const dispatch = useDispatch();

    const assets = [
        "/videos/intro.webm",
        "/images/page-boutique.jpg",
        "/images/objets-magiques/bague.png",
        "/images/objets-magiques/gant.png",
        "/images/objets-magiques/glasses.png",
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
            <video src="/videos/intro.webm" autoPlay={true} muted={false} onEnded={() => setSceneNumber(1)}/>
        );
        setIntroVideo(video);
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

    function addScoreToSkill(skill: string, score: number) {
        dispatch(updateScore({skill: skill, score: score}));
    }

    return (
        <>
            <div className="game-layout">
                <h1>GameLayout</h1>
                <p>Current location: {location.pathname}</p>
                <p>Current scene: {sceneNumber}</p>
                <button onClick={() => toggleFullScreen(document.getElementById("root"))}>Fullscreen</button>
                <input type="range" min={0} max={10} step={1} value={sceneNumber}
                       onChange={(e) => setSceneNumber(parseInt(e.target.value))}/>
            </div>
            {sceneNumber === 0 && (
                <div className={"scene"}>
                    {introVideo}
                </div>
            )}

            {sceneNumber === 1 && (
                <div className={"scene"}>
                    <div className="boutique">
                        <img src={assets[1]} alt="background" className="background"/>

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
                        <LocationCTA top={28} left={43} width={10} height={30} onClick={() => setSceneNumber(2)}/>
                    </div>
                </div>
            )}

            {sceneNumber === 2 && (
                <div className={"scene"}>
                    <div className="boutique second">
                        <img src={assets[1]} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le marchand :"}
                                content={"Avec votre budget, je vais pouvoir vous proposer une de ces 3 Objets Magiques. Alors ?"}
                                onClose={() => setSceneNumber(3)} showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber(3)}
                        />
                    </div>
                </div>
            )}

            {sceneNumber === 3 && (
                <div className={"scene"}>
                    <div className="boutique third">
                        <img src={assets[1]} alt="background" className="background"/>

                        <div className="cards objets-magiques">
                            <div className="card">
                                <img src={assets[2]} alt="bague"/>
                                <h3>Bague de pouvoir</h3>
                                <p>Permet de lancer des sorts</p>
                                <button onClick={() => {
                                    addScoreToSkill("creativity", 20);
                                    setSceneNumber(4);
                                }}>Choisir
                                </button>
                            </div>

                            <div className="card">
                                <img src={assets[3]} alt="gant"/>
                                <h3>Gant de l'infini</h3>
                                <p>Permet de manipuler la réalité</p>
                                <button onClick={() => {
                                    addScoreToSkill("development", 20);
                                    setSceneNumber(4);
                                }}>Choisir
                                </button>
                            </div>

                            <div className="card">
                                <img src={assets[4]} alt="lunettes"/>
                                <h3>Lunettes de vision</h3>
                                <p>Permet de voir à travers les murs</p>
                                <button onClick={() => {
                                    addScoreToSkill("marketing", 20);
                                    setSceneNumber(4);
                                }}>Choisir
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {sceneNumber === 4 && (
                <div className={"scene"}>
                    <div className="boutique fourth">
                        <img src={assets[1]} alt="background" className="background"/>

                        <Dialog open={true} title={"- Le marchand :"}
                                content={"Félicitations ! Vous avez choisi un objet magique. Vous pouvez maintenant continuer votre aventure."}
                                onClose={() => setSceneNumber(5)} showClose={false} showValidate={true}
                                onValidate={() => setSceneNumber(5)}
                        />
                    </div>
                </div>
            )}


        </>
    );
}

export default GameManager;
