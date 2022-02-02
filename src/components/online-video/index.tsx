import { defineComponent } from "vue";
import CommonRouterList, { RouteListProp } from "@/widgets/common-router-list";
import "./index.scss";
import { renderKeepAliveRouterView } from "@/widgets/common-renderer";

const videoPageRouteList: RouteListProp = [
  { text: '全部', to: 'all' },
  { text: '分类', to: 'category' },
]

export default defineComponent({
  name: "OnlineVideo",
  setup(props, context) {

    return () => {
      return <section class="online-video">
        <h2>
          视频
        </h2>
        <div sticky-list>
          <CommonRouterList routelist={videoPageRouteList}></CommonRouterList>
        </div>
        {
          renderKeepAliveRouterView()
        }
      </section>;
    };
  },
});
