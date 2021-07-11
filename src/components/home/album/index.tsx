import { defineComponent, } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";

export default defineComponent({
    name: "Album",
    setup(props, context) {
        const router = useRouter();

        return () => {

            return (
                <div>album</div>
            );
        };
    },
});
