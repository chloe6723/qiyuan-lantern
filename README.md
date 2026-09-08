# 祈愿灯

一个以古风夜境承载心愿的沉浸式愿望记录项目。用户可以写下愿望，让灯火替自己珍藏，并在日后重新回望。

本仓库同时保留两个独立版本；不同版本放在不同分支中，互不覆盖。

## 版本总览

| 版本 | 对应分支 | 在线网页 | 定位 | 主要内容 |
| --- | --- | --- | --- | --- |
| **祈愿灯 · 星夜幻境** | [`main`](https://github.com/chloe6723/wish-lantern/tree/main) | [打开网页](https://yuan-deng-wishes.chenxiaoyi6723.chatgpt.site/) | 简洁的孔明灯许愿体验 | 写愿、选择灯色、放飞孔明灯、回顾愿望、祈愿簿、长按移动 |
| **祈愿灯 · 水月新境** | [`shuiyue-new-realm`](https://github.com/chloe6723/wish-lantern/tree/shuiyue-new-realm) | [打开网页](https://qiyuan-lotus-wishes.chenxiaoyi6723.chatgpt.site/) | 扩展后的山水夜境版本 | 孔明灯与莲花灯双模式、江南水月场景、动态月相、愿望编辑与删除 |

## 祈愿灯 · 星夜幻境

**版本定位：** 以夜空和孔明灯为核心的第一版愿望记录应用。

[在线体验「祈愿灯 · 星夜幻境」](https://yuan-deng-wishes.chenxiaoyi6723.chatgpt.site/)

- 写下并放飞孔明灯愿望
- 琥珀、赭红、象牙三种灯色
- 单击灯火查看愿望详情
- 长按并拖动已放飞的灯
- 在“祈愿簿”集中查看记录
- 浏览器本地保存
- 桌面端与移动端适配

当前默认分支 `main` 保存这一版的完整源码和第一版 PRD。

## 祈愿灯 · 水月新境

**版本定位：** 在第一版的许愿体验上，加入山水、月相与水灯意象的第二主题版本。

[在线体验「祈愿灯 · 水月新境」](https://qiyuan-lotus-wishes.chenxiaoyi6723.chatgpt.site/)

- 孔明灯与莲花灯两种祈愿方式
- 江南雾山、古塔、石桥、夜河与乌篷船场景
- 240 帧纹理月相循环动画
- 不规则分布的氛围孔明灯
- 莲花灯限定在安全水域，避开乌篷船
- 单击查看愿望，长按移动灯的位置
- 祈愿簿支持查看、修改和删除
- 修改愿望时保留原始许愿日期
- 敦煌莲花与花草纹饰

请切换至 [`shuiyue-new-realm` 分支](https://github.com/chloe6723/wish-lantern/tree/shuiyue-new-realm) 查看源码、素材和对应 PRD。

## 两个版本的区别

- **星夜幻境**更轻、更纯粹，只围绕孔明灯展开。
- **水月新境**拥有更完整的山水场景，同时支持天空与水面两种祈愿方式。
- 两个分支独立维护，切换分支不会改变另一个版本。
- 两个版本当前都使用浏览器本地存储，不支持账号登录和跨设备同步。

## 技术栈

- React 19 + TypeScript
- Vinext / Vite
- Tailwind CSS + shadcn/ui
- LocalStorage 本地持久化

## 本地运行

```bash
pnpm install
pnpm dev
```

构建生产版本：

```bash
pnpm build
```
