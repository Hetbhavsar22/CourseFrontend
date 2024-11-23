import Carousel from "react-bootstrap/Carousel";

const BannerSlider = () => {
  return (
    <Carousel
      data-bs-theme="dark"
      interval={3000}
      pause="hover"
      className="mt-2 border-rr"
    >
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/banner-3.jpg"
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/banner2.webp"
          alt="Second slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/banner1.webp"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default BannerSlider;
