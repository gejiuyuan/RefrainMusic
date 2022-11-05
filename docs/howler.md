<!-- @format -->

### 一、描述

---

howler.js（吼叫）是一个现代 web 音频库。它默认使用 Web Audio 技术，同时兼容 HTML5 Audio 方案。这使得 JavaScript 更容易处理音频，并且运行在所有浏览器平台上。

可在[howlerjs.com](`howlerjs.com`)上获取更多信息、在线延时和用户展示。

关注 howler.js 的推特账号，并参与相关发展讨论：[@GoldFireStudios](https://twitter.com/goldfirestudios)

### 二、特性

---

- 满足所有音频需求的单一 API
- 默认使用 Web Audio API，并使用 HTML5 Audio 向后兼容
- 处理跨环境（平台）的边缘情况和错误
- 支持所有编解码器，实现全面跨浏览器支持
- 自动缓存，以提升性能
- 单独、分组或全局控制声音
- 一次播放多种声音
- 简单的声音精灵定义和播放
- 完全控制衰弱、速率、搜索、音量等
- 轻松添加 3D 空间音效或立体声平移
- 模块化 - 随心所以、易于扩展
- 没有外部依赖，只有纯 JavaScript
- 压缩后只有 7Kb

### 三、浏览器兼容性

---

- 谷歌 Chrome 7.0+
- IE 9.0+
- FireFox 4.0+
- Safari 5.1.4+
- Mobile Safari 6.0+（用户输入后）
- Opera 12.0+
- Microsoft Edge

### 四、在线演示

---

- [Audio Player](https://howlerjs.com/#player)

- [Radio](https://howlerjs.com/#radio)
- [Spatial Audio](https://howlerjs.com/#spatial)
- [Audio Sprites](https://howlerjs.com/#sprite)

### 五、使用文档

---

#### 目录

- 快速开始
- 案例
- 核心
  - 配置选项
  - 方法
  - 全局配置
  - 全局方法
- 插件：Spatial（空间的）
  - 配置选项
  - 方法
  - 全局方法
- 组合播放（Group Playback）
- 移动端播放
- 杜比音效播放
- Facebook 即时游戏
- 格式推荐
- 许可证

### 六、快速开始

获取运行的几种方式：

- 拷贝仓库：[`git clone https://github.com/goldfire/howler.js.git`](git clone https://github.com/goldfire/howler.js.git)
- npm 安装：npm install howler
- yarn 安装：yarn add howler
- bower 安装：bower install howler
- 使用 CDN：[`cdnjs`](https://cdnjs.com/libraries/howler) [`jsDelivr`](https://www.jsdelivr.com/projects/howler.js)

在浏览器中：

```
<script src="/path/to/howler.js"></script>
<script>
	var sound = new Howl({
		src: ['sound.webm', 'sound.mp3']
	})
</script>
```

作为项目依赖：

```
import { Howl, Howler } from 'howler';
```

```
const { Howl, Howler } = require('howler');
```

包含的分发文件：

- howler：这是默认的、完全捆绑的源，包括 howler.core 和 howler.spatial，这包含了 howler 附带的所有功能。
- howler.core：这只包括旨在在 Web AUdio 和 HTML Audio 之间创建奇偶校验的核心功能，但它不包含任何空间/立体声音频功能。
- howler.spatial：这是一个添加空间/立体声音频功能的插件。他需要 howler.core 才能运行，因为它只是 howler.core 的扩展组件。

### 七、案例

最基本的，播放一个 MP3：

```
var sound = new Howl({
	src: ['sound.mp3']
});
sound.play();
```

流音频（用于实时音频或大文件）：

```
var sound = new Howl({
	src : ['stream.mp3'],
	html5: true
});
sound.play();
```

更多播放选项：

```
var sound = new Howl({
	src: ['sound.webm', 'sound.mp3', 'sound.wav'],
	autoplay: true,
	loop: true,
	volume: 0.5,
	onend() {
		console.info('finished!')
	}
})
```

定义和播放一个声音精灵（片段）：

```
var sound = new Howl({
  src: ['sounds.webm', 'sounds.mp3'],
  sprite: {
    blast: [0, 3000],
    laser: [4000, 1000],
    winner: [6000, 5000]
  }
});
// Shoot the laser!
sound.play('laser');
```

事假监听：

```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Clear listener after first call.
sound.once('load', function(){
  sound.play();
});

// Fires when the sound finishes playing.
sound.on('end', function(){
  console.log('Finished!');
});
```

控制多个声音：

```
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Play returns a unique Sound ID that can be passed
// into any method on Howl to control that specific sound.
var id1 = sound.play();
var id2 = sound.play();

// Fade out the first sound and speed up the second.
//减弱第一个声音，同时加速第二段声音
sound.fade(1, 0, 1000, id1);
sound.rate(1.5, id2);
```

ES6：

```
import {Howl, Howler} from 'howler';

// Setup the new Howl.
const sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Play the sound.
sound.play();

// Change global volume.
Howler.volume(0.5);
```

可以在示例目录中找到更深入的示例（含有[`在线演示`]([examples directory](https://github.com/goldfire/howler.js/tree/master/examples).)）。

### 八、核心

---

#### 配置选项

| 属性        | 类型           | 默认值 | 含义                                                                                                                                                                                                                                                                    |
| ----------- | -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src         | Array/String   | []     | 加载的音频轨道来源（URL 或 base64）。这应该是按照优先顺序排列的，howler.js 会自动加载第一个与当前浏览器兼容的。如果没有文件扩展名，则需使用 format 属性明确指定扩展名                                                                                                   |
| volume      | Number         | 1.0    | 指定音频轨道的声音，从 0.0 到 1.0                                                                                                                                                                                                                                       |
| html5       | Boolean        | false  | 设置 true 强制使用 HTML5 Audio。这应该用于大型音频文件，这样你就不必再播放之前等待完整文件下载和解码                                                                                                                                                                    |
| loop        | Boolean        | false  | 设置 true 让声音自动从头自动播放                                                                                                                                                                                                                                        |
| preload     | Boolean/String | true   | 定义 Howl 时，自动下载音频文件。如果使用 HTML5 音频，你可以将其设置为'metadata'，表示仅加载文件的元数据。（例如，无需下载整个文件，即可获取其 duration 值）                                                                                                             |
| autoplay    | Boolean        | false  | 设置 true，音频加载好时，开始自动播放                                                                                                                                                                                                                                   |
| mute        | Boolean        | false  | 设置 true，让音频静音                                                                                                                                                                                                                                                   |
| sprite      | Object         | {}     | 定义一个音频片段。偏移量和持续时间以毫秒为单位。第三个可选参数可用于将片段设置为循环。生成兼容声音片段的一种简单方法是[audiosprite](https://github.com/tonistiigi/audiosprite)                                                                                          |
| rate        | Number         | 1.0    | 播放速率，范围：0.5-4.0                                                                                                                                                                                                                                                 |
| pool        | Number         | 5      | 非活动声音池的大小。一旦声音停止或播放完毕，它们会被标记为结束并准备好清理。我们保留了一个池来回收利用，以提升性能。一般不需要修改。但要记住，当声音暂停时，它不会从池中删除，仍会被认为是活动的，以便后续恢复                                                          |
| format      | Array          | []     | howler.js 会自动从扩展（extension）中检测你的文件格式，但你也可以在提取无效的情况下手动指定格式（例如使用分隔 SoundCloud 声云流时）                                                                                                                                     |
| xhr         | Object         | null   | 当使用 Web Audio 时，howler.js 使用一个 XHR 请求去加载音频文件。如果你需要发送自定义请求头，就可以设置 HTTP 方法或启用 withCredentials，请将它们与此参数一起包含。每个都是可选的，method 默认为 GET，headers 默认为 null，withCredentials 默认为 false                  |
| onload      | Function       |        | 当音频数据加载完时触发                                                                                                                                                                                                                                                  |
| onloaderror | Function       |        | 当音频数据加载失败时触发。其第一个参数是音频的 ID（如果存在的话），第二个则是错误消息（message）或代码（code）。错误代码在 HTML 规范总定义如下：<br> 1 表示资源请求过程中被用户代理终止；<br> 2 表示网络错误；<br> 3 表示资源解码错误；<br> 4 表示 src 提供的资源不支持 |
| onplayerror | Function       |        | 当音频不能播放时触发。第一个参数是音频的 ID，第二个是错误消息/代码                                                                                                                                                                                                      |
| onplay      | Function       |        | 当音频开始播放时触发。第一个参数是音频的 ID                                                                                                                                                                                                                             |
| onend       | Function       |        | 当音频播放结束时触发。第一个参数是音频的 ID。<br>注意：如果是 loop 模式，那么每次播放完后都会触发。                                                                                                                                                                     |
| onpause     | Function       |        | 当音频暂停时触发。第一个参数是音频的 ID                                                                                                                                                                                                                                 |
| onstop      | Function       |        | 当音频被停止时触发。第一个参数是音频的 ID                                                                                                                                                                                                                               |
| onmute      | Function       |        | 当音频被静音或取消静音时触发。第一个参数是音频的 ID                                                                                                                                                                                                                     |
| onvolume    | Function       |        | 当音频音量变化时触发。第一个参数是音频的 ID                                                                                                                                                                                                                             |
| onrate      | Function       |        | 当音频播放速率变化时触发。第一个参数是音频的 ID                                                                                                                                                                                                                         |
| onseek      | Function       |        | 当音频跳转播放时触发。第一个参数是音频的 ID                                                                                                                                                                                                                             |
| onfade      | Function       |        | 当当前音频完成 fading in/out 时触发。第一个参数是音频的 ID                                                                                                                                                                                                              |
| onunlock    | Function       |        | 当音频通过触摸/点击事件自动解锁时触发。                                                                                                                                                                                                                                 |

#### 方法

##### 1、play：

开始播放音频。返回要与其它方法结合使用的音频 ID。唯一不能链接的方法。

- sprite/id：字符串或数字，可选。接受一个可以是 sprite 或音频 ID 的参数。
  - 如果为 sprite，则根据 sprite 的定义播放新声音。
  - 如果为音频 ID，则将播放之前的声音（例如暂停后的）。但若为已从 pool 中去除的音频 ID，则不生效。

##### 2、pause：

暂停音频或保存着播放 seek 的组。

- id：数字类型，可选。音频 ID。如果没传，所有音频组都将被暂停

##### 3、stop：

停止音频播放，并重置 seek 播放时间位置到 0。

- id：数字类型，可选。音频 ID。如果没传，所有音频组都将被停止

**注意：此时只是暂停播放，期间可修改 seek、volume 等，再次触发 play 方法即可播放。**

##### 4、mute：

让音频静音，但不暂停播放

- volume：数字类型，可选。声音范围 0-1
- id：数字类型，可选。音频 ID。如果没传，组中所有声音都将静音了

##### 5、volume：

获取或设置音频或整组音频的音量。这个方法的两个参数都是可选的。

- volume：数字类型。音量范围：0.0-1.0
- id：数字类型。音频 ID。如果没传，组中所有声音的音量都相对于它们自己的音量发生了变化

##### 6、fade：

淡化当前播放的音频从一个音量到另一个音量。当淡化完成时触发该事件

- from：数字类型。淡出开始音量
- to：数字类型。淡出结束音量
- duration：数字类型。淡出持续时间（毫秒单位）
- id：数字类型。音频 ID。如果没传，所有音频组都将被 fade

##### 7、rate：

获取或设置音频播放速率。这个方法的两个参数都是可选的。

- rate：数字类型。值范围：0.5-4.0，正常值为 1
- id：数字类型。音频 ID。如果没传，所有音频组的播放速率都将被修改

##### 8、seek：

获取或设置音频播放的位置（多少毫秒）。这个方法的两个参数都是可选的。

- seek：数字类型。要播放的时间
- id：数字类型。音频 ID，如果没传，音频组的第一个音频将被修改

**注意：必须在 onload 触发后，设置才有效**

##### 9、loop：

获取或设置是否让音频或音频组循环播放。这个方法的两个参数都是可选的。

- loop：布尔类型。设置循环还是不循环，这是一个问题
- id：数字类型。音频 ID。 如果没传，音频组所有音频都将设为更新后的 loop 值

##### 10、state：

检查 Howl 的加载状态，返回值：unloaded、loading 和 loaded 三者之一。

##### 11、playing：

检测一个音频是否正在播放。如果没有一个音频 ID 传入，请检查 Howl 组中是否有任何音频正在播放。

- id：数字类型，可选。要检测的音频 ID。

##### 12、duration：

获取音频源的总时长。会返回 0，直到 load 事件触发后。

- id：数字类型，可选。要检测的音频 ID。传入一个 ID 将返回在此实例上播放的精灵的持续时间。否则返回完整的音频媒体总时长。

##### 13、on：

监听的事件。

- event：字符串类型。事件类型包括：load、loaderror、playerror、play、end、pause、stop、mute、volume、rate、seek、fade、unlock。
- function：事件回调
- id：数字类型，可选。只监听该音频的相关事件。

##### 14、once：

和 on 一样，只会触发一次。

##### 15、load：

这是默认调用的，但如果将 preload 设为 false，则必须调用此 load 方法，然后才能播放音频。

##### 16、unload：

卸载并销毁 Howl 对象。这将立即停止附加的所有音频，并从缓存中删除它们。**同时触发 onstop 事件，后销毁所有事件**

#### 全局配置

| 属性          | 类型    | 默认值         | 含义                                                                                                                                                  |
| ------------- | ------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| usingWebAudio | Boolean |                | 如果 Web Audio 可用，该值为 true                                                                                                                      |
| noAudio       | Boolean |                | 如果没有音频可用，该值为 true                                                                                                                         |
| autoUnlock    | Boolean | true           | 自动尝试在移动设备和桌面端启用音频                                                                                                                    |
| html5PoolSize | Number  | 10             | 每个 HTML5 Audio 对象都必须单独解锁，因此我们保留一个全局解锁节点池，以便在所有 Howl 实例之间共享。该池在对此用户交互时创建，并设置该属性值为它的大小 |
| autoSuspend   | Boolean | true           | 在 30 秒不活动后自动暂停 Web Audio AudioContext，以减少资源占用。新播放时自动恢复。设置此属性为 false，以禁用这一行为。                               |
| ctx           | Boolean | Web Audio Only | 暴露 Web Audio API 的 AudioContext 上下文对象                                                                                                         |
| masterMain    | Boolean | Web Audio Only | 暴露 Web Audio 的 master GainNode。这对于编写插件或高级用法很有用                                                                                     |

#### 全局方法

以下方法用于全局修改所有音频，并从 Howler 对象上调用。

##### 1、mute：

- muted：true 表示静音，false 不静音。

##### 2、stop：

停止所有音频播放，并重置播放时间为 0。

##### 3、volume：

获取或设置 volume 音量。

##### 4、codecs：

检测支持的音频编解码器。如果编解码器支持当前浏览器，返回 true。

- ext：字符串类型文件拓展名。可选值：mp3、mpeg、opus、ogg、oga、wav、aac、caf、m4a、m4b、mp4、weba、webm、dolby、flac。

##### 5、unload：

前文已述。

### 九、插件：Spatial

#### 配置选项

| 属性          | 类型     | 默认值  | 含义 |
| ------------- | -------- | ------- | ---- |
| orientation   | Array    | [1,0,0] |      |
| stereo        | Number   | null    |      |
| pos           | Array    | null    |      |
| pannerAttr    | Object   |         |      |
| onstereo      | Function |         |      |
| onpos         | Function |         |      |
| onorientation | Function |         |      |

#### 方法

##### 1、stereo：

##### 2、pos：

##### 3、orientation：

##### 4、pannerAttr：

#### 全局方法

##### 1、stereo：

##### 2、pos：

##### 3、orientation：

##### 4、pannerAttr：

### 十、组播放

每个新的 Howl 实例也是一个组。你可以播放来自 Howl 的多个声音，并单独作为一组控制它们。例如，下面播放来自一个精灵（片段）的两个声音，一起改变它们的声音，然后同时暂停它们。

```
var sound = new Howl({
	src: ['sound.webm', 'sound.mp3'],
	sprite: {
		track01: [0 , 20000],
		track02: [21000 , 41000],
	}
})
//播放每个track
sound .play('track01')
sound.play('track02')

//改变两个轨道的声音
sound.volume(0.5)

//暂停这个组里的所有track音频
sound.pause();
```

### 十一、移动端/Chrome 播放

默认情况下，移动端浏览器和 Chrome/Safari 上的音频被锁定，直到用户交互才会播放音频，然后页面会话的其它部分正常播放（Apple 文档）。howler.js 的默认行为是尝试通过在第一个 touchend 事件上播放空缓冲区来静默解锁音频播放。可以通过如下代码禁用此行为。

```
Howler.autoUnlock = false; //不自动解锁
```

如果你尝试在页面加载后自动播放音频，你可以监听 playerror 事件，然后等待 unlock 事件触发，并尝试再次播放这段音频。

```
var sound = new Howl({
	src: ['sound.webm', 'sound.mp3'],
	onplayerror(){
		sound.once('unlock', () => {
			sound.play()
		})
	}
})
```

### 十二、杜比音频播放

全面支持杜比音频格式的播放（目前支持 Edge 和 Safari）。但是，你必须指定要加载的文件时杜比音频文件，因为它位于 mp4 容器中。

```
var dolbySound = new Howl({
	src: ['sound.mp4', 'sound.webm', 'sound.mp3'],
	format: ['dolby', 'webm', 'mp3']
})
```

### 十三、格式推荐

Howler.js 支持各种具有不同浏览器支持的音频编解码器（mp3、opus、ogg、wav、aac、m4a、m4b、mp4、webm 等），但如果你想要完整的浏览器覆盖，你仍然需要至少使用其中两个。如果您的目标是在小文件大小和高质量之间取得最佳平衡，根据广泛的生产测试，你最好的选择是默认使用 webm，并回退到 mp3。webm 具有几乎完整的浏览器覆盖范围，具有压缩和质量的完美结合。你好需要 IE 的 mp3 回退。

请务必记住，howler.js 从你的源数组中选择第一个兼容的音频。因此，如果你希望在 mp3 之前使用 webm，则需要按此顺序放置源。

如果你希望您的 webm 文件可以再 FireFox 中查找，请务必使用提示元素对它们进行编码。一种方法是在 ffmpeg 中使用破折号标志：

```
ffmpeg -i sound1.wav -dash 1 sound1.webm
```
