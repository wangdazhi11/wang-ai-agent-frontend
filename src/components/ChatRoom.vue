<template>
	<div class="chat-room card chat-wrapper">
		<header class="chat-head">
			<slot name="title">
				<div class="row-gap-8"><div class="avatar ai">AI</div><div><div class="card-title" style="margin:0">智能对话</div><div class="text-dim" style="font-size:12px">流式响应 · 实时生成</div></div></div>
			</slot>
		</header>
		<section class="chat-history" ref="historyRef">
			<div v-for="(msg, idx) in messages" :key="idx" :class="['bubble-row', msg.role]">
				<div v-if="msg.role==='ai'" class="avatar ai small">AI</div>
				<div v-if="msg.role==='user'" class="avatar user small">我</div>
				<div class="bubble">
					<!-- 用户消息使用普通文本显示 -->
					<pre v-if="msg.role==='user'" class="bubble-text">{{ msg.content }}</pre>
					<!-- AI消息使用markdown渲染 -->
					<div v-else class="bubble-markdown" v-html="renderMarkdown(msg.content)"></div>
				</div>
			</div>
		</section>
		<footer class="chat-input">
			<input v-model="input" @keyup.enter="send" placeholder="比如，想考河海大学电子信息专业研究生，如何学习..." />
			<button class="btn" @click="send">发送</button>
		</footer>
	</div>
</template>

<script setup>
import { ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
	chatApi: { type: String, required: true },
	sse: { type: Boolean, default: true },
	chatId: { type: String, required: false },
	multiBubble: { type: Boolean, default: false } // 新增：是否使用多气泡模式
})

const messages = ref([])
const input = ref('')
const historyRef = ref(null)
let eventSource = null
let fetchAbortController = null
let fallbackTimer = null
let receivedAnyChunk = false
let currentAiMsg = null // 当前AI消息引用

