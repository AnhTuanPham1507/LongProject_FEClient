import React from "react";
import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';

const Slider = () => {

  const data = [
    "https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/w_1423,c_limit/e658a7d6-914a-4923-ae91-8751fecd5c36/nike-just-do-it.jpg",
    "https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/w_1423,c_limit/c6ce1055-9917-4fb4-b6f2-aa72ecb97007/nike-just-do-it.png",
    "https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/w_1423,c_limit/5e4a0ef7-a2c9-483a-8e5b-45d8277db19d/nike-just-do-it.jpg",
  ];
  return (
    <MDBCarousel showIndicators showControls fade>
      {
        data.map((item, index) => (
          <MDBCarouselItem
            key={index}
            className='w-500 h-500 d-block'
            itemId={index}
            src={item}
            alt='...'
          >
          </MDBCarouselItem>
        ))
      }
    </MDBCarousel>
  );
};

export default Slider;
