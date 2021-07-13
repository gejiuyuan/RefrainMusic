import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";
import ProgressBar from "@/widgets/progress-bar";

export default defineComponent({
  name: "PlayerController",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const showPlayerDetailPage = () => {
      const { query, path } = route;
      router.push({
        path,
        query: {
          ...query!,
          playerStatus: 1
        }
      })
    }
    return () => {
      return (
        <section class="player-controller">
          <ProgressBar
            onDown={() => console.info('down')}
            onMove={() => console.info('move')}
            onChange={() => console.info('change')}
            onUp={() => console.info('up')}
          ></ProgressBar>

          <div onClick={showPlayerDetailPage}>
            ffffffffffff
          </div>

        </section>
      );
    };
  },
});
