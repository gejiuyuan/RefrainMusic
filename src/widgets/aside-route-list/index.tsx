import { EMPTY_OBJ, getHrefWithoutOrigin, is, isLooseEqual } from "@/utils";
import { customRef, defineComponent, markRaw, onMounted, readonly, ref, triggerRef, unref } from "vue";
import { RouterLink, useLink, stringifyQuery, LocationQueryRaw, useRoute, routerKey, useRouter, viewDepthKey, routeLocationKey, matchedRouteKey } from "vue-router";
import "./index.scss";

export default defineComponent({
  name: "asideRouterList",
  props: {
    title: {
      type: String,
      default: "",
      required: false,
    },
    list: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup(props, context) {
    return () => {
      const { title, list } = props;
      const router = useRouter();
      const getRouteLinkClasses = (isActive: boolean) =>
        [isActive && "active-online-link", "yuan-list-item"]
          .filter(Boolean)
          .join(" ");

      const renderRouteLists = () => {
        return list.map(({ to, text }: any) => {
          return (
            <li key={text}>
              <RouterLink
                custom
                to={to}
                v-slots={{
                  default(data: ReturnType<typeof useLink>) {
                    const { navigate, href, isActive, isExactActive, route } = data;
                    return (
                      <div
                        title={text}
                        onClick={navigate}
                        class={getRouteLinkClasses(unref(isActive))}
                        singallinedot
                      >
                        {text}
                      </div>
                    );
                  },
                }}
              ></RouterLink>
            </li>
          )
        });
      };

      if (is.emptyArray(list)) {
        return;
      }

      return (
        <section class="yuan-router-menu">
          <h5>{title}</h5>
          <ul class="yuan-router-list">{renderRouteLists()}</ul>
        </section>
      );
    };
  },
});
