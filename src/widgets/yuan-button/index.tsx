import { defineComponent, PropType } from "vue";
import './index.scss';

export type YuanButtonData = {
  text: string;
  value: any;
}

export default defineComponent({
  name: 'YuanButton',
  props: {
    value: {
      type: null,
      required: false,
      default: void 0,
    },
    text: {
      type: String as PropType<string>,
      required: false,
      default: '',
    },
    onClick: {
      type: Function as PropType<(data: YuanButtonData) => void>,
      required: false,
      default: () => (() => {}),
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    }
  },
  setup(props, { slots }) {
    
    return () => {
      const { onClick , text, value, disabled } = props
      return (
        <button class={`yuan-button ${disabled ? 'yuan-botton-disabled' : ''}`} onClick={() => onClick({
          value,
          text
        })}>
          {text}
        </button>
      )
    }

  }
})