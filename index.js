const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
const port = process.env.PORT || 4000;
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.listen(port, () => console.log(`Server is running on port ${port}`));
// serve the homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// get the meta info from youtube
app.post("/metainfo", async (req, res) => {
    const videoURL = req.body.videoURL;
    if (!videoURL) throw new Error("No video url!");
    try {
        let result = await promiseInfo(videoURL);
        res.send({ fail: false, ...result });
    } catch (err) {
        res.send(err.message).status(500);
        throw err;
    }
});
// download the youtube video
app.get("/download", async (req, res) => {
    let videoURL = req.query.URL;
    let videoFormat = req.query.FORMAT || "mp4";
    let info;
    try {
        info = await promiseInfo(videoURL)
            .catch((err) => {
                throw err;
            });
    } catch (err) {
        res.send(err.message).status(500);
        throw err;
    }
    const title = info.title.replace(/[^a-zA-Z0-9-äöü ]/g, " ");
    res.header('Content-disposition', 'attachment; filename=' + title + "." + videoFormat);
    ytdl(videoURL, {
        format: videoFormat,
    })
        .on("progress", (chunkLength, downloaded, total) => {
            const download = (downloaded / 1024 / 1024).toFixed(2);
            const tot = (total / 1024 / 1024).toFixed(2);
            console.log(`${download}MB of ${tot}MB\n`);
        })
        .pipe(res)
        .on("finish", () => {
            // TODO: Clear URL input field
            console.log("FINISHED!");
        });
});

const promiseInfo = (videoURL) => {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(videoURL, (err, info) => {
            if (err) {
                reject("NO VALID URL!");
            }
            resolve(info);
        });
    }).catch((err) => {
        console.log("Error 1");
    });
}