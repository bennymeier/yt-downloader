const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.listen(4000, () => {
    console.log("Server is running...");
});

app.get("/meta", async (req, res) => {
    let videoURL = req.query.URL;
    try {
        let info = await promiseInfo(videoURL);
        console.log("META: ", info);
        // TODO: send meta infos back to index.html
        res.json({ info });
    } catch (err) {
        throw err;
    }
});

app.get("/download", async (req, res) => {
    let videoURL = req.query.URL;
    let info;
    let title;
    console.log("URL: ", videoURL);
    try {
        info = await promiseInfo(videoURL);
        title = info.title.replace(/[^a-zA-Z0-9-äöü ]/g, " ");
    } catch (err) {
        throw err;
    }
    console.log("Titel: ", title);
    res.header('Content-disposition', 'attachment; filename=' + title + '.mp4');
    ytdl(videoURL, {
        format: "mp4",
    }).pipe(res);
});
app.get('/test', (req, res) => {
    res.json({ info: "Test" });
})

const promiseInfo = (videoURL) => {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(videoURL, (err, info) => {
            if (err) reject(err);
            resolve(info);
        });
    });
}