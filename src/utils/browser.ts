import { isPrototypeOf } from "./constants";
import { typeOf } from "./index";

export const closest = (
  ele: Element,
  tar: Element | ArrayLike<Element> | string
): Element | null | never => {
  //不写Element.prototype.isPrototypeOf(ele)原因见：
  // http://eslint.cn/docs/rules/no-prototype-builtins

  if (!isPrototypeOf.call(Element.prototype, ele)) {
    throw new TypeError(`${ele} is not a Element!`);
  }

  const elArr = (() => {
    if (tar instanceof Element) {
      return [tar];
    }
    try {
      tar = document.querySelectorAll(tar as string);
    } finally {
      const tarTypeOptions = ["nodelist", "htmlcollection", "array"];
      if (tarTypeOptions.includes(typeOf(tar))) {
        return Array.from(tar as ArrayLike<Element>);
      }
      return [];
    }
  })();
  do {
    if (elArr.includes(ele)) return ele;
    ele = ele.parentNode as Element;
  } while (ele !== null);

  return null;
};

//获取元素宽高、以及距离页面边缘的距离
export const getElmRectInfo = (el: Element | null): PlainObject => {
  if (!(el instanceof Element)) {
    throw new TypeError(`${el} is not a Element!`);
  }

  const elm = el as Element;
  if (!elm.getClientRects().length) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }
  const elmRectInfo = elm.getBoundingClientRect();
  const win = elm.ownerDocument.defaultView as typeof globalThis;
  return {
    left: elmRectInfo.left + win.pageXOffset,
    top: elmRectInfo.top + win.pageYOffset,
    width: elmRectInfo.width,
    height: elmRectInfo.height,
  };
};

export const computedStyle = (
  el: Element,
  attr: string,
  pseudo: string | null = null
) =>
  (el.ownerDocument.defaultView as typeof globalThis)
    .getComputedStyle(el, pseudo)
    .getPropertyValue(attr);

/**
 * 获取当前鼠标位置距离某DOM元素边缘的距离
 * @param ev
 * @param elm
 * @returns
 */
export const getPointerOffsetElm = (ev: MouseEvent, elm: Element) => {
  const { pageX, pageY } = ev;
  const { left, top, width, height } = getElmRectInfo(elm);
  return {
    offsetX: pageX - left,
    offsetY: pageY - top,
    width,
    height,
  };
};

/**
 * 获取elm2到elm1的边缘距离
 * @param elm1 
 * @param elm2 
 * @returns 
 */
export const getElmOffsetToElm = (elm1: Element, elm2: Element) => {
  const { left: left1, top: top1 } = getElmRectInfo(elm1);
  const { left: left2, top: top2 } = getElmRectInfo(elm2);
  return {
    offsetLeft: left2 - left1,
    offsetTop: top2 - top1,
  }
}

/**
 * 获取路由地址（不包含origin）
 * @returns 
 */
export const getHrefWithoutOrigin = () => {
  const { href, origin } = location;
  return decodeURIComponent(href).replace(origin, '');
}

/**
 * 元素是否具有滚动条
 * @param el 
 * @param isVertical 
 * @returns 
 */
export const isScroll = (
  el: HTMLElement,
  isVertical?: boolean
): RegExpMatchArray | null => {
  const determinedDirection = isVertical === null || isVertical === undefined
  const overflow = determinedDirection
    ? computedStyle(el, 'overflow')
    : isVertical
      ? computedStyle(el, 'overflow-y')
      : computedStyle(el, 'overflow-x')
  return overflow.match(/(scroll|auto|overlay)/);
}

/**
 * 获取具有scroll滚动条的父元素
 * @param el 
 * @param isVertical 
 * @returns 
 */
export const getScrollContainer = (
  el: HTMLElement,
  isVertical?: boolean
): Window | HTMLElement => {
  let parent: HTMLElement = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroll(parent, isVertical)) {
      return parent
    }
    parent = parent.parentNode as HTMLElement
  }
  return parent
}

export const getOffsetTop = (el: HTMLElement) => {
  let offset = 0
  let parent = el

  while (parent) {
    offset += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }

  return offset
}

export const getOffsetTopDistance = (
  el: HTMLElement,
  containerEl: HTMLElement
) => {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl))
}