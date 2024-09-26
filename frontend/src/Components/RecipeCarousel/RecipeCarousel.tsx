import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { RecipeProps } from '../RecipeForm/RecipeForm';
import { Image } from 'react-bootstrap';

const RecipeCarousel: React.FC<RecipeProps> = ({ data }) => {
  const [index, setIndex] = useState(0);
  const imageUrls = data.images || [];

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {Array.from({ length: imageUrls.length }, (_, i) => (
        <Carousel.Item>
          <Image src={imageUrls[i]} fluid/>
        </Carousel.Item>

      ))}

    </Carousel>
  );
}

export default RecipeCarousel;