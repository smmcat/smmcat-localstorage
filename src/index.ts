import { Context, Schema, Service } from 'koishi'
import { getOrCreateFile, setOrCreateFile } from './fileUtils'
import path from 'path'
export const name = 'smmcat-localstorage'

export interface Config {
  upath: string
}
export const usage = `
大型数据建议使用数据库进行本地存储数据，

只是存储简单的数据可以考虑使用本服务

为用户提供类似 HTML 的 简单本地存储的效果
***
\`\`\`

ctx.localStorage.getItem(key) // 取数据 (字符串)
ctx.localStorage.setItem(key,str) // 存数据 (字符串)


\`\`\`
***
不计划对基础功能进行画蛇添足
如要存储对象，请搭配使用 \`JSON.stringify()\` 和  \`JSON.parse()\` 
`

export const Config: Schema<Config> = Schema.object({
  upath: Schema.string().default('./data/localStorage').description('本地存储数据指向的文件夹'),
})

declare module 'koishi' {
  interface Context {
    localstorage: localstorageClass
  }
}

class localstorageClass extends Service {
  basePath: string | null;
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;

  constructor(ctx: Context, config: Config) {
    super(ctx, 'localstorage', true);
    // 设置基地址
    this.basePath = path.join(ctx.baseDir, config.upath);
    this.setItem = async (key: string, value: string) => { };
    this.getItem = async (key: string) => { return null };

    ctx.on('ready', () => {
      // 存储数据
      this.getItem = async (key: string) => {
        if (!this.basePath) return null
        return await getOrCreateFile(path.join(this.basePath, key));
      };
      // 读取数据
      this.setItem = async (key: string, value: string) => {
        if (!this.basePath) return
        await setOrCreateFile(path.join(this.basePath, key), value);
      };
    });
  }
}


export function apply(ctx: Context, config: Config) {
  ctx.plugin(localstorageClass, config)
}
