import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { RecipeFormProps } from '../RecipeForm/RecipeForm';
import { Image } from 'react-bootstrap';
import { RecipeDetailsProps } from '../RecipeDisplay/RecipeDisplay';
import { RecipeDetailsInterface } from '../../Api/apiInterface';

export interface RecipeCarouselProps {
  images?: string[]
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [imagesUrls, setImagesUrls] = useState(images);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {Array.from({ length: imagesUrls? imagesUrls.length : 0 }, (_, i) => (
        <Carousel.Item>
          <Image src={imagesUrls? imagesUrls[i] : ""} fluid/>
        </Carousel.Item>

      ))}

    </Carousel>
  );
}

export default RecipeCarousel;