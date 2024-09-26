import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';
import "./RecipeCarousel.scss";


export interface RecipeCarouselProps {
  images?: string[]
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [imagesUrls, setImagesUrls] = useState(images);

  useEffect(() => {
    setImagesUrls(images);
  }, [images])

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {Array.from({ length: imagesUrls? imagesUrls.length : 0 }, (_, i) => (
        <Carousel.Item>
          <Image className="carousel-image" src={imagesUrls? imagesUrls[i] : ""} fluid/>
        </Carousel.Item>

      ))}

    </Carousel>
  );
}

export default RecipeCarousel;