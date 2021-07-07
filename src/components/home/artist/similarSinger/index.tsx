import { shallowReactive, computed, onActivated, defineComponent } from "vue";
import { useRouter, useRoute, useLink } from "vue-router";

import { artistSimilar } from "@api/singer";

import ArtistList from "@/widgets/artist-list";
import { SingerInfo } from "@/types/singer";
import "./index.scss";
import { freeze } from "@/utils/constant";

export default defineComponent({
  name: "ArtistSimilar",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();

    const information = shallowReactive<{
      similarSingers: SingerInfo[];
    }>({
      similarSingers: [],
    });

    const getSimilarArtists = async () => {
      const id = route.query.id as string;
      const { data = {} } = await artistSimilar({ id });
      const { artists = [] } = data;
      information.similarSingers = freeze(artists);
    };

    onActivated(() => {
      getSimilarArtists();
    });

    return () => {
      return (
        <section class="yplayer-similar-singer">
          <ArtistList
            singerList={information.similarSingers} 
            cols={9}
          ></ArtistList>
        </section>
      );
    };
  },
});
