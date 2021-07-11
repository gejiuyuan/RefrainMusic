import {
  ComponentCustomProperties,
  ComponentCustomOptions,
  Prop,
  ComponentPublicInstance,
} from "vue";
// import { Store } from "vuex";

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
 
 
//由于vuex 4删除了其在vue组件中this.$store等的全局类型，因此需要手动增添类型声明
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    // $store: Store<any>;
    $props: Prop<any>;
    $refs: any;
    [key: string]: any; //以保证在computed等方法中使用this.xxx（data属性）不会类型报错
  }

  //让getCurrentInstance中支持ctx上下文属性
  interface ComponentInternalInstance {
    ctx: ComponentPublicInstance, 
  }

}

/**
 * 在tsx下给Element添加非标准HTMLAttributes不报错
 */
declare module "@vue/runtime-dom" {
  interface HTMLAttributes {
    [attr: string]: any;
    singalLineDot?: any;
    scrollbar?: any;
    equalAspectRatio?: any;
    loading?: string;
  }


}
 