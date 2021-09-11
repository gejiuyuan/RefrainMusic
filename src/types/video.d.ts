//视频标签和分类列表对象
export type VideoTagItem = {
    abExtInfo: null | string;
    id: number;
    name: string;
    relatedVideoType: null | string;
    selectTab: boolean;
    url: null | string;
}

//全部视频列表
export type allVideoItem = {
    datas: allVideoDatasItem[];
    hasmore: boolean;
    msg: string;
    rcmdLimit: number;
}

//全部视频列表-datas
export type allVideoDatasItem = {
    alg: string;
    displayed: boolean;
    extAlg: null | string;
    type: number;
    data: {
        alg: string;
        commentCount: number;
        coverUrl: string;
        creator: any;
        description: null | string;
        durationms: number;
        hasRelatedGameAd: boolean;
        width: number;
        height: number;
        markTypes: null | any[];
        playTime: number;
        praised: boolean;
        praisedCount: number;
        previewDurationms: number;
        previewUrl: null | string;
        relateSong: RelativeVideoItem[];
        relatedInfo: null | any;
        resolutions: { resolution: number, size: number }[]
        scm: string;
        shareCount: number;
        subscribed: boolean;
        threadId: string;
        title: string;
        urlInfo: null | any;
        vid: string;
        videoGroup: { id: 58101, name: "听BGM", alg: null }[]
        videoUserLiveInfo: null;
    }
}

//所有相关视频对象
export type RelativeVideoItem = {
    alg: string;
    aliaName: null;
    coverUrl: string;
    creator: {
        userId: string | number;
        userName: string;
    }[];
    durationms: number;
    liveRoom: null;
    markTypes: null;
    playTime: umber;
    title: string;
    transName: string;
    type: number;
    vid: string;
}

//视频点赞、转发、评论数信息对象
export type VideoRelativedInfoItem = {
    commentCount: number;
    liked: boolean;
    likedCount: number;
    shareCount: number;
}

//视频播放源地址
export type VideoPlaybackSourceItem = {
    id: string;
    payInfo: null;
    needPay: boolean;
    r: number;
    size: number;
    url: string;
    validityTime: number;
}

//视频详细信息
export type VideoDetailInfoItem = {

    advertisement: boolean;
    authType: number;
    avatarUrl: string;
    commentCount: number;
    coverUrl: string;
    creator: {
        accountStatus: number;
        authStatus: number;
        avatarDetail: null;
        avatarUrl: string;
        expertTags: null;
        experts: ArrayLike<string>;
        followed: boolean;
        nickname: string;
        userId: number;
        userType: number;
    };
    description: string;
    durationms: number;
    hasRelatedGameAd: boolean;
    width: number;
    height: number;
    markTypes: any[];
    playTime: number;
    praisedCount: number;
    publishTime: number;
    shareCount: number;
    subscribeCount: number;
    threadId: string;
    title: string;
    vid: string;
    videoUserLiveInfo: null;
    resolutions: {
        size: number;
        resolution: number
    }[];
    videoGroup: {
        id: number | string;
        name: string;
        alg: null
    }[];
}