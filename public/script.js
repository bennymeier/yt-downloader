const fetchInfos = () => {
    let url = "http://localhost:4000/test";
    fetch(url).then(response => response.json())
        .then((result) => {
            console.log("success: ", result)
            let div = document.getElementById("video-info");
            div.innerHTML = `${result.info}`;
        })
        .catch(error => console.log("error:", error));
};
const convertBtn = document.querySelector(".convert-button");
const URLinput = document.querySelector(".URL-input");
convertBtn.addEventListener("click", () => {
    sendURL(URLinput.value);
});
fetchInfos();
const sendURL = (URL) => {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
};
const sendMetaURL = (URL) => {
    window.location.href = `http://localhost:4000/meta?URL=${URL}`;
};
const metaBtn = document.querySelector(".meta-button");
const METAinput = document.querySelector(".META-input");
metaBtn.addEventListener("click", () => {
    sendMetaURL(METAinput.value);
});