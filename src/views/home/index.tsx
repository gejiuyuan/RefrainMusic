import { defineComponent, onMounted, PropType, ref } from "vue";
import HomeLeft from "@/components/home-left";
import HomeHeader from "@components/home-header";
import HomeController from "@/components/player-controller";
import "./index.scss";

import PlayerQueue from "@/components/player-queue";
import { NBackTop, NGrid, NGridItem } from "naive-ui";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "Home",
  setup(props, context) {
    return () => {
      return (
        <>

          <NGrid class="yplayer-homepage" cols={15}>

            <NGridItem span={2}>
              <HomeLeft></HomeLeft>
            </NGridItem>

            <NGridItem span={13}>
              <section class="home-main">
                <header class="main-header">
                  <HomeHeader></HomeHeader>
                </header>

                <section class="main-content">
                  <div class="player-container" scrollbar="overlay">
                    <RouterView></RouterView>
                  </div>
                </section>

                <footer class="main-footer">
                  <HomeController></HomeController>
                </footer>
              </section>
            </NGridItem>

          </NGrid>

          <PlayerQueue></PlayerQueue>

        </>
      );
    };
  },
});
