<template>
  <div class="markdown-test">
    <h2>Markdown渲染测试</h2>
    
    <div class="test-section">
      <h3>测试1: 基本Markdown格式</h3>
      <div class="bubble-markdown" v-html="renderMarkdown(basicMarkdown)"></div>
    </div>
    
    <div class="test-section">
      <h3>测试2: 代码块</h3>
      <div class="bubble-markdown" v-html="renderMarkdown(codeMarkdown)"></div>
    </div>
    
    <div class="test-section">
      <h3>测试3: 空行处理</h3>
      <div class="bubble-markdown" v-html="renderMarkdown(emptyLinesMarkdown)"></div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
  headerPrefix: '',
  langPrefix: 'language-',
  pedantic: false,
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.warn('Highlight.js error:', err)
      }
    }
    return hljs.highlightAuto(code).value
  }
})

// 处理空行的函数
function removeEmptyLines(text) {
  if (!text) return text
  
  // 1. 将连续的多个空行替换为最多两个空行
  let cleaned = text.replace(/\n\s*\n\s*\n+/g, '\n\n')
  
  // 2. 处理开头和结尾的空行
  cleaned = cleaned.replace(/^\s*\n+/, '') // 删除开头的空行
  cleaned = cleaned.replace(/\n+\s*$/, '') // 删除结尾的空行
  
  // 3. 处理行内的多余空格
  cleaned = cleaned.replace(/[ \t]+$/gm, '') // 删除每行末尾的空格和制表符
  
  return cleaned
}

// 渲染markdown的函数
function renderMarkdown(content) {
  if (!content) return ''
  // 处理空行
  const cleanedContent = removeEmptyLines(content)
  // 渲染markdown
  return marked(cleanedContent)
}

// 测试用的markdown内容
const basicMarkdown = `# 学习规划示例

## 第一阶段：基础知识学习

### 目标
- 掌握核心概念
- 建立知识体系
- 完成基础练习

### 时间安排
1. **第1周**：理论学习
2. **第2周**：实践练习
3. **第3周**：项目实战

> 重要提示：每个阶段都要进行总结和复盘

---

## 第二阶段：进阶学习

### 学习内容
- 高级特性
- 最佳实践
- 性能优化

**注意事项**：
- 保持学习的连续性
- 及时记录学习笔记
- 定期回顾和复习

[查看详细文档](https://example.com)`

const codeMarkdown = `## 代码示例

### JavaScript代码
\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}

// 使用示例
const result = calculateSum(5, 3);
console.log(result); // 输出: 8
\`\`\`

### Python代码
\`\`\`python
def calculate_sum(a, b):
    return a + b

# 使用示例
result = calculate_sum(5, 3)
print(result)  # 输出: 8
\`\`\`

### 内联代码
使用 \`console.log()\` 来输出调试信息。`

const emptyLinesMarkdown = `# 空行处理测试


这个段落前面有很多空行，应该被清理掉。



这个段落之间有多行空行，应该只保留最多两个空行。




## 子标题

这个段落后面也有很多空行，应该被清理掉。



### 代码块测试

\`\`\`javascript
// 这是一个代码块
function test() {
  console.log("Hello World");
}
\`\`\`


代码块后面也有空行，应该被清理掉。



**总结**：空行处理功能应该能够：
1. 删除开头和结尾的空行
2. 将连续的多个空行替换为最多两个空行
3. 清理行末的多余空格

`
</script>

<style scoped>
.markdown-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.test-section h3 {
  margin-top: 0;
  color: #0366d6;
}

/* 复用ChatRoom的markdown样式 */
.bubble-markdown {
  margin: 0;
  word-break: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.7;
  text-align: left;
  color: #24292e;
}

.bubble-markdown h1, .bubble-markdown h2, .bubble-markdown h3, .bubble-markdown h4, .bubble-markdown h5, .bubble-markdown h6 {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: #24292e;
}

.bubble-markdown h1 { font-size: 20px; }
.bubble-markdown h2 { font-size: 18px; }
.bubble-markdown h3 { font-size: 16px; }
.bubble-markdown h4, .bubble-markdown h5, .bubble-markdown h6 { font-size: 14px; }

.bubble-markdown p {
  margin: 8px 0;
}

.bubble-markdown ul, .bubble-markdown ol {
  margin: 8px 0;
  padding-left: 24px;
}

.bubble-markdown li {
  margin: 4px 0;
}

.bubble-markdown blockquote {
  margin: 12px 0;
  padding: 8px 12px;
  border-left: 4px solid #e1e5e9;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.bubble-markdown code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.bubble-markdown pre {
  margin: 12px 0;
  padding: 12px;
  background-color: #f6f8fa;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e1e5e9;
}

.bubble-markdown pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 13px;
  line-height: 1.5;
}

.bubble-markdown a {
  color: #0366d6;
  text-decoration: none;
}

.bubble-markdown a:hover {
  text-decoration: underline;
}

.bubble-markdown strong {
  font-weight: 600;
}

.bubble-markdown em {
  font-style: italic;
}

.bubble-markdown table {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.bubble-markdown th, .bubble-markdown td {
  border: 1px solid #e1e5e9;
  padding: 8px 12px;
  text-align: left;
}

.bubble-markdown th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.bubble-markdown hr {
  margin: 16px 0;
  border: none;
  border-top: 1px solid #e1e5e9;
}
</style>
