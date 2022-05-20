import { is } from "@/utils";
import { nextTick, watch, computed, defineCustomElement, PropType, ref, watchEffect } from "vue";

const styleString = `

  .custom-textarea {
    position: relative;
  }

  .placeholder {
    position:absolute;
    opacity: 0.5;
    cursor: text;
  }

  :focus-visible {
    outline: none;
  }
  
  [contenteditable="true"] {
    caret-color: var(--theme);
  }

  
`;

const styles = [styleString];

/**  
 * 基于contenteditable特性实现的公共textarea组件
 */
const textareaCustomElm = defineCustomElement({ 
  styles,
  props: {
    placeholder: {
      type: String as PropType<string>,
      required: false,
      default: '',
    },
    value: {
      type: String as PropType<string>,
      required: false,
    },
    focus: {
      type: Boolean as PropType<boolean>,
      required: false,
    },
    onInput: {
      type: Function as PropType<(value: string) => void>,
      required: false,
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
      requried: false,
    }
  },
  emits: ['input', 'change'],
  setup(props, context) {

    const constants = {
      fontSize: 12,
      lineHeight: 1.5,
      _rowHeight: -1,
      get rowHeight() {
        if (~this._rowHeight) {
          return this._rowHeight = this.fontSize * this.lineHeight
        }
        return this._rowHeight
      }
    }

    const textareaRef = ref<HTMLElement>();
    const placeHolderShow = ref<boolean>(false);
    const insideValue = ref<string | undefined>();
    const textareaStyle = computed(() => {
      return {
        'font-size': `${constants.fontSize}px`,
        'line-height': constants.lineHeight,
      }
    });

    const inputHandler = ({ target }: Event) => {
      props.onInput && props.onInput((target as HTMLElement).innerText);
    }

    const focusHandler = () => {
      placeHolderShow.value = false; 
        textareaRef.value!.focus(); 
    }

    const blurHandler = (ev: Event) => {
      const target = ev.target as HTMLElement;
      const { innerText } = target;
      if (innerText === '') {
        // 当输入框失焦时，最好再手动blur一次，因为对于使用alt+tab切换窗口后，会触发target的blur事件，但是focus的输入光标（caret）却不会消失
        target.blur();
        placeHolderShow.value = true;
      }
      if (insideValue.value !== innerText) {
        insideValue.value = innerText;
        props.onChange && props.onChange(innerText);
      }
    }

    watchEffect(() => {
      insideValue.value = props.value;
    });

    watch(() => props.value, async (value) => {
      await nextTick();
      const textareaElm = textareaRef.value!;
      if (is.undefined(value)) {
        placeHolderShow.value = true;
      } else {
        textareaElm.innerText = value;
      }
    }, {
      immediate: true
    });

    watch(() => props.focus, async (value) => {
      await nextTick();
      const textareaElm = textareaRef.value!;
      if (value) {
        textareaElm.parentElement!.dispatchEvent(new PointerEvent('pointerdown'));
      } else {
        textareaElm.blur();
      }
    }, {
      immediate: true
    })

    return () => {
      return (
        <section class="custom-textarea" onPointerdown={focusHandler}>
          <div
            class="placeholder" 
            hidden={!placeHolderShow.value}
          >
            {props.placeholder}
          </div>
          <div
            tabindex={-1}
            contenteditable="true"
            style={textareaStyle.value}
            ref={textareaRef}
            onInput={inputHandler}
            onBlur={blurHandler}
          ></div>
        </section>
      )
    }
  },
});

window.customElements.define(`custom-textarea`, textareaCustomElm);

 