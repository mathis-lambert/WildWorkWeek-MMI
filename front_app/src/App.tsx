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
            }, 1000);

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
    }, [location]);

    return (
        <>
            {loading && (
                <div className="loading">
                    <div className="loading__spinner"/>
                    <h1 className="loading__text">Loading...</h1>
                </div>
            )
            }

            {!loading && session.isSignedIn && (
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/mmi" element={<h1>MMI</h1>}/>
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
