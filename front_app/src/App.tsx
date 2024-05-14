import './style/App.scss'
import {socket} from "./app/socket.ts";
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./views/home/Home.tsx";
import {useSelector} from "react-redux";
import {SessionState} from "./types/Types.ts";
import Auth from "./views/auth/Auth.tsx";

function App() {
    const [loading, setLoading] = useState(true);
    const session = useSelector((state: SessionState) => state.session);

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
                    <Route path="/" element={<Home/>}/>
                </Routes>
            )}

            {!loading && !session.isSignedIn && (
                <Routes>
                    <Route path="/" element={<Auth/>}/>
                </Routes>
            )}
        </>
    );
}

export default App
