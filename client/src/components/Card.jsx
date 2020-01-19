import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography
} from "@material-ui/core";
import { secondsToMinutes } from "../utils/helpers";

export default props => {
  const { id, title, video_thumbnail, view_count, length_seconds } = props;
  const length = secondsToMinutes(length_seconds);
  const host =
    window.location.hostname === "localhost"
      ? "localhost:4000"
      : window.location.hostname;
  const format = localStorage.getItem("format") || "mp4";
  return (
    <Card style={{ maxWidth: 250 }}>
      <CardActionArea
        href={`https://youtube.com/watch?v=${id}`}
        target="_blank"
      >
        <CardMedia
          style={{ maxWidth: "100%", height: "auto" }}
          component="img"
          alt={title}
          image={video_thumbnail}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {title}, {length}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {view_count}, {length}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          href={`http://${host}/watch?v=${id}&format=${format}`}
          target="_blank"
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
};
