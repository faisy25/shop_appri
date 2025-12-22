import Slider from '../common/Slider';
import { SwiperSlide } from 'swiper/react';
import ProductCard from './ProductCard';

const LatestProducts = ({ products }) => {
  return (
    <Slider
      slidesPerView={4}
      spaceBetween={25}
      autoplay={true}
      navigation={true}
      pagination={true}
      breakpoints={{
        0: { slidesPerView: 1 },
        600: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      }}
    >
      {products.map((p) => (
        <SwiperSlide key={p.product_id}>
          <ProductCard product={p} />
        </SwiperSlide>
      ))}
    </Slider>
  );
};

export default LatestProducts;
