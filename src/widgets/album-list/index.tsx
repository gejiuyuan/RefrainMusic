import {
    computed,
    defineComponent,
    PropType,
    reactive,
    ref,
    watchEffect,
} from "vue";
import {
    onBeforeRouteUpdate,
    useRouter,
} from "vue-router";
import { getLocaleDate, padPicCrop } from "@utils/index";
import { NGrid, NGridItem } from "naive-ui";
import AlbumCoverImg from '@assets/img/album-cover.png';
import AlbumCoverGoldImg from '@assets/img/album-cover-gold.png';
import "./index.scss";
import { PAGE_SIZE } from "@/utils/preference";
import RoutePagination from "../route-pagination";

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
        isNew: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false,
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
        defaultLimit: {
            type: Number as PropType<number>,
            required: false,
            default: PAGE_SIZE.DEFAULT,
        },
        total: {
            type: Number as PropType<number>,
            required: false,
            default: 0,
        }, 
        hasMore: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: true
        },
        showPagination: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    setup(props, context) {
        const router = useRouter();
        const { defaultLimit, isNew } = props;
        const coverImg = isNew ? AlbumCoverGoldImg : AlbumCoverImg; 
        const albumCoverStyle = `background-image:url(${coverImg})`; 

        const albumPagiInfo = reactive({
            total: 0,
            limit: defaultLimit,
            offset: defaultLimit,
            sizeArr: Array(3)
                .fill(0)
                .map((v, i) => defaultLimit * (i + 1)),
        });
        const updateTolListInfo = (query: PlainObject) => {
            const { total } = props;
            const { limit = defaultLimit, offset = 0 } = query;
            albumPagiInfo.limit = limit;
            albumPagiInfo.offset = offset;
            albumPagiInfo.total = total; 
        };
        updateTolListInfo(router.currentRoute.value.query as PlainObject);
    
        onBeforeRouteUpdate((to, from, next) => {
        
            updateTolListInfo(to.query as PlainObject);
            next();
        });

        const toAlbumDetailPage = (id: number) => {
            router.push({
                path: '/album',
                query: {
                    id
                }
            })
        }
        
        const renderAlbumList = () => {
            const { albumList, gaps: { x, y }, cols } = props;
            return (
                <NGrid xGap={x} yGap={y} cols={cols}>
                    {
                        albumList.map(({ blurPicUrl, name, artist, id, transNames, publishTime }) => {
                            return (
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
                                            { getLocaleDate(publishTime, { delimiter: "-" }) }
                                        </p>
                                    </section>
                                </NGridItem>
                            )
                        })
                    }
                </NGrid>
            )
        }

        return () => {
            return (
                <section class="album-container">
                    {
                        renderAlbumList()
                    }
                    {
                        props.showPagination && (
                            <section class="album-pagination">
                                <RoutePagination 
                                    pagiInfo={albumPagiInfo} 
                                    hasMore={props.hasMore}
                                ></RoutePagination>
                            </section>
                        )
                    }
                </section>
            );
        };
    },
});
