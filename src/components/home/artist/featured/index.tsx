import { shallowReactive, onActivated, defineComponent } from "vue";
import { useRouter, useRoute, useLink, LocationQueryValue } from "vue-router";
import MusicList from "@/widgets/music-list";
import { artistTopSong } from "@api/singer";
import { SongInfo } from "@/types/song";
import "./index.scss";
import { freeze } from "@/utils";

export default defineComponent({
  name: "ArtistFeatured",
  setup(props, { emit, slots }) {
    const router = useRouter();
    const route = useRoute();

    const featuredData = shallowReactive({
      hotSongs: [] as SongInfo[],
    });

    onActivated(async () => {
      const { data = {} } = await artistTopSong({
        id: route.query.id as string,
      });
      const { songs = [] } = data;
      featuredData.hotSongs = freeze(songs);
    });

    return () => (
      <section class="yplayer-artist-featured">
        <section class="featured-layer featured-songs">
          <section class="song-data">
            <MusicList musiclists={featuredData.hotSongs} cols={4}></MusicList>
          </section>
        </section>
      </section>
    );
  },
});