// 配置marked选项
marked.setOptions({
	breaks: true, // 允许换行符转换为<br>
	gfm: true, // 启用GitHub风格的markdown
	headerIds: false, // 禁用标题ID
	mangle: false, // 禁用标题ID转义
	headerPrefix: '', // 标题前缀
	langPrefix: 'language-', // 代码块语言前缀
	pedantic: false, // 不严格遵循markdown规范
	renderer: new marked.Renderer(), // 使用默认渲染器
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
	let cleanedContent = removeEmptyLines(content)
	
	// 预处理：修复常见的markdown格式问题
	cleanedContent = cleanedContent
		// 处理转义字符：将\n转换为实际的换行符
		.replace(/\\n/g, '\n')
		// 处理转义字符：将\t转换为制表符
		.replace(/\\t/g, '\t')
		// 处理转义字符：将\r转换为回车符
		.replace(/\\r/g, '\r')
		// 修复标题格式：确保#后面有空格
		.replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
		// 修复列表格式：确保-后面有空格（包括缩进的情况）
		.replace(/^(\s*)-([^-\s])/gm, '$1- $2')
		// 修复数字列表格式：确保数字.后面有空格（包括缩进的情况）
		.replace(/^(\s*)(\d+)\.([^\s])/gm, '$1$2. $3')
		// 修复粗体格式：确保**之间有内容
		.replace(/\*\*([^*]+)\*\*/g, '**$1**')
		// 修复代码块格式：确保```后面有换行
		.replace(/```([^`\n]*)\n/g, '```$1\n')
		// 修复行内代码格式：确保`之间有内容
		.replace(/`([^`]+)`/g, '`$1`')
		// 修复分隔线格式
		.replace(/^-{3,}$/gm, '---')
		// 修复链接格式中的空格问题
		.replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '[$1]($2)')
		// 修复冒号后的格式（确保列表项中冒号后有内容）
		.replace(/^(\s*-\s*[^:]+):([^\s])/gm, '$1: $2')
		// 修复标题后直接跟列表的格式问题
		.replace(/^(#{1,6}\s+[^\n]*)\n-/gm, '$1\n\n-')
		// 修复列表项中的特殊情况
		.replace(/^(\s*)-\s*([^-\s][^:]*):([^\s])/gm, '$1- $2: $3')
		// 处理链接：为链接添加加粗和下划线格式
		.replace(/(https?:\/\/[^\s]+)/g, '**__[$1]($1)__**')
		// 处理步骤格式：为步骤标题添加加粗
		.replace(/^(步骤\d+:)/gm, '**$1**')
		// 处理工具名称：为工具名称添加加粗
		.replace(/工具(\w+)的/g, '工具**$1**的')
	
	// 渲染markdown
	return marked(cleanedContent)
}

function scrollToBottom() {
	nextTick(() => {
		if (historyRef.value) {
			historyRef.value.scrollTop = historyRef.value.scrollHeight
		}
	})
}

function buildFinalUrl(text) {
	const url = new URL(props.chatApi, window.location.origin)
	url.searchParams.set('message', text)
	if (props.chatId) url.searchParams.set('chatId', props.chatId)
	const useAbsolute = props.chatApi.startsWith('http://') || props.chatApi.startsWith('https://')
	return useAbsolute ? `${props.chatApi}?${url.searchParams.toString()}` : `${url.pathname}?${url.searchParams.toString()}`
}

function tryAppendParsed(aiMsg, raw) {
	if (!raw) return
	let appended = false
	try {
		const trimmed = raw.trim()
		if (!trimmed) return
		
		// 调试：记录接收到的原始数据
		if (process.env.NODE_ENV === 'development') {
			console.log('收到数据:', trimmed)
		}
		
		// 检查是否是新的响应开始（多气泡模式）
		if (props.multiBubble && (trimmed.includes('[DONE]') || trimmed.includes('新的响应') || trimmed.includes('步骤') || trimmed.includes('工具'))) {
			// 如果当前消息有内容，创建新气泡
			if (aiMsg.content && aiMsg.content.trim()) {
				createNewAiBubble()
			}
		}
		
		// 处理JSON格式的数据
		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				const payload = JSON.parse(trimmed)
				const candidates = [payload?.message, payload?.data, payload?.text, payload?.content, payload?.choices?.[0]?.delta?.content, payload?.choices?.[0]?.message?.content]
				const text = candidates.find(v => typeof v === 'string')
				if (text) { 
					if (props.multiBubble && !currentAiMsg) {
						createNewAiBubble()
					}
					currentAiMsg.content += text; 
					appended = true 
					
					// 调试：记录处理后的内容
					if (process.env.NODE_ENV === 'development') {
						console.log('JSON处理后内容:', text)
					}
				}
			} catch {}
		}
		
		// 处理message:格式的数据
		if (!appended && trimmed.startsWith('message:')) { 
			if (props.multiBubble && !currentAiMsg) {
				createNewAiBubble()
			}
			const text = trimmed.slice(8).trimStart()
			currentAiMsg.content += text; 
			appended = true 
			
			// 调试：记录处理后的内容
			if (process.env.NODE_ENV === 'development') {
				console.log('message处理后内容:', text)
			}
		}
		
		// 处理data:格式的数据
		if (!appended && trimmed.startsWith('data:')) { 
			if (props.multiBubble && !currentAiMsg) {
				createNewAiBubble()
			}
			const text = trimmed.slice(5).trimStart()
			currentAiMsg.content += text; 
			appended = true 
			
			// 调试：记录处理后的内容
			if (process.env.NODE_ENV === 'development') {
				console.log('data处理后内容:', text)
			}
		}
		
		// 处理纯文本数据
		if (!appended) { 
			if (props.multiBubble && !currentAiMsg) {
				createNewAiBubble()
			}
			currentAiMsg.content += trimmed 
			
			// 调试：记录处理后的内容
			if (process.env.NODE_ENV === 'development') {
				console.log('纯文本处理后内容:', trimmed)
			}
		}
	} finally { scrollToBottom() }
}

function createNewAiBubble() {
	// 创建新的AI气泡
	currentAiMsg = reactive({ role: 'ai', content: '' })
	messages.value.push(currentAiMsg)
	scrollToBottom()
}

async function startFetchSSE(finalUrl, aiMsg) {
	try {
		fetchAbortController = new AbortController()
		const res = await fetch(finalUrl, { method:'GET', headers:{ 'Accept':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive' }, signal: fetchAbortController.signal, credentials:'same-origin' })
		if (!res.ok || !res.body) { 
			if (props.multiBubble && currentAiMsg) {
				currentAiMsg.content = `连接失败：${res.status} ${res.statusText}`
			} else {
				aiMsg.content = `连接失败：${res.status} ${res.statusText}`
			}
			scrollToBottom(); 
			return 
		}
		const reader = res.body.getReader(); 
		const decoder = new TextDecoder('utf-8'); 
		let buffer = ''
		let processedLines = new Set() // 用于去重，按行去重
		
		while (true) { 
			const { value, done } = await reader.read(); 
			if (done) break; 
			receivedAnyChunk = true; 
			buffer += decoder.decode(value, { stream:true }); 
			
			// 按行分割，更精确地处理数据
			const lines = buffer.split(/\r?\n/)
			buffer = lines.pop() || '' // 保留最后一行（可能不完整）
			
			for (const line of lines) {
				const trimmedLine = line.trim()
				if (!trimmedLine) continue
				
				// 检查是否已经处理过这行数据
				if (processedLines.has(trimmedLine)) continue
				processedLines.add(trimmedLine)
				
				// 处理SSE格式的数据
				if (trimmedLine.startsWith('data:') || trimmedLine.startsWith('message:')) {
					tryAppendParsed(aiMsg, trimmedLine)
				} else if (trimmedLine.startsWith('{') || trimmedLine.startsWith('[')) {
					// 处理JSON格式数据
					tryAppendParsed(aiMsg, trimmedLine)
				} else if (trimmedLine !== '[DONE]') {
					// 处理纯文本数据
					tryAppendParsed(aiMsg, trimmedLine)
				}
			}
		}
		
		// 处理剩余的buffer内容
		const rest = buffer.trim()
		if (rest && !processedLines.has(rest)) {
			tryAppendParsed(aiMsg, rest)
		}
	} catch (err) { 
		console.error('SSE处理错误:', err)
		if (props.multiBubble && currentAiMsg && !currentAiMsg.content) {
			currentAiMsg.content = '连接失败：SSE 回退也未收到数据'
		} else if (!aiMsg.content) {
			aiMsg.content = '连接失败：SSE 回退也未收到数据'
		}
		scrollToBottom() 
	}
}

function send() {
	const text = input.value.trim(); if (!text) return
	messages.value.push({ role:'user', content: text })
	input.value = ''; scrollToBottom()
	if (!props.sse) return
	if (eventSource) try{ eventSource.close() }catch{}; if (fetchAbortController) try{ fetchAbortController.abort() }catch{}; if (fallbackTimer) clearTimeout(fallbackTimer)
	receivedAnyChunk = false
	const finalUrl = buildFinalUrl(text)
	
	// 根据模式创建AI消息
	if (props.multiBubble) {
		currentAiMsg = reactive({ role:'ai', content:'' })
		messages.value.push(currentAiMsg)
	} else {
		const aiMsg = reactive({ role:'ai', content:'' })
		messages.value.push(aiMsg)
		currentAiMsg = aiMsg
	}
	
	const handleMessage = (e)=>{
		receivedAnyChunk = true; 
		if (e.data === '[DONE]'){ 
			try{eventSource.close()}catch{}; 
			return 
		} 
		tryAppendParsed(currentAiMsg, e.data) 
	}
	try{ eventSource = new EventSource(finalUrl) }catch(e){ startFetchSSE(finalUrl, currentAiMsg); return }
	// 只使用一个事件监听器，避免重复处理
	eventSource.onmessage = handleMessage
	eventSource.onerror = ()=>{ try{eventSource.close()}catch{}; if (!receivedAnyChunk) startFetchSSE(finalUrl, currentAiMsg) }
	fallbackTimer = setTimeout(()=>{ if(!receivedAnyChunk){ try{eventSource.close()}catch{}; startFetchSSE(finalUrl, currentAiMsg) } }, 1500)
}

onBeforeUnmount(()=>{ if (eventSource) try{eventSource.close()}catch{}; if(fetchAbortController) try{fetchAbortController.abort()}catch{}; if (fallbackTimer) clearTimeout(fallbackTimer) })
</script>

<style scoped>
.chat-room{ 
	display:flex; 
	flex-direction:column; 
	border:1px solid var(--border); 
	border-radius:16px; 
	background: linear-gradient(180deg, var(--card), var(--card-2)); 
	box-shadow: var(--shadow); 
	overflow:hidden;
	animation: slideInUp 0.6s ease-out;
}

.chat-head{ 
	padding:14px 16px; 
	border-bottom:1px solid var(--border);
	animation: fadeInDown 0.5s ease-out 0.1s both;
}

.chat-history{ 
	flex:1; 
	overflow:auto; 
	padding:16px;
	scroll-behavior: smooth;
}

.chat-input{ 
	border-top:1px solid var(--border); 
	padding:12px; 
	display:flex; 
	gap:10px; 
	background: rgba(255,255,255,.7);
	animation: slideInUp 0.5s ease-out 0.2s both;
}

.chat-input input{ 
	flex:1; 
	padding:12px 14px; 
	border-radius:10px; 
	border:1px solid var(--border); 
	background:#fff; 
	color:var(--text);
	transition: all 0.3s ease;
}

.chat-input input:focus {
	border-color: #409eff;
	box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
	transform: translateY(-1px);
}

.chat-input .btn {
	transition: all 0.3s ease;
}

.chat-input .btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bubble-row{ 
	display:flex; 
	gap:10px; 
	align-items:flex-start; 
	margin:12px 0;
	animation: slideInLeft 0.5s ease-out;
	opacity: 0;
	animation-fill-mode: forwards;
}

.bubble-row.user{ 
	flex-direction: row-reverse;
	animation: slideInRight 0.5s ease-out;
}

.bubble-row:nth-child(1) { animation-delay: 0.1s; }
.bubble-row:nth-child(2) { animation-delay: 0.2s; }
.bubble-row:nth-child(3) { animation-delay: 0.3s; }
.bubble-row:nth-child(4) { animation-delay: 0.4s; }
.bubble-row:nth-child(5) { animation-delay: 0.5s; }
.bubble-row:nth-child(6) { animation-delay: 0.6s; }
.bubble-row:nth-child(7) { animation-delay: 0.7s; }
.bubble-row:nth-child(8) { animation-delay: 0.8s; }
.bubble-row:nth-child(9) { animation-delay: 0.9s; }
.bubble-row:nth-child(10) { animation-delay: 1.0s; }

.avatar.small{ 
	width:32px; 
	height:32px; 
	font-size:12px;
	transition: all 0.3s ease;
}

.avatar.small:hover {
	transform: scale(1.1);
}

.bubble{ 
	max-width:min(78%, 720px); 
	border:1px solid var(--border); 
	background: #f5f7fb; 
	padding:10px 12px; 
	border-radius:12px;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.bubble::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
	transition: left 0.5s ease;
}

.bubble:hover::before {
	left: 100%;
}

.bubble-row.user .bubble{ 
	background: rgba(47,106,255,.10); 
	border-color: rgba(47,106,255,.30);
}

.bubble-row.user .bubble:hover {
	background: rgba(47,106,255,.15);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(47,106,255,0.2);
}

.bubble-text{ 
	margin:0; 
	white-space:pre-wrap; 
	word-break:break-word; 
	font-family: inherit; 
	font-size:14px; 
	line-height:1.7; 
	text-align:left; 
	color:var(--text);
}

.bubble-markdown{ 
	margin:0; 
	word-break:break-word; 
	font-family: inherit; 
	font-size:14px; 
	line-height:1.7; 
	text-align:left; 
	color:var(--text);
}

/* 动画关键帧 */
@keyframes slideInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-30px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes slideInRight {
	from {
		opacity: 0;
		transform: translateX(30px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 滚动条样式 */
.chat-history::-webkit-scrollbar {
	width: 6px;
}

.chat-history::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.05);
	border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 3px;
	transition: background 0.3s ease;
}

.chat-history::-webkit-scrollbar-thumb:hover {
	background: rgba(0, 0, 0, 0.3);
}

/* Markdown样式 */
.bubble-markdown h1, .bubble-markdown h2, .bubble-markdown h3, .bubble-markdown h4, .bubble-markdown h5, .bubble-markdown h6 {
	margin: 16px 0 8px 0;
	font-weight: 600;
	color: var(--text);
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

@media (max-width: 768px){ 
	.bubble{ 
		max-width: 86%;
	}
	
	.bubble-row {
		animation-duration: 0.3s;
	}
}
</style>