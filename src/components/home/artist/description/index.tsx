import {
  markRaw,
  getCurrentInstance,
  onActivated,
  defineComponent,
  ComponentInternalInstance,
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { artistDesc } from "@api/singer";
import "./index.scss";

export default defineComponent({
  name: "ArtistDesc",
  setup(props, context) {
    const vm = getCurrentInstance()!;
    const route = useRoute();

    const artistDescInfo = markRaw({
      briefDesc: "",
      introduction: [
        {
          ti: "",
          txt: "",
        },
      ],
    });

    onActivated(async () => {
      const { id } = route.query;
      const { briefDesc = "", introduction = [] } = await artistDesc({ id: id as string });
      artistDescInfo.briefDesc = briefDesc;
      artistDescInfo.introduction = introduction;
      vm.proxy!.$forceUpdate();
    });

    return () => {
      const { introduction, briefDesc } = artistDescInfo;
      return (
        <section class="yplayer-artist-desc">
          <section class="artist-info artist-desc">
            <h6>简介：</h6>
            <p>{briefDesc || "暂无"}</p>
          </section>
          {
            introduction.map((item, i) =>
              <div class="artist-info artist-introduction" key={item.ti}>
                <h6>{item.ti}</h6>
                <p>{item.txt}</p>
              </div>
            )
          }
        </section>
      );
    };
  },
});
