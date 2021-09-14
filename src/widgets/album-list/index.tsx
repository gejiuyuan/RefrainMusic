import {
    computed,
    defineComponent,
    PropType,
    ref,
    watchEffect,
} from "vue";
import {
    useRouter,
} from "vue-router";
import { getLocaleDate, padPicCrop } from "@utils/index";
import { NGrid, NGridItem } from "naive-ui";
import AlbumCoverImg from '@assets/img/album-cover.png';
import AlbumCoverGoldImg from '@assets/img/album-cover-gold.png';
import "./index.scss";

const AlbumImg = defineComponent({
    name: 'AlbumImg',
    props: {
        imgUrl: {
            type: String as PropType<string>,
            default: '',
        },
        albumCoverStyle: {
            type: String as PropType<string>,
            default: '',
        }
    },
    setup(props, {slots}) {
        const coverShow = ref(false);
        const showCover = () => {
            coverShow.value = true;
        }
        return () => (
            <div className="album-pic">
                <i class="album-cover" style={props.albumCoverStyle} visibility={coverShow.value}></i>
                <div class="album-pic-body" aspectratio="1">
                    <img
                        loading="lazy"
                        onLoad={showCover}
                        src={padPicCrop(props.imgUrl, { x: 300, y: 300 })}
                        alt=""
                    />
                </div>
            </div>
        )
    }
})

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
            default: () => ({ x: 50, y: 50 })
        },
        cols: {
            type: Number as PropType<number>,
            required: false,
            default: 6
        },
        isNew: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false,
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
            const { albumList, gaps: { x, y }, cols, isNew } = props;
            const coverImg = isNew ? AlbumCoverGoldImg : AlbumCoverImg; 
            const albumCoverStyle = `background-image:url(${coverImg})`; 
            return (
                <section class="album-container">
                    <NGrid xGap={x} yGap={y} cols={cols}>
                        {
                            albumList.map(({ blurPicUrl, name, artist, id, transNames, publishTime }) =>
                                <NGridItem>
                                    <section
                                        class="album-item"
                                        title={`${name} - ${artist?.name}`}
                                        onClick={() => toAlbumDetailPage(id)}
                                    >
                                        <AlbumImg albumCoverStyle={albumCoverStyle} imgUrl={blurPicUrl}></AlbumImg>
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
