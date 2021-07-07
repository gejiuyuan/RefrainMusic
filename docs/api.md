#### 应用配置

    config是一个包含了vue应用全局配置的对象。使用如下：

        const app = vue.createApp({});
        app.config = {...};
        app.mount(...)

    1、errorHandler：

        指定处理组件渲染方法执行期间以及侦听器跑出的未捕获错误。该函数被调用时，能获取到错误信息和应用实例。

        使用：

            app.config.errorHandler = (err, vm , info) => {
                //info 是vue特定的错误信息，比如错误所在的生命周期钩子
            }

    2、warnHandler：为vue运行时警告处理函数。这个只在开发环境生效，生产环境被忽略。使用：

        app.config.warnHandler = (msg , vm ,trace) => {
            //trace 是组件的继承关系追踪
        }

    3、globalProperties：

        添加可在app内的任何组件实例中访问的全局属性。属性名冲突时，优先使用组件的。而在vue2中使用vue.prototype.xxx进行全局属性/方法拓展。

        使用：

            //vue2
            Vue.prototype.$http = () => {}

            //vue3
            app.config.globalProperties.$http = () => {}

    4、isCustomElement：

        指定一个用来识别在vue之外定义的自定义元素的方法（例如浏览器原生组件——Web Component）。如果组件符合此条件，则不需要本地或全局注册，并且Vue不会抛出关于unknown custom element的警告。注意：原生HTML和SVG标记无需再该函数中匹配，因为Vue解析器会自动检查好。

        使用：

            //任何以yuan-开头的元素都将被识别为原生自定义元素
            app.config.isCustomElement = tag => tag.startsWidth('yuan-')

    5、optionMergeStrategies：

        自定义选项定义合并策略，即简单地覆盖已有值。合并策略选项分别接受在父组件和子组件上定义的该选项的值作为第一个和第二个参数，组件实例被作为第三个参数传入。

        用途：mixin组件命名冲突问题

        使用：

            const app = vue.createApp({
                custom: 'hello'
            })
            app.config.optionMergeStrategies.custom = (toVal, fromVal, vm) => {
                return toVal || fromVal
            }

            app.mixin({
                custom: 'goodbye',
                created() {
                    console.info(this.$options.custom)
                }
            })

    6、performance:

        设置为true，以便在浏览器开发工具的performance/timeline面板中启用对组件初始化、编译、渲染和更新的性能追踪。只适用于开发模式和支持performance.mark的浏览器。

### 应用 API

    1、component：

        注册或检索全局组件。注册还会使用给定的name参数自动设置组件的name。

        使用：

            app.component('yuan-player', {
                //xxx
            })
            const yuanplayer = app.component('yuan-player', {})

    2、config：

        包含应用配置的对象

    3、directive：

        注册或检索全局指令

        使用：

            第一种：
                app.directive('my-direct', {
                    //指令是具有一组生命周期的钩子
                    //在绑定元素的父组件挂在之前调用
                    beforeMounted() {},
                    //组件挂在后调用
                    mounted() {},
                    //在包含组件的VNode更新之前调用
                    beforeUpdate() {},
                    //在包含组件的VNode及其子组件的VNode更新之后调用
                    update() {},
                    //在绑定元素的父组件卸载之前调用
                    beforeUnmount() {}
                    //卸载绑定的元素的父组件时调用
                    unmounted() {}
                })

            第二种：
                app.directive('ddd', () => {
                    //这将被作为mounted和updated调用
                })

            第三种：
                const myDir = app.directive('ddd');
                //如果该指令已经注册，则返回其指令定义


        指令钩子参数：

            el：指令绑定到的元素。可用于直接操作DOM

            binding：对象，包含如下属性：

                instance：使用指令的组件实例；
                value：传递给指令的值。例如：v-my-direct='1+2'，该值为2
                oldValue:  之前的值，仅在beforeUpdate和updated中可用。值是否更改均可用
                arg：参数传递给指令（如果有的话）。例如：v-my-direct:foo，arg为'foo'
                modifiers：包含修饰符（如果有）的对象。例如: v-my-direct。中，修饰符对象为｛foo： true， bar： true｝
                dir：一个对象，在注册指令时作为参数传递，例如：app.directive('focus', { mounted(el){el.focus()} }) ，第二个参数对象就是dir

            vnode: 上面作为el参数收到的真实DOM元素的蓝图
            prevNode：上一个虚拟节点，仅在beforeUpdate和updated钩子中可用


    4、mixin：

        在整个应用范围内应用混入。一旦注册，它们就可以在当前的应用中任何组件模板内使用它。插件作者可使用该方法将自定义行为注入组件。不建议在应用代码中使用

        使用：

            app.mixin({
                //xxx
            })

    5、mount：

        将应用实例的根组件挂在在提供的DOM元素上。

    6、provide：

        设置一个可以被注入到应用范围内所有组件中的值。组件应该使用inject来接provide提供的值。
        从provide、inject的角度看，可以将应用程序视为根级别的祖先，而根组件是其唯一的子级。

        注意点：provide和inject绑定不是响应式的。砸门可向下传递一个响应式对象。

        使用：

            app.provide('user', 'administrator');

    7、unmount：

        在提供的DOM元素上卸载应用实例的根组件。

        使用：

            app.mount('#app');
            setTimeout(() => app.unmount('#app'), 5000);//5秒后卸载应用

    8、use：

        安装vue的插件。若插件是一个对象，它必须暴露一个install方法。如果它本身是一个函数，他将被视为安装方法。

        该安装方法将以应用实例作为第一个参数被调用。传给use的其它options参数将作为后续参数传入该安装方法。

        当在同一个插件上多次调用此方法时，该插件只会安装一个。

### 全局 API

    1、createApp：

        返回根组件实例app。

        使用：

            const app = createApp(App); //app为组件

            cosnt app2 = createApp({
                data() {
                    return {
                        a: 1,
                    }
                },
                mounted() {},
                //xxx
            })

            //第二个参数的值会被传入对应的props属性中
            const app3 = createApp({
                props: ['user']
            }, {
                user: 'gejiuyuan'
            })

            注意：此时组件的this.$props.user为gejiuyuan，且$props为响应式对象；而this.$options.props为普通对象。两者区别：

                App.vue组件内：
                    props: {
                        user: {
                            type: String,
                            required: false
                        },
                        hello: {
                            type: String,
                            required: true,
                        }
                    }

                此时const app = createApp(App, {user: gejiuyuan})

                App.vue内的this.$props则不包括hello属性，除非传入了{user: gejiuyuan, hello: hhaha}，或者有默认值，如：

                    props: {
                        hello: {
                            type: String,
                            required: true,
                            default: 'hahaah'
                        }
                    }

    2、h：

        返回一个虚拟节点，缩写为VNode：一个普通对象，其中包含向Vue描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。他的目的是用于手动编写渲染函数。

        使用：

        render() {
            return Vue.h('h1', {
                id: 'app',
                children: [
                    h('div', {}, 'ddd')
                ],
                'h1ooo'
            })
        }

    3、defineComponent：

        从实现看，defineComponent只返回传递给它的对象。但是，就类型而言，返回的值有一个合成类型的构造函数，用于手动渲染函数、TSX和IDE工具支持

        使用：

            const myComp = defineComponent({
                data() {
                    return { count: 1}
                },
                methods: {
                    increment() {
                        this.count++;
                    }
                }
            })

            或

            const HelloWorld = defineComponent(function HelloWorld() {
                cosnt count = ref(0)
                return {count}
            })

    4、defineAsyncComponent：

        创建一个动态加载的异步组件

        参数：defineAsyncComponent接受一个返回Promise的工厂函数。Promise的resolve回调应该在服务端返回组件定义后被调用。你也可以调用reject（reson）来表示加载失败

        使用：
        
            const asyncComp = defineAsyncComponent(() => {
                import('./comps/asyncCom.vue')
            });
            app.componenet('async-comp', asyncComp);

        高阶用法：

            const asyncCom = defineAsyncComponenet({
                //工厂函数
                loader: () => import('./foo.vue),
                //加载异步组件时要使用的组件
                loadingComponenet: LoadingComponenet,
                //加载失败时要使用的组件
                errComponenet: ErrorComponenet,
                //在显示loadingComponent之前的延迟，默认值200ms
                delay: 200,
                //若提供了timeout，并在加载组件的时间超过预设值，将显示错误组///件。默认值: Infinity，永不超时
                timeout: 3000,
                //定义组件是否可挂起，默认值：true
                suspensible: false,
                //error: 错误信息对象；retry：指示当promise加速器reject时，
                //加载器是否应该重试；fail：指示加载程序结束退出；attempts：
                //允许最大重试次数
                onError(error, retry , fail, attemplts) {

                }
            })


### 响应式基础API

    1、reactive：

        返回对象的响应式副本。响应式转换时深层的，它影响所有嵌套property。在基于proxy实现中，返回的proxy是不等于原始对象的。建议只使用响应式proxy，避免依赖原始对象。

        类型声明：

            function reactive<T extends object>(target: T): UnwrapNestedRefs<T>

    2、readonly：

        获取一个对象（响应式或纯对象）或ref并返回原始proxy的只读proxy。只读proxy是深层的：访问的任何嵌套property也是只读的。

        const original = reactive({count: 0})
        const copy = readonly(original)

        watchEffect(() => {
            //适用于响应式数据追踪
            console.info(copy.count)
        })

        original.count++; //变成original会触发侦听器依赖副本

        copy.count++; //变更副本将失败并导致警告

    3、isProxy：检查对象是否是由reactive或readonly创建的proxy

    4、isReactive：检查对象是否是reactive创建的响应式proxy。如果proxy是readonly创建的，但还包装了由reactive创建的另一个proxy，他也会返回true

    5、isReadonly：检查对象是否由readonly创建的只读proxy

    6、toRaw：返回reactive或者readonly proxy的原始对象。这是一个转义口，可用于临时读取而不会引起proxy访问/跟踪开销，也可用于写入而不会触发更改。不建议保留对原始对象的持久引用。

    7、markRaw：标记一个对象，使其永远不会转换为proxy。返回该对象本身。

    8、shallowReactive：创建一个响应式proxy，跟踪其自身property的响应性，但不执行嵌套对象的深度响应式转换（暴露原始值）。

        const state = shallowReactive({
            foo: 1,
            nested: {
                bar: 2
            }
        })

        //改变状态本身的性质是响应式的
        state.foo++;
        //但是不转换嵌套对象
        isReactive(state.nested); //false
        state.nested.bar++;

    9、shallowReadonly：创建一个proxy，使其自身的property为只读，但不执行嵌套对象的只读转换（暴露原始值）。


### Refs

    1、ref：

        接受一个内部值并返回一个响应式且可变的ref对象。ref对象具有指向内部值的单个property .value。

        类型声明：

        interface Ref<T> {
            value: T
        }
        function ref<T>(value: T): Ref<T>

        有时我们可能需要为ref的内部值指定复杂类型。我们可以通过在调用ref来覆盖默认推断时传递一个泛型参数来简洁地做到这一点

    2、unref：

        如果参数为ref，则返回内部值，否则返回参数本身。这是val = isRef(val) ? val.value : val。

    3、toRef:

        可以用来为源响应式对象上的property创建一个新的ref。然后将ref传递出去，从而保持对其源property的响应式连接。

    4、toRefs：

        将响应式对象转换为普通对象，其中结果对象的每个property都是指向原始对象响应property的ref。

        const state = reactive({
            foo: 1,
            bar:2
        })
        const stateAsRefs = toRefs(state);

        //ref 和 原始property ‘脸接’
        state.foo++;
        console.info(stateAsRefs.foo.value); //2

        stateAsRefs.foo.value++;
        console.info(state.foo);//3

        由此一来，砸门便可在不丢失对象响应式情况下，使用ES6解构获取其值。

    5、isRef：

        值是否为ref对象

    6、shallowRef：

        创建一个ref，它跟踪自己的.value更改，但不会使其值成为响应式的。

        const foo = shallowRef({});
        //改变ref的值是响应式的
        foo.value = {};

        //但这个值不会被转换
        isReactive(foo.value);//false

    7、triggerRef：

        手动执行和shallowRef关联的任何副作用(watchEffect)

        const shallow = shallowRef({
            greet: 'hello world'
        })
        
        //第一次运行时记录一次 "hello, world"
        watchEffect(() => {
            console.info(shallow.value.greet)
        })

        //这不会触发副作用，因为ref是浅层的
        shallow.value.greet = 'hello, universe'

        //记录 'hello , universe'
        triggerRef(shallow)