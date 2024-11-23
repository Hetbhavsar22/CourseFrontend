import React, { useState } from 'react';
import ItemsCarousel from 'react-items-carousel';
// import 'react-items-carousel/lib/styles.css';

const CourseListCarousel = ({ items }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  return (
    <div className="carousel">
      <ItemsCarousel
        infiniteLoop
        activeItemIndex={activeItemIndex}
        onRequestChange={setActiveItemIndex}
        numberOfCards={4} // Adjust according to your needs
        gutter={10}
        chevronWidth={40}
      >
        {items.map((item, index) => (
          <div className="carousel-item" key={index}>
            <div className="card">
              <img src={item.image} className="card-img-top" alt={item.title} />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">Duration: {item.duration}</p>
                <p className="card-text">Videos: {item.videos}</p>
                <button className="btn btn-primary">Buy Now</button>
                <button className="btn btn-secondary">Wishlist</button>
              </div>
            </div>
          </div>
        ))}
      </ItemsCarousel>
      <div className="carousel-dots">
        {items.map((_, index) => (
          <div
            key={index}
            className={`carousel-dot ${index === activeItemIndex ? 'active' : ''}`}
            onClick={() => setActiveItemIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseListCarousel;
