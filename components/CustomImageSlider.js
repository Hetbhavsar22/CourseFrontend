import React, { useState, useEffect } from 'react';

const CustomImageSlider = ({ images, autoPlay, showBullets }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images.length, autoPlay]);

  return (
    <div className="slider-container">
      <div className="slides-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`slide-image ${currentIndex === index ? 'active' : ''}`}
          />
        ))}
      </div>
      {showBullets && (
        <div className="bullets-container">
          {images.map((_, index) => (
            <div
              key={index}
              className={`bullet ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomImageSlider;
