import { useState, useEffect } from 'react';

const useAssetLoader = (assets: string[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = assets.length;

    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === totalAssets) {
        setLoaded(true);
      }
    };

    assets.forEach((asset) => {
      const img = new Image();
      img.src = asset;
      img.onload = handleLoad;
      img.onerror = handleLoad; // handle error as a load to avoid infinite loading state
    });

    return () => {
      // Clean up
    };
  }, [assets]);

  return loaded;
};

export default useAssetLoader;