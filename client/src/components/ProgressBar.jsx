import React from "react";

export default props => {
  // Websocket hier öffnen
  const { download, total } = props;
  return <div>Download: {download}</div>;
};
