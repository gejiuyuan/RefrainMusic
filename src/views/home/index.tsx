import { defineComponent, onMounted } from "vue";
import HomeLeft from "@components/home/home-left";
import HomeContent from "@components/home/home-content";
import HomeHeader from "@components/home/home-header";
import HomeController from "@components/home/home-controller";
import "./index.scss";

import { NBackTop, NGrid, NGridItem } from "naive-ui";

export default defineComponent({
  name: "Home",
  setup(props, context) {
    return () => {
      return (
        <section class="yplayer-home">
          <NGrid class="home-layout" cols={8}>
            <NGridItem class="home-layout" span={1}>
              <HomeLeft></HomeLeft>
            </NGridItem>
            <NGridItem class="home-layout home-right" span={7}>
              <HomeHeader></HomeHeader>
              <HomeContent></HomeContent>
            </NGridItem>
          </NGrid>
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
