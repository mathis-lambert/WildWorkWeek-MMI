const playSound = (sound: string, loop: boolean) => {
    const audio = new Audio(sound);
    if (loop) {
        audio.loop = true;
    }
    audio.play();

    return audio;
}


export default playSound;