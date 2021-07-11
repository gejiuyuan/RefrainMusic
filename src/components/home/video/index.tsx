import { defineComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";

import {
    getVideoTagList,
    getVideoCategoryList,
    getVideos,
    getAllVideoList,
    getRecommendVideos,
    getRelativeVideos,
    getVideoDetail,
    getVideoRelativeInfo,
    getVideoPlaybackSource,
} from "@api/video";

export default defineComponent({
    name: "Video",
    setup(props, context) {
        const route = useRoute();
        const router = useRouter();

        watch(
            () => route.query,
            (query) => {
                console.info(9)
                const vid = query.vid as string;
                getVideoTagList();
                getVideoCategoryList();
                // getVideos({

                // })
                getAllVideoList();
                getRecommendVideos();
                getRelativeVideos({
                    id: vid,
                });
                getVideoDetail({
                    id: vid,
                });
                getVideoRelativeInfo({
                    vid
                });
                getVideoPlaybackSource({
                    id: vid
                });
            },
            {
                immediate: true
            }
        );

        return () => {
            return <div>video</div>;
        };
    },
});
