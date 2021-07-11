import { defineComponent, reactive, toRef } from "vue";
import { RouterView } from "vue-router";
import "./App.scss";

export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {
    return () => {
      return (
        <>
          <RouterView></RouterView> 
        </>
      );
    };
  },
});
