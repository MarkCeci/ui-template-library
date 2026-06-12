# 美央内部视觉风格库预览说明

## 这是什么

这是当前网站的预览包，用于在另一台电脑本地打开和查看。

## 如何预览

1. 解压压缩包。
2. 打开终端，进入解压后的项目文件夹。
3. 执行：

```bash
npm install
npm run dev
```

4. 看到终端提示后，在浏览器打开：

```text
http://localhost:3000
```

如果 3000 端口被占用，终端会提示新的端口，例如 `http://localhost:3001`，按终端显示的地址打开即可。

## 常用页面

- 首页：`/`
- 风格广场：`/styles`
- 风格捕捉：`/style-capture`
- 设计维护台：`/design-guide`
- 开发者入口：`/developer`
- 主题接入说明：`/developer/theme-usage`

## 注意

- 第一版不接数据库，设计维护台和风格捕捉保存的草稿会存在当前浏览器的 localStorage。
- 换电脑后，之前本机浏览器里的草稿不会自动带过去，除非先导出 JSON 再导入或手动合并。
- 本包不包含 `node_modules`，所以第一次打开需要执行 `npm install`。
