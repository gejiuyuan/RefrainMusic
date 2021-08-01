import {
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  readonly,
  ref,
} from "vue";
import "./index.scss";
import YuanTable, { YuanTableColumn } from "@/widgets/song-table/yuan-table";

export default defineComponent({
  name: "Setting",
  setup(props, context) {
    return () => {
      return <section class="yplayer-setting-page">



      </section>;
    };
  },
});
