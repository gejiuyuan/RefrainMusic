import { defineComponent, onMounted } from "vue";
import {
    RouterView,
} from 'vue-router'
import './index.scss';

export default defineComponent({
    name: "HomeMain",
    setup(props, { slots, emit }) {
        return () => {
            return (
                <section class="home-main">
                    <RouterView></RouterView>
                </section>
            )
        }
    },
})