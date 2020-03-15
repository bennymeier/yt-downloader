import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(`${window.location.hostname}:3030`);
let isSocketOpen = false;
let downloadStopped = false;
let alreadyActivated = false;

const ProgressBar = () => {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const wsOnOpen = () => {
    socket.on("connect", () => {
      isSocketOpen = true;
      alreadyActivated = true;
    });
  };

  const wsOnClose = () => {
    socket.on("disconnect", () => {
      isSocketOpen = false;
    });
  };

  const wsOnMessage = () => {
    // Download is still downloading
    socket.on("download", data => {
      const { download, total } = JSON.parse(data);
      setDownloadProgress(download);
    });

    // Download was cancelled
    socket.on("downloadClose", () => {
      downloadStopped = true;
      setDownloadProgress(0);
    });

    // Download is finished
    socket.on("downloadEnd", () => {
      setDownloadProgress(0);
    });
  };

  useEffect(() => {
    if (!alreadyActivated) {
      wsOnOpen();
      // if (isSocketOpen) {
      wsOnMessage();
      // }
      wsOnClose();
    }
  }, []);

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
