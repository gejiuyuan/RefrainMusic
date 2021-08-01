import {
  toRefs,
  watch,
  ref,
  reactive,
  shallowReactive,
  computed,
  provide,
  onActivated,
  WatchStopHandle,
  defineComponent,
} from "vue";
import {
  useRouter,
  useRoute,
  onBeforeRouteLeave,
  RouterView,
} from "vue-router";
import { userDetail, userSubcount, userRecord, userPlaylist } from "@api/user";
import { EMPTY_ARR, EMPTY_OBJ, getLocaleDate, NOOP, objToQuery, padPicCrop } from "@utils/index";
import { PlayRecord } from "@/types/song";
import { UserDetail } from "@/types/user";
import "./index.scss";

import { baseUserMenuRouteLists, defaultPlayRecordType } from "./config";
import { PlaylistCommon } from "@/types/songlist";
import { NxButton, NSpace } from "naive-ui";
import CommonRouterList from "@/widgets/common-router-list";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";

export default defineComponent({
  name: "UserDetail",
  setup(props, context) {
    const route = useRoute();

    //用户基础信息
    const userInfo = ref<UserDetail>({
      adValid: false,
      bindings: [],
      createTime: 0,
      createDays: 0,
      level: 0,
      listenSongs: 0,
      peopleCanSeeMyPlayRecord: false,
      profile: {
        avatarUrl: "",
        nickname: "",
      },
    });
    provide("userInfo", userInfo);
    const playRecordData = shallowReactive<PlayRecord>([]);
    provide("playRecordData", playRecordData);

    //路由菜单列表
    const userInfoRouteLists = computed(() => {
      const query = objToQuery({ id: route.query.id as string }, true);
      return baseUserMenuRouteLists.reduce((total, { to, text }, i) => {
        total[i] = {
          to: to + query,
          text,
        };
        return total;
      }, [] as typeof baseUserMenuRouteLists);
    });

    //歌单（包括收藏和创建）
    const songlists = shallowReactive({
      created: {
        data: [] as PlaylistCommon[],
        hasMore: true
      },
      collection: {
        data: [] as PlaylistCommon[],
        hasMore: true
      },
    });

    provide("songlists", songlists);
    const getUserPlaylist = async (query: any) => {
      const { id: uid, limit, offset } = query;
      const { data = EMPTY_OBJ, } = await userPlaylist({ uid, limit, offset });
      const { playlist = EMPTY_ARR, more } = data;
      const collection: PlaylistCommon[] = [];
      const created: PlaylistCommon[] = [];
      playlist.forEach((list: PlaylistCommon) => {
        const {
          creator: { userId },
        } = list;
        (userId === uid ? created : collection).push(list);
      });
      songlists.created = {
        data: created,
        hasMore: more
      };
      songlists.collection = {
        data: collection,
        hasMore: more
      };
    };

    //获取用户最近播放记录
    const getUserRecord = async (uid: string | number, type: 0 | 1) => {
      const { data } = await userRecord({
        uid,
        type,
      });
      const { weekData, allData } = data || {};
      if (data) {
        playRecordData.length = 0;
        playRecordData.push(...(weekData || allData));
      }
    };

    //获取用户详细信息
    const getUserDetail = async (uid: string | number) => {
      const { data = {} } = await userDetail(uid);
      data && (userInfo.value = data);
    };

    const queryWatcher: WatchStopHandle = watch(
      () => route.query as any,
      async ({ id, type, limit, offset }, oldQuery = {}) => {
        const {
          id: oldId,
          type: oldType,
          limit: oldLimit,
          offset: oldOffset,
        } = oldQuery;
        if (id !== oldId || limit !== oldLimit || offset !== oldOffset) {
          getUserPlaylist({ id, limit, offset });
        }
        if (id !== oldId) {
          await getUserDetail(id);
        }
        if (id !== oldId || type !== oldType) {
          //如果用户设置了播放记录是可见的
          userInfo.value.peopleCanSeeMyPlayRecord && getUserRecord(id, type);
        }
      },
      {
        immediate: true,
      }
    );

    onBeforeRouteLeave(() => {
      queryWatcher();
    });

    return () => {
      return (
        <section class="yplayer-user">
          <section class="user-header">
            <img
              loading="lazy"
              class="user-avatar"
              src={padPicCrop(userInfo.value.profile.avatarUrl as string, {
                x: 340,
                y: 340,
              })}
              alt=""
            />
            <section class="user-header-main">
              <h4 class="user-name">{userInfo.value.profile.nickname}</h4>
              <div class="user-btns">
                <NSpace>
                  <NxButton class="" type="warning" size="small" dashed>
                    动态：
                    {userInfo.value.profile.eventCount}
                  </NxButton>
                  <NxButton class="" type="success" size="small" dashed>
                    关注：
                    {userInfo.value.profile.follows}
                  </NxButton>
                  <NxButton class="" type="info" size="small" dashed>
                    粉丝：
                    {userInfo.value.profile.followeds}
                  </NxButton>
                </NSpace>
              </div>
              <p class="userinfo-layer user-desc">
                <span>个性签名：</span>
                <span>{userInfo.value.profile.signature || "暂无"}</span>
              </p>
              <p class="userinfo-layer user-birthday">
                <span>生日：</span>
                <span>
                  {getLocaleDate(Number(userInfo.value.profile.birthday)) ||
                    "暂无"}
                </span>
              </p>
            </section>
          </section>

          <section class="user-body">
            <CommonRouterList routelist={userInfoRouteLists.value}></CommonRouterList>
            <div class="user-routes">
              <KeepAliveRouterview></KeepAliveRouterview>
            </div>
          </section>
        </section>
      );
    };
  },
});
