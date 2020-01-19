import React from "react";
import { TextField, Container, Button, Radio, RadioGroup, FormControlLabel, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import API from "./utils/API";
import SaveIcon from "@material-ui/icons/Save";
import VideoCard from "./components/Card";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      format: "mp4",
      showThumbnail: false,
      title: "",
      thumbnailSrc: "",
      error: false,
      errorText: "",
      isValid: false,
      relatedVideos: [],
      showNotification: true
    }
  }
  getFormatFromStorage = () => {
    const format = localStorage.getItem("format") || "mp4";
    this.setState({ format });
  }
  setFormatFromStorage = (format) => localStorage.setItem("format", format);
  getNotificationFromStorage = () => {
    const showNotification = localStorage.getItem("showNotification") || true;
    const show = showNotification === "true" ? true : false;
    this.setState({ showNotification: show });
  }
  setNotificationFromStorage = (show) => localStorage.setItem("showNotification", `${show}`);
  isYouTubeUrl = (url) => {
    const ytRegex = new RegExp(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/);
    return ytRegex.test(url);
  }
  handleUrlChange = (event) => {
    const url = event.target.value;
    this.setState({ url, isValid: this.isYouTubeUrl(url) });
  }
  handleFormatChange = (event) => {
    const format = event.target.value;
    this.setState({ format }, this.setFormatFromStorage(format));
  }
  getVideoInfo = async () => {
    const { url } = this.state;
    try {
      const res = await API.post("/metainfo", { url });
      const { data } = res;
      const { title, related_videos } = data;
      this.setState({ title, thumbnailSrc: this.getThumbnail(data), relatedVideos: related_videos, showThumbnail: true });
      console.log("res ", res);
    } catch (error) {
      console.warn(error);
    }
  }
  getThumbnail = (res) => {
    const { thumbnail } = res.player_response.videoDetails;
    const { thumbnails } = thumbnail;
    const { url = "" } = thumbnails[3] || thumbnails[0];
    return url;
  }
  downloadVideo = () => {
    this.getVideoInfo();
    const { url, format } = this.state;
    const host = window.location.hostname === "localhost" ? "localhost:4000" : window.location.hostname;
    window.open(`http://${host}/watch?v=${url}&format=${format}`);
    this.resetUrl();
    this.setNotificationFromStorage(false);
    // const res = await API.get(`/download?watch=https://www.youtube.com/watch?v=_hbnMgHgZfs&format=mp4`);
    // const res = await API.post("/download", { url: "https://www.youtube.com/watch?v=_hbnMgHgZfs" });
  }
  resetUrl = () => setTimeout(() => this.setState({ url: "", isValid: false }), 1000);
  addEnterEvent = () => document.addEventListener("keydown", this.enterEvent);
  removeEnterEvent = () => document.removeEventListener("keydown", this.enterEvent);
  enterEvent = (event) => {
    const { isValid } = this.state;
    if (event.key === "Enter" && isValid) {
      event.preventDefault();
      this.downloadVideo();
      this.resetUrl();
    }
  }
  componentDidMount = () => {
    this.addEnterEvent();
    this.getFormatFromStorage();
    this.getNotificationFromStorage();
  }
  componentWillUnmount = () => this.removeEnterEvent();
  render() {
    const { format, url, showThumbnail, title, thumbnailSrc, isValid, relatedVideos, showNotification } = this.state;
    return (
      <Container>
        <Typography gutterBottom variant="h4">
          Download YouTube videos
        </Typography>
        <Typography gutterBottom variant="h5">
          The best, free and most efficient YouTube downloader on the market.
        </Typography>
        <TextField label="YouTube Link" name="url" fullWidth onChange={this.handleUrlChange} value={url} required margin="dense" autoFocus />
        <Typography gutterBottom variant="h5">
          Pick a format
        </Typography>
        <div className="center">
          <RadioGroup aria-label="position" name="format" value={format} onChange={this.handleFormatChange} row>
            <FormControlLabel
              value="mp4"
              control={<Radio color="primary" id="mp4" />}
              label="mp4"
              labelPlacement="end"
              htmlFor="mp4"
            />
            <FormControlLabel
              value="mp3"
              control={<Radio color="primary" id="mp3" />}
              label="mp3"
              labelPlacement="end"
              htmlFor="mp3"
            />
            <FormControlLabel
              value="mov"
              control={<Radio color="primary" id="mov" />}
              label="mov"
              labelPlacement="end"
              htmlFor="mov"
            />
            <FormControlLabel
              value="flv"
              control={<Radio color="primary" id="flv" />}
              label="flv"
              labelPlacement="end"
              htmlFor="flv"
            />
          </RadioGroup>
        </div>
        <Button variant="contained" color="primary" fullWidth onClick={this.downloadVideo} startIcon={<SaveIcon />} disabled={!isValid}>Download</Button>
        {showNotification && <Alert severity="info" style={{ marginTop: 35, fontWeight: "100" }}><p>Change <strong>www.youtube.com/watch?v=tERRFWuYG48</strong> to www.youtub<strong>dl</strong>e.com/watch?v=tERRFWuYG48 to directly download the video!</p></Alert>}
        {showThumbnail && (
          <div>
            <h5>{title}</h5>
            <img src={thumbnailSrc} alt={title} />
          </div>
        )}
        {!!relatedVideos.length &&
          <Typography gutterBottom variant="h4" style={{ marginTop: 100 }}>
            Related videos
        </Typography>}
        {relatedVideos.map(video => (
          <React.Fragment key={video.id}>
            <VideoCard {...video} />
          </React.Fragment>
        ))}
      </Container>
    );
  }
}

export default App;
