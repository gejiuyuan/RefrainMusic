import { padPicCrop } from "@/utils";
import { defineComponent, markRaw, onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SearchCloundData } from "../index";
import "./index.scss";

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
          {
            artists.map(({ picUrl, id, accountId, trans, name }) => {
              return (
                <div className="search-singer-item">
                  <img
                    loading="lazy"
                    onClick={() => toArtistDetailPage(id)}
                    src={padPicCrop(picUrl, { x: 120, y: 120 })}
                    alt=""
                  />
                  <div class="singer-info">{name}</div>
                </div>
              );
            })
          }
        </section>
      );
    };
  },
});
