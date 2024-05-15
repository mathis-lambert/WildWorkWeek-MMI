// Socket.ts
import {io} from "socket.io-client";

const currentURL = window.location.hostname;
const currentProtocol = window.location.protocol;

const URL = import.meta.env.VITE_API_URL || `${currentProtocol}//${currentURL}`;

console.log(import.meta.env.VITE_API_URL);
console.log("URL", URL);

const socket = io(URL, {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
});

export {
    socket,
    URL,
}