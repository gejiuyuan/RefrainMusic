import { defineComponent, markRaw, onMounted, readonly, ref, unref } from "vue";
import { RouterLink, useLink } from "vue-router";
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

      const getRouteLinkClasses = (isActive: boolean) =>
        [isActive && "active-online-link", "yuan-list-item"]
          .filter(Boolean)
          .join(" ");

      const renderRouteLists = () => {
        return list.map((item: any) => (
          <li key={item.text}>
            <RouterLink
              custom
              to={item.to}
              v-slots={{
                default(data: ReturnType<typeof useLink>) {
                  const { navigate, isActive } = data;
                  return (
                    <div
                      onClick={navigate}
                      class={getRouteLinkClasses(unref(isActive))}
                    >
                      {item.text}
                    </div>
                  );
                },
              }}
            ></RouterLink>
          </li>
        ));
      };

      return (
        <section class="yuan-router-menu">
          <h5>{title}</h5>
          <ul class="yuan-router-list">{renderRouteLists()}</ul>
        </section>
      );
    };
  },
});
