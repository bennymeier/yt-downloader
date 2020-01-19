const isLocalHost = window.location.hostname === "localhost";
export const URL = isLocalHost ? "http://localhost:4000" : "https://youtubdle.com";

export const secondsToMinutes = (time) => {
    return Math.floor(time / 60) + ':' + Math.floor(time % 60);
}