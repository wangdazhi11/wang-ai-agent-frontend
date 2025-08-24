# 🚀 AI学习规划与智能体前端

一个现代化的AI学习规划大师和超级智能体前端应用，提供个性化的学习路径规划和多工具智能协作功能。

## ✨ 主要功能

### 🎓 学习规划大师
- **个性化学习路径**：基于目标与时间，生成阶段目标、每日清单、里程碑与复盘提醒
- **智能建议**：提供学习资源推荐、时间安排建议和进度跟踪
- **Markdown渲染**：支持丰富的文本格式，包括标题、列表、代码块等
- **实时流式响应**：后端SSE推流，前端即时呈现，让等待不再漫长

### 🤖 超级智能体
- **多工具协作**：整合检索、总结、格式转换与自动化执行
- **分步推理**：复杂任务分解为可执行的步骤
- **自动化执行**：减少重复劳动，专注关键工作
- **智能格式化**：自动处理转义字符，优化链接和步骤显示

## 🛠️ 技术特性

### 前端技术栈
- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Vite** - 下一代前端构建工具
- **Marked** - Markdown解析器
- **Highlight.js** - 代码语法高亮

### 核心功能
- **流式响应处理**：支持Server-Sent Events (SSE)和Fetch API回退
- **智能内容去重**：防止流式数据重复显示
- **Markdown渲染**：完整的Markdown支持，包括代码高亮
- **响应式设计**：适配桌面端和移动端
- **动画效果**：流畅的页面切换和交互动画

### 样式特性
- **现代化UI**：简洁美观的界面设计
- **平滑动画**：页面加载、元素悬停、消息显示动画
- **自定义滚动条**：美观的滚动条样式
- **渐变效果**：卡片、按钮等元素的渐变背景

## 📦 安装与运行

### 环境要求
- Node.js 22.x 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🚀 部署

### Docker部署
```bash
# 构建镜像
docker build -t wang-ai-agent-frontend .

# 运行容器
docker run -p 80:80 wang-ai-agent-frontend
```

### Vercel部署
项目已配置vercel.json，可直接部署到Vercel平台。

## 📁 项目结构

```
wang-ai-agent-frontend1/
├── src/
│   ├── components/
│   │   ├── ChatRoom.vue          # 聊天室组件
│   │   └── MarkdownTest.vue      # Markdown测试组件
│   ├── pages/
│   │   ├── Home.vue              # 首页
│   │   ├── StudyApp.vue          # 学习规划页面
│   │   ├── ManusApp.vue          # 智能体页面
│   │   └── MarkdownTestPage.vue  # Markdown测试页面
│   ├── api/
│   │   └── chat.js               # API接口
│   ├── config/
│   │   └── env.js                # 环境配置
│   ├── styles/
│   │   └── theme.css             # 主题样式
│   ├── App.vue                   # 根组件
│   └── main.js                   # 入口文件
├── public/                       # 静态资源
├── dist/                         # 构建输出
├── package.json                  # 项目配置
├── vite.config.js               # Vite配置
├── vercel.json                  # Vercel配置
├── nginx.conf                   # Nginx配置
└── Dockerfile                   # Docker配置
```

## 🔧 配置说明

### 环境变量
在 `src/config/env.js` 中配置API基础URL：
```javascript
export const API_BASE_URL = 'https://your-api-domain.com/api'
```

### API接口
- 学习规划：`/ai/studyApp/chat/sse`
- 智能体：`/ai/manus/chat`

## 🎨 功能亮点

### 1. 智能内容处理
- 自动修复Markdown格式问题
- 处理转义字符（\n, \t, \r）
- 智能链接格式化
- 空行优化处理

### 2. 流式响应优化
- 防止内容重复显示
- 支持多种数据格式（JSON、SSE、纯文本）
- 自动回退机制
- 实时滚动到底部

### 3. 用户体验
- 平滑的动画效果
- 响应式设计
- 直观的交互反馈
- 美观的界面设计

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**得志的AI工具** - 专注于AI学习与工作效率提升

## 🙏 致谢

感谢我自己！

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
