import React, { useEffect } from "react";

const AdComponent = ({
  client = "ca-pub-5088609724391307",
  slot = "YOUR-AD-SLOT-ID",
  format = "auto",
  style = {},
  className = "",
}) => {
  useEffect(() => {
    try {
      // Push ads only if adsbygoogle is loaded
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
