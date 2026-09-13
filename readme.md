# 我的个人网站

个人网站，用于记录项目和学习笔记。项目与笔记的正文都放在外部平台，本站只做索引和跳转。

## 技术栈

- HTML5
- CSS3
- 原生 JavaScript

零依赖，不需要 npm，也不需要构建工具。

## 目录结构

```text
my-first-blog/
├── index.html              首页
├── script.js               项目和笔记的数据 + 渲染 + 分页
├── assets/
│   └── css/
│       └── style.css       全站公共样式
├── projects/
│   └── index.html          项目索引页（每页 5 个）
├── notes/
│   └── index.html          笔记索引页（每页 5 篇）
└── readme.md
```

## 怎么新增一条项目或笔记

只需要改 `script.js`，HTML 不用动。

在 `projects` 或 `notes` 数组里加一条：

```js
{
    title: "标题",
    description: "一句话简介",
    date: "2026-09-12",
    url: "https://外部链接",
    tags: ["Python", "PyTorch"]
}
```

`tags` 是技术栈标签数组。不需要标签就写 `tags: []`，那一行标签区会自动不显示。

标签顺序就是数组顺序，不会自动排序。

保存后，页面会自动：

- 按 `date` 倒序排列
- 首页取最新的 3 条（数量由 `HOME_LIMIT` 控制）
- 索引页显示全部并自动分页（每页条数由 `ITEMS_PER_PAGE` 控制）

## 本地预览

直接用浏览器打开 `index.html` 即可，不需要起服务器。

## 部署到 GitHub Pages

1. 把仓库推送到 GitHub
2. 进入仓库的 Settings → Pages
3. Source 选择 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`
4. 等一两分钟，访问 `https://用户名.github.io/仓库名/`

所有链接都用的相对路径，放在子目录下也能正常加载 CSS 和 JavaScript。
