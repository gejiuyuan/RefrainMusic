/** @format */

export type SearchLyricItem = {
	//专辑
	al: {
		id: number;
		name: number;
		picUrl: string;
		tns: any[];
	};
	//别名
	alia: string[];
	//作者
	ar: {
		id: number;
		alia: string[];
		name: string;
		tns: any[];
	}[];
	cd: string;
	copyright: number;
	//歌曲时长
	dt: number;
	fee: number;
	id: number;
	mark: number;
	lyrics: string[];
	name: string;
	mv: number;
	pop: number;
	publishTime: number;
	single: number;
	v: number;
};

/**
 * 歌词提供者、翻译者信息
 */
export type LyricUserInfo = {
	id: number;
	demand: number;
	nickname: string;
	status: number;
	uptime: number;
	userid: number;
};

/**
 * 歌词信息
 *    - klyric  歌词每个字与播放时间的映射信息
 *    - tlyric  翻译的歌词
 *    - lrc     正常的歌词
 *    - nolyric/needDesc 存在于没有歌词时，如纯音乐等
 */
export type SongLyricItem = Partial<{
	transUser?: LyricUserInfo;
	lyricUser: LyricUserInfo;
}> &
	Record<'qfy' | 'sfy' | 'sgc', boolean> &
	Partial<Record<'klyric' | 'tlyric' | 'lrc', { version: number; lyric: string }>> &
	Partial<Record<'needDesc' | 'nolyric', boolean>>;
