import {
    computed,
    defineComponent,
    PropType,
    watchEffect,
} from "vue";
import {
    useRouter,
} from "vue-router";
import { getLocaleDate, padPicCrop } from "@utils/index";
import { NGrid, NGridItem } from "naive-ui";
import "./index.scss";

export default defineComponent({
    name: "AlbumList",
    props: {
        albumList: {
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
            default: 7
        }
    },
    setup(props, context) {
        const router = useRouter();

        const toAlbumDetailPage = (id: number) => {
            router.push({
                path: '/album',
                query: {
                    id
                }
            })
        }

        return () => {
            const { albumList, gaps: { x, y }, cols } = props;

            return (
                <section class="album-container">
                    <NGrid xGap={x} yGap={y} cols={cols}>
                        {
                            albumList
                                .map(
                                    ({ blurPicUrl, name, artist, id, transNames, publishTime }) =>
                                        <NGridItem>
                                            <section
                                                class="album-item"
                                                title={`${name} - ${artist?.name}`}
                                                onClick={() => toAlbumDetailPage(id)}
                                            >
                                                <div aspectratio="1">
                                                    <img
                                                        loading="lazy"
                                                        src={padPicCrop(blurPicUrl, { x: 300, y: 300 })}
                                                        alt=""
                                                    />
                                                </div>
                                                <h5 singallinedot>
                                                    <span>{`${name} - ${artist?.name}`}</span>
                                                </h5>
                                                <p>
                                                    {
                                                        getLocaleDate(publishTime, {
                                                            delimiter: "-",
                                                        })
                                                    }
                                                </p>
                                            </section>
                                        </NGridItem>
                                )
                        }
                    </NGrid>
                </section>
            );
        };
    },
});
