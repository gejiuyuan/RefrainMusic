import { defineComponent, KeepAlive } from "vue";
import { RouterView } from "vue-router";

export const renderKeepAliveRouterView = () => (
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
);    
     