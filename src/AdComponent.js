import React, { useEffect, useRef } from "react";

let globalAdCounter = 0; // Unique ID for each ad instance

const AdComponent = ({
  client = "ca-pub-5088609724391307",
  slot = "YOUR-AD-SLOT-ID",
  format = "auto",
  style = {},
  className = "",
}) => {
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);
  const adId = useRef(`ad-${++globalAdCounter}`); // Unique ID for this ad instance

  useEffect(() => {
    // Prevent loading ads multiple times
    if (isAdLoaded.current) {
      console.log(`Ad ${adId.current} already loaded, skipping`);
      return;
    }

    const loadAd = () => {
      try {
        // Wait for adsbygoogle to be available
        if (!window.adsbygoogle) {
          console.log("AdSense script not loaded yet, retrying...");
          setTimeout(loadAd, 500);
          return;
        }

        // Check if the ad element exists
        if (!adRef.current) {
          console.log("Ad element not found");
          return;
        }

        const insElement = adRef.current.querySelector(".adsbygoogle");

        // Check if this specific ad element already has an ad loaded
        if (insElement && insElement.hasAttribute("data-adsbygoogle-status")) {
          console.log(`Ad ${adId.current} already has status, skipping`);
          return;
        }

        console.log(`Loading AdSense ad ${adId.current}...`);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      } catch (error) {
        console.error(`AdSense error for ad ${adId.current}:`, error);
        // Reset flag so we can retry
        isAdLoaded.current = false;
      }
    };

    // Delay ad loading to ensure DOM is ready and avoid race conditions
    const timer = setTimeout(loadAd, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - only run once per component instance

  // Reset ad loaded flag when component unmounts
  useEffect(() => {
    return () => {
      console.log(`Ad ${adId.current} component unmounting`);
      isAdLoaded.current = false;
    };
  }, []);

  return (
    <div ref={adRef} className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        key={adId.current} // Unique key to help React track this ad
      ></ins>
    </div>
  );
};

export default AdComponent;
