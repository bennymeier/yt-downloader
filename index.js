const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
const port = process.env.PORT || 4000;
const io = require("socket.io")();
let isSocketOpened = false;
io.on('connection', () => {
    console.log("opened socket");
    isSocketOpened = true;
});
io.on("disconnect", () => {
    console.log("closed socket")
    isSocketOpened = false;
})
// Now make our new WS server listen to port 5000
io.listen(3030, () => {
    console.log('Listening ... 🚀 ')
})

app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/metainfo", async (req, res) => {
    const { url } = req.body;
    try {
        const result = await ytdl.getBasicInfo(url);
        res.send({ ...result });
    } catch (error) {
        res.send(error.message).status(500);
        throw error;
    }
});

app.get("/watch", async (req, res) => {
    const { v: url, format: f = "mp4" } = req.query;
    const formats = ["mp4", "mp3", "mov", "flv"];
    let format = f;
    if (formats.includes(f)) {
        format = f;
    } else {
        format = "mp4";
    }
    try {
        const result = await ytdl.getBasicInfo(url);
        const title = result.title.replace(/[^a-zA-Z0-9-äöü ]/g, " ");
        res.header('Content-disposition', 'attachment; filename=' + title + "." + format);
        ytdl(url, { format })
            .on("progress", (chunkLength, downloaded, total) => {
                const download = (downloaded / 1024 / 1024).toFixed(2);
                const tot = (total / 1024 / 1024).toFixed(2);
                console.log(`${download}MB of ${tot}MB\n`);
                if (isSocketOpened) {
                    io.emit("download", JSON.stringify({ download: download, total: tot }));
                }
            })
            .pipe(res)
            .on("finish", () => {
                console.log("FINISHED!");
            });
    } catch (err) {
        res.redirect(`http://${req.headers.host}?error=1`)
    }
});