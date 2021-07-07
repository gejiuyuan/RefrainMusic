import { camelize } from "@utils/index";

export declare interface APIParserClass {
  meta: PlainObject;
  api: string;
  realApi: string;
  createRealApi(): string;
  parseUrl2Meta(): void;
  createMeta(c: PlainObject): PlainObject;
}

export default class ApiParser implements APIParserClass {
  static metaKeys: string[] = ["url", "id", "api", "server", "type"];

  static defaultApi =
    "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r";

  public meta!: PlainObject;

  public api!: string;

  public realApi!: string;

  constructor(config: PlainObject) {
    this.init(config);
  }

  init(config: PlainObject) {
    this.meta = this.createMeta(config);
    this.api = this.meta.api || ApiParser.defaultApi;
    this.meta.url && this.parseUrl2Meta();
    this.realApi = this.createRealApi();
  }

  createRealApi() {
    const { meta } = this;
    const apiUrl = this.api
      .replace(":server", meta.server)
      .replace(":type", meta.type)
      .replace(":id", meta.id)
      .replace(":r", Math.random().toString());
    return apiUrl;
  }

  parseUrl2Meta() {
    const rules = [
      ["music.163.com.*song.*id=(\\d+)", "netease", "song"],
      ["music.163.com.*album.*id=(\\d+)", "netease", "album"],
      ["music.163.com.*artist.*id=(\\d+)", "netease", "artist"],
      ["music.163.com.*playlist.*id=(\\d+)", "netease", "playlist"],
      ["music.163.com.*discover/toplist.*id=(\\d+)", "netease", "playlist"],
      ["y.qq.com.*song/(\\w+).html", "tencent", "song"],
      ["y.qq.com.*album/(\\w+).html", "tencent", "album"],
      ["y.qq.com.*singer/(\\w+).html", "tencent", "artist"],
      ["y.qq.com.*playsquare/(\\w+).html", "tencent", "playlist"],
      ["y.qq.com.*playlist/(\\w+).html", "tencent", "playlist"],
      ["xiami.com.*song/(\\w+)", "xiami", "song"],
      ["xiami.com.*album/(\\w+)", "xiami", "album"],
      ["xiami.com.*artist/(\\w+)", "xiami", "artist"],
      ["xiami.com.*collect/(\\w+)", "xiami", "playlist"],
    ];

    const { meta } = this;
    const { url } = meta;

    for (const rule of rules) {
      const reg = new RegExp(rule[0]);
      const res = reg.exec(url);
      if (res !== null) {
        meta.server = rule[1];
        meta.type = rule[2];
        meta.id = res[1];
        return;
      }
    }
  }

  createMeta(config: PlainObject): PlainObject {
    const meta = {} as PlainObject;
    Object.keys(config).forEach((key) => (config[camelize(key)] = config[key]));
    ApiParser.metaKeys.forEach((key) => (meta[key] = config[key]));
    return meta;
  }
}
