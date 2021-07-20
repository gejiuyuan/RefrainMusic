import usePlayerStore from "@/stores/player";
import { onClickOutside } from "@vueuse/core";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";

export default defineComponent({
    name: "PlayerQueue",
    setup(props, { slots, emit }) {
        const router = useRouter();
        const route = useRoute();

        const playerStore = usePlayerStore()

        const hidePlayerQueueHandler = () => playerStore.playerQueue.show = false;

        return () => {
            const { show } = playerStore.playerQueue;
            return (
                <section class="player-queue" slideShow={show}>
                    播放队列
                    <div onClick={hidePlayerQueueHandler}>
                        <button>
                            关闭8️⃣
                        </button>
                    </div>
                </section>
            );
        };
    },
});
