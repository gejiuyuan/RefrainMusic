import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";

export default defineComponent({
  name: "PlayerController",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const showPlayerDetailPage = () => {
      const { query , path } = route;
      router.push({
        path,
        query: {
          ...query!,
          playerStatus: 1
        }
      })
    }
    return () => {
      return <section class="player-controller" onClick={showPlayerDetailPage}>controller</section>;
    };
  },
});
