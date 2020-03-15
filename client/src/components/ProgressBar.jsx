import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3030");

const ProgressBar = () => {
  const [isSocketOpen, setSocketOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const wsOnOpen = () => {
    socket.on("connect", () => {
      setSocketOpen(true);
    });
  };
  const wsOnClose = () => {
    socket.on("disconnect", () => {
      setSocketOpen(false);
    });
  };
  const wsOnMessage = () => {
    socket.on("download", data => {
      const { download, total } = JSON.parse(data);
      const progress = 100 - Math.ceil(Math.ceil(total) / Math.ceil(download));
      if (downloadProgress !== progress) {
        setDownloadProgress(progress);
        console.log("downloadProgress ", downloadProgress);
        console.log("progress ", progress);
      }
    });

    socket.on("event", () => {
      console.log("event");
    });
  };
  useEffect(() => {
    wsOnOpen();
    if (isSocketOpen) {
      wsOnMessage();
    }
    wsOnClose();
  });

  return (
    <div className="header">
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${downloadProgress}%` }}
        ></div>
      </div>
    </div>
  );
};
export default ProgressBar;
