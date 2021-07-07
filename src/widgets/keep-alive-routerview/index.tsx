import { defineComponent, KeepAlive } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
    name: 'KeepAliveRouterView',
    setup() {
        return () => {
            return (
                <RouterView
                    v-slots={{
                        default(data: any) {
                            const { Component } = data;
                            return (
                                <KeepAlive>
                                    <Component />
                                </KeepAlive>
                            );
                        },
                    }}
                ></RouterView>
            )
        }
    }
})