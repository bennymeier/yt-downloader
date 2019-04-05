const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// get the meta info from youtube
app.post('/metainfo', async (req, res) => {
    const videoURL = req.body.videoURL;
    if (!videoURL) throw new Error("No video url!");
    try {
        let result = await promiseInfo(videoURL);
        res.send(result);
    } catch (err) {
        throw err;
    }
});

app.get("/download", async (req, res) => {
    let videoURL = req.query.URL;
    let info;
    let title;
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

const promiseInfo = (videoURL) => {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(videoURL, (err, info) => {
            if (err) reject(err);
            resolve(info);
        });
    });
}