// Socket.ts
import {io} from "socket.io-client";

const currentURL = window.location.hostname;
const currentProtocol = window.location.protocol;

const URL = import.meta.env.VITE_API_URL || `${currentProtocol}//${currentURL}`;

console.log("Connecting to the server at", URL);

const socket = io(URL.split("/api")[0], {
    path: "/api/socket.io",
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
});

export {
    socket,
    URL,
}