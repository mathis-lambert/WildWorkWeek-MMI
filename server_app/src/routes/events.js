
const SocketApp = (io) => {
    /**
     * Cette fonction initialise les événements de connexion et de déconnexion
     * pour le serveur de socket.
     *
     * @param {SocketIO.Server} io - Serveur de socket
     * @param {import("mongoose").Connection} db - Connexion à la base de données
     *
     * @returns {void}
     */

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};

module.exports = SocketApp;
