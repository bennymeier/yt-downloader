const convertBtn = document.querySelector(".convert-button");
const URLinput = document.querySelector(".URL-input");
convertBtn.addEventListener("click", () => {
    sendURL(URLinput.value);
});
const sendURL = (URL) => {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
};
const metaBtn = document.querySelector(".meta-button");
const metaValue = document.getElementById("meta-input");
metaBtn.addEventListener("click", () => fetchMetaInfo(metaValue.value));
const fetchMetaInfo = (videoURL) => {
    fetch("/metainfo", {
        method: "POST", headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ videoURL })
    })
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error("Request failed.");
        })
        .then((metainfo) => {
            const metaTitle = document.getElementById("meta-title");
            metaTitle.innerHTML = metainfo.title;
            const metaThumbnail = document.getElementById("meta-thumbnail");
            metaThumbnail.src = metainfo.thumbnail_url;
            console.log("data: ", metainfo);
        })
        .catch((error) => {
            console.log(error);
        });
};