# guide

#### 介绍
导航项目

#### 浏览器插件（管理导航 + git 提交推送）

本项目自带一个 Chrome/Edge 扩展，用于管理 `js/data.js` 中的导航地址：

- 查看/修改/删除/新增导航地址，支持新建分类、筛选、跨分类移动
- 一键将当前浏览的页面加入导航（弹窗预填 或 网页右键「添加到 Guide 导航」）
- 触发 `git add -A && git commit && git push`（本地宿主脚本执行，走本机 git 凭据）
- 每次保存前自动备份为 `js/data.js.bak`

**安装**（需已安装 Node.js 与 git）：

```bash
node native-host/install.js
```

然后打开 `chrome://extensions`（Edge 为 `edge://extensions`）→ 开启「开发者模式」→「加载已解压的扩展程序」→ 选择本仓库的 `extension` 目录。

**卸载**：

```bash
node native-host/install.js --uninstall
```

（再在浏览器扩展页移除扩展即可。）

**目录说明**

| 路径 | 用途 |
| --- | --- |
| `extension/` | 浏览器扩展（MV3，未打包加载） |
| `native-host/` | 本地宿主脚本 + 安装器 + 测试 |
| `js/data.js` | 导航数据唯一数据源（插件与页面共用，可手动编辑） |

**原理**：扩展通过 Chrome Native Messaging（注册表 `HKCU\...\NativeMessagingHosts\com.dayandnight.guide`，仅当前用户、无需管理员）启动 `native-host/host.bat`，由宿主解析/再生成 `js/data.js` 并执行 git 命令。扩展 ID 已通过 `manifest.json` 中的 key 固定，重装/更新不会失效。

**常见问题**

- 提示无法连接本地宿主：重新运行 `node native-host/install.js` 并重启浏览器
- 推送失败提示 `Failed to connect to github.com`：github 间歇性断连，宿主会自动重试 3 次；仍失败时本地提交已保留，网络恢复后再点一次「保存并推送」即可补推
- 第一次推送可能弹出 GitHub 登录窗口（Git Credential Manager），完成一次后凭据缓存，之后推送无感
- 远端有新提交导致推送被拒：先在终端 `git pull` 再推送
- 测试宿主：`node native-host/test-host.js`


#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
