import { defineComponent, getCurrentInstance, nextTick, onMounted, PropType, ref, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { padPicCrop, is } from "@/utils";
import "./index.scss";

import {
  Swiper as SwiperInstance
} from 'swiper'

export default defineComponent({
  name: "RecommentBanner",
  props: {
    bannerList: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props, { slots, emit }) {

    return () => {
      const bannerList = props.bannerList;
      if (is.emptyArray(bannerList)) {
        return
      }
      return (
        <section class="recommend-banner">
          <Swiper
            class="banner-swiper"
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={false}
            slidesPerView="auto"
            updateOnWindowResize={true}
            updateOnImagesReady={true}
            autoHeight={true}
            observeParents={true}
            observer={true}
            autoplay={{
              delay: 8000,
              waitForTransition: true,
              //禁止循环播放
              disableOnInteraction: false,
            }}
            mousewheel={true}
            initialSlide={0}
            coverflowEffect={{
              rotate: 60,
              stretch: 0,
              depth: 0,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={{
              nextEl: ".next-button",
              prevEl: ".prev-button",
            }}
            pagination={{
              el: ".banner-pagination",
              clickable: true,
              bulletClass: "pagination-bullet",
              bulletActiveClass: "pagination-bullet-active",
            }}
          >
            {
              bannerList.map((item) =>
                <SwiperSlide class="recommend-banner-item" key={item.imageUrl}>
                  <img
                    loading="lazy"
                    class="recommend-banner-img"
                    src={padPicCrop(item.imageUrl, { x: 1200, y: 480 })}
                    alt=""
                  />
                  <em class="recommend-banner-title">{item.typeTitle}</em>
                </SwiperSlide>
              )
            }
            <div class="next-button">
              <i class="iconfont icon-arrowright"></i>
            </div>
            <div class="prev-button">
              <i className="iconfont icon-arrowleft"></i>
            </div>
          </Swiper>
          <section className="banner-pagination">
            {
              bannerList.map((item) =>
                <span class="pagination-bullet"></span>
              )
            }
          </section>
        </section>
      );
    };
  },
});
