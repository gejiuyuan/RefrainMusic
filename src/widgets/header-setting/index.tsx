import { defineComponent, h, nextTick, reactive, ref, Teleport } from "vue";
import { useRouter } from "vue-router";
import { NDropdown, NModal, useDialog } from 'naive-ui';
import { DropdownMixedOption } from "naive-ui/lib/dropdown/src/interface";
import useUserStore from "@stores/user";
import { logout } from '@api/auth';
import "./index.scss";


export type MenuOption = {
  title: string;
};

const content = {
  menu: '主菜单',
  about: '关于',
  setting: '设置',
  toggleAccount: '切换账号',
}

export default defineComponent({
  name: "MainMenu",

  setup(props, context) {
    const router = useRouter();

    const isDropDownShow = ref(false);

    const hideDropDown = () => isDropDownShow.value = false;
    const showDropDown = () => isDropDownShow.value = true;

    const userStore = useUserStore();

    const options: DropdownMixedOption[] = [
      {
        key: content.setting,
        type: 'render',
        render() {
          return <section class="menu-option">
            <div class="option-icon">
              <i class="iconfont icon-shezhi"></i>
            </div>
            <p>{content.setting}</p>
          </section>
        },
        props: {
          onClick: () => {
            router.push("/setting");
            hideDropDown();
          },
          title: content.setting
        }
      },
      {
        key: content.toggleAccount,
        type: 'render',
        render() {
          return userStore.isLogin && <section class="menu-option">
            <div class="option-icon">
            </div>
            <p>{content.toggleAccount}</p>
          </section>
        },
        props: {
          onClick: async () => {
            hideDropDown();
            await userStore.logOut();
          },
          title: content.toggleAccount
        }
      },
    ];

    return () => {
      return (
        <section class="yplayer-header-setting">
          <NDropdown
            trigger="click"
            options={options}
            show={isDropDownShow.value}
            onClickoutside={hideDropDown}
            onUpdateShow={showDropDown}
            class="setting-dropdown"
            style={"background-color: rgb(250, 250, 250);transition: 0.08s ease;"}
          >
            <i class="iconfont icon-menu" title={content.menu}></i>
          </NDropdown>
        </section>
      );
    };
  },
});
