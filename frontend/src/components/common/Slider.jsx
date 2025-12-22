import { Swiper } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './css/Slider.css';

const Slider = ({
  children,
  slidesPerView = 4,
  spaceBetween = 20,
  loop = true,
  autoplay = true,
  navigation = true,
  pagination = false,
  breakpoints = {},
  style = {},
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      loop={loop}
      centeredSlides={false}
      autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      speed={800}
      style={{
        padding: '20px 10px 40px 10px',
        width: '100%',
        borderRadius: '20px',
        ...style,
      }}
      breakpoints={breakpoints}
    >
      {children}
    </Swiper>
  );
};

export default Slider;
