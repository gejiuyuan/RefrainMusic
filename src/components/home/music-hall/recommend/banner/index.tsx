import { defineComponent, PropType, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { padPicCrop } from "@/utils";
import "./index.scss";

export default defineComponent({
  name: "RecommentBanner",
  props: {
    bannerList: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props, { slots, emit }) {
    const bannerList = props.bannerList;
    return () => {
      return (
        <section class="recommend-banner">
          <Swiper
            class="banner-swiper"
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={false}
            slidesPerView="auto"
            updateOnWindowResize={true}
            autoHeight={true}
            lazy={true}
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
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="prev-button">
              <i className="el-icon-arrow-left"></i>
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
