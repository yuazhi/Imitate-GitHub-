# 个人网站模板

这是一个基于纯前端技术构建的个人网站模板，支持展示项目、文章、动态等内容。

## 功能特点

- 项目展示：支持展示GitHub项目，包括star数、fork数等信息
- 文章系统：支持展示博客文章
- 动态系统：支持展示个人动态
- 友情链接：支持展示友链
- 响应式设计：适配各种设备屏幕
- 暗色模式：支持自动切换暗色/亮色主题

## 快速开始

1. 克隆项目
```bash
git clone [项目地址]
```

2. 配置
在 `main.js` 文件中配置以下信息：
- GitHub API配置
- Memos API配置（如果需要）
- 文章API配置（如果需要）
- 项目数据
- 友情链接数据

3. 部署
将项目部署到任意静态网站托管服务，如GitHub Pages、Vercel等。

## 配置说明

### GitHub配置
```javascript
const GITHUB_USERNAME = ''; // 你的GitHub用户名
const GITHUB_TOKEN = ''; // 你的GitHub Token
```

### Memos配置（可选）
```javascript
const MEMOS_API_BASE = ''; // Memos API地址
const MEMOS_TOKEN = ''; // Memos Token
```

### 文章API配置（可选）
```javascript
const ARTICLES_API_CONFIG = {
    URL: "", // 文章API地址
    // ... 其他配置
};
```

## 自定义

### 修改样式
- 主要样式文件：`css.css`
- 代码高亮主题：`github.min.css` 和 `github-dark.min.css`

### 添加新功能
1. 在 `main.js` 中添加新的功能模块
2. 在 `index.html` 中添加对应的HTML结构
3. 在 `css.css` 中添加相应的样式

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License 