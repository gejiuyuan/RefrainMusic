import { defineComponent, inject, onActivated, toRefs } from "vue";
import SongTable from "@/widgets/song-table";
import "./index.scss";

export default defineComponent({
  name: "songlistComment",
  setup(props, context) {
    const songlistInfo = inject("songlistInfo") as any;
    return () => {
      const { playlist, showIndex } = songlistInfo;
      return (
        <SongTable dataList={playlist.tracks} showIndex={true}></SongTable>
      );
    };
  },
});
