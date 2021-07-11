import { defineComponent, onMounted, ref } from "vue";
import HomeCategory from "@/components/home/home-category";
import HomeHeader from "@components/home/home-header";
import HomeController from "@/components/home/player-controller";
import guoxiaoyouLogo from "@assets/img/guoxiaoyou.png";
import "./index.scss";

import { NBackTop, NGrid, NGridItem } from "naive-ui";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "Home",
  setup(props, context) {
    const logo = ref(guoxiaoyouLogo);
    return () => {
      return (
        <>
        
          <NGrid class="yplayer-homepage" cols={15}>

            <NGridItem span={2}>
              <aside class="home-aside">
                <h1 class="home-logo">
                  <img loading="lazy" src={logo.value} />
                </h1>
                <HomeCategory></HomeCategory>
              </aside>
            </NGridItem>

            <NGridItem span={13}>
              <section class="home-main">
                <header class="main-header">
                  <HomeHeader></HomeHeader>
                </header>

                <section class="main-content">
                  <div class="player-container" scrollbar="auto">
                    <RouterView></RouterView>
                  </div>
                </section>

                <footer class="main-footer">
                  <HomeController></HomeController>
                </footer>
              </section>
            </NGridItem>

          </NGrid>

          <NBackTop
            listenTo=".player-container"
            visibilityHeight={320}
            bottom={90}
            themeOverrides={{
              width: "38px",
              height: "38px",
              iconSize: "20px",

            }}
          ></NBackTop>

        </>
      );
    };
  },
});
