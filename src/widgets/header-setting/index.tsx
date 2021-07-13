import { defineComponent, reactive, Teleport } from "vue";
import { useRouter } from "vue-router";
import "./index.scss";

interface SettingData { }

export type Setting = {
  title: string;
};

export default defineComponent({
  name: "Setting",
  data() {
    const data: SettingData = {};
    return data;
  },

  setup(props, context) {
    const router = useRouter();

    const setting = reactive<Setting>({
      title: "设置",
    });

    const clickSetting = () => {
      router.push("/setting");
    };

    return () => {
      return (
        <section class="yplayer-header-setting" onClick={clickSetting}>
          <span class="header-setting-text">设置</span>
          <i class="iconfont icon-shezhi" title={setting.title}></i>
          <Teleport to="#Yuan-Player">
            <section class="setting-box">
              <h6>播放器设置</h6>
              <p></p>
              <div>
                <button>取消</button>
                <button>确定</button>
              </div>
            </section>
          </Teleport>
        </section>
      );
    };
  },
});
