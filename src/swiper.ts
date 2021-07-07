import "swiper/components/effect-coverflow/effect-coverflow.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/swiper.scss";

import SwiperCore, {
    EffectCoverflow,
    Pagination,
    Navigation,
    Autoplay,
    Lazy,
    Mousewheel,
} from "swiper/core";

SwiperCore.use([
    Pagination,
    EffectCoverflow,
    Navigation,
    Autoplay,
    Lazy,
    Mousewheel,
]);