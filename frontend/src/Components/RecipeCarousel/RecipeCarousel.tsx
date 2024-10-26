import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';
import "./RecipeCarousel.scss";


export interface RecipeCarouselProps {
  images?: string[]
  defaultImageUrl?: string
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ images}) => {
  const [index, setIndex] = useState(0);
  const [imagesUrls, setImagesUrls] = useState(images);

  useEffect(() => {
    setImagesUrls(images);
  }, [images])

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  // const defaultImageIndex = imagesUrls?.findIndex((element) => element === defaultImageUrl);

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {imagesUrls?.map((imageUrl, index) => (
        <Carousel.Item key={`image-${index}`} >
          <Image className="carousel-image" src={imageUrl} fluid />
        </Carousel.Item>
      ))}

    </Carousel>
  );
}

export default RecipeCarousel;