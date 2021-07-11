import {
    computed,
    defineComponent,
    PropType,
    watchEffect,
} from "vue";
import {
    useRouter,
} from "vue-router";
import { getLocaleCount, padPicCrop } from "@utils/index";
import { NGrid, NGridItem } from "naive-ui";
import "./index.scss";

export default defineComponent({
    name: "VideoList",
    props: {
        videoList: {
            type: Array as PropType<any[]>,
            required: true
        },
        gaps: {
            type: Object as PropType<Partial<Record<'x' | 'y', number>>>,
            required: false,
            default: () => ({ x: 30, y: 30 })
        },
        cols: {
            type: Number as PropType<number>,
            required: false,
            default: 5
        }
    },
    setup(props, context) {
        const router = useRouter();

        const toVideoDetailPage = (vid: number) => {
            router.push({
                path: '/video',
                query: {
                    vid
                }
            })
        }

        return () => {
            const { videoList, gaps: { x, y }, cols } = props;
            videoList.forEach((v: any) => {
                v.playTimeStr = getLocaleCount(v.playTime);
                v.userName = v.creator.map((item: any) => item.userName).join("、");
            });
            return (
                <>
                    <section class="video-container">
                        <NGrid xGap={x} yGap={y} cols={cols}>
                            {
                                videoList.map((video) =>
                                    <NGridItem>
                                        <section class="video-card" key={video.vid}>
                                            <div aspectratio={1.7}>
                                                <img
                                                    loading="lazy"
                                                    src={padPicCrop(video.coverUrl, { x: 280, y: 150 })}
                                                    onClick={() => toVideoDetailPage(video.vid)}
                                                    alt=""
                                                />
                                            </div>
                                            <div class="video-main">
                                                <h5 class="video-title">{video.title}</h5>
                                                <p class="video-info">
                                                    <span class="video-artist">{video.userName}</span>
                                                    <span class="video-playcount">{video.playTimeStr}</span>
                                                </p>
                                            </div>
                                        </section>
                                    </NGridItem>
                                )
                            }
                        </NGrid>
                    </section>
                </>
            );
        };
    },
});
