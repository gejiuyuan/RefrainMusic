import { padPicCrop } from "@/utils";
import { defineComponent, markRaw, onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SearchCloundData } from "../index";
import "./index.scss";

import ArtistList from "@/widgets/artist-list";

export default defineComponent({
  name: "SearchSinger",
  setup(props, context) {
    const router = useRouter();
    const searchData = inject<SearchCloundData>("searchCloundData")!;
    const toArtistDetailPage = (id: number) =>
      router.push({
        path: "/artist",
        query: { id },
      });

    return () => {
      const {
        singer: { artists, artistCount },
      } = searchData;
      return (
        <section class="search-singer">
          <ArtistList singerList={artists} gaps={{x: 40, y: 40}} cols={10}></ArtistList>
        </section>
      );
    };
  },
});
