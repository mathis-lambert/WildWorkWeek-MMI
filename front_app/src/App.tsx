import './style/App.scss'
import {socket} from "./app/socket.ts";
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./views/home/Home.tsx";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {SessionState} from "./types/Types.ts";
import Auth from "./views/auth/Auth.tsx";
import Layout from "./components/Layout/Main/Layout.tsx";
import GameManager from "./views/Game/GameManager.tsx";
import Loader from "./components/Loader/Loader.tsx";
import MMI from "./views/MMI/MMI.tsx";

function App() {
    const [loading, setLoading] = useState(true);
    const session = useSelector((state: SessionState) => state.session);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to the server");

            const timeout = setTimeout(() => {
                setLoading(false);
            }, 300);

            return () => {
                clearTimeout(timeout);
            };
        });

        socket.on("auth", (data) => {
            console.log("Auth event received");
            console.log(data);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from the server");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    useEffect(() => {
        if (!session.isSignedIn && location.pathname !== "/") {
            navigate("/");
        }
    }, [location, navigate, session]);

    useEffect(() => {
        if (location.pathname.includes("/game")) {
            document.getElementById("root")?.classList.add("game");
        }

        // if game not in location remove all audio playing
        if (!location.pathname.includes("/game")) {
            const audio = document.querySelectorAll("audio");
            audio.forEach((a) => {
                a.pause();
            });
        }
    }, [location]);

    return (
        <>
            {loading && (
                <>
                    <Loader/>
                </>
            )}

            {!loading && session.isSignedIn && (
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/mmi" element={<MMI/>}/>
                        <Route path="/projects" element={<h1>Projets</h1>}/>
                    </Route>

                    <Route path="/game/*" element={<GameManager/>}/>
                    <Route path="*" element={<h1>404</h1>}/>

                </Routes>
            )}

            {!loading && !session.isSignedIn && (
                <Routes>
                    <Route path="/" element={<Auth/>}/>
                    <Route path="*" element={<h1>404</h1>}/>
                </Routes>
            )}
        </>
    );
}

export default App
