import { defineComponent, onMounted } from "vue";
import HomeLeft from "@components/home/home-left";
import HomeContent from "@components/home/home-content";
import HomeHeader from "@components/home/home-header";
import HomeController from "@components/home/home-controller";
import "./index.scss";

import { NBackTop } from "naive-ui";

export default defineComponent({
  name: "Home",
  setup(props, context) {
    return () => {
      return (
        <section class="yplayer-home">
          <section class="yplayer-home-main">
            <HomeLeft></HomeLeft>
            <section class="home-right">
              <HomeHeader></HomeHeader>
              <HomeContent></HomeContent>
            </section>
          </section>
          <HomeController></HomeController>
          <NBackTop
            listenTo=".home-content"
            visibilityHeight={400}
            themeOverrides={{
              width: "38px",
              height: "38px",
              iconSize: "20px",
            }}
          ></NBackTop>
        </section>
      );
    };
  },
});
