import React, { useEffect } from "react";

function PodcastWrapper({ IFrameUrl }) {
  useEffect(() => {}, []);

  return (
    <iframe
      className="soundcloud-iframe"
      title="soundcloud-iframe"
      width="100%"
      height="300"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={IFrameUrl}
    />
  );
}
export default PodcastWrapper;
