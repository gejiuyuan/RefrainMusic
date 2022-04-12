import textarea from './textarea';

const PREFIX = 'custom-';

[textarea].forEach(({name, element}) => { 
  window.customElements.define(`${PREFIX}${name}`, element);
});