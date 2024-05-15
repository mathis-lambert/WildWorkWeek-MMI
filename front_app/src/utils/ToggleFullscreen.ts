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

export default toggleFullScreen;