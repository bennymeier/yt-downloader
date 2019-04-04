const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.listen(4000, () => {
    console.log("Server is running...");
});
app.get("/download", async (req, res) => {
    let videoURL = req.query.URL;
    let title = "";
    console.log("URL: ", videoURL);
    try {
        title = await promiseTitle(videoURL);
        title = title.replace(/[^a-zA-Z0-9-äöü ]/g, " ");
    } catch (err) {
        throw err;
    }
    app.locals = "Test";
    console.log("Titel: ", title);
    res.header('Content-disposition', 'attachment; filename=' + title + '.mp4');
    ytdl(videoURL, {
        format: "mp4",
    }).pipe(res);
    res.render("index.html", { info: "Test" });
});

app.get('/test', (req, res) => {
    res.json({ title: "api", message: "root" });
})

const promiseTitle = (videoURL) => {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(videoURL, (err, info) => {
            if (err) reject(err);
            resolve(info.title);
        });
    });
}