<template>
  <div>
    <header class="site-header">
      <nav class="nav">
        <div class="container nav-inner">
          <div class="brand"><span class="brand-badge">AI</span> 得志的AI工具</div>
          <div class="nav-links">
            <router-link to="/">首页</router-link>
            <router-link to="/study">学习规划</router-link>
            <router-link to="/manus">超级智能体</router-link>
          </div>
        </div>
      </nav>
    </header>
    <main class="container section">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
/* 全局动画效果 */
.site-header {
	animation: slideInDown 0.6s ease-out;
	position: sticky;
	top: 0;
	z-index: 100;
	backdrop-filter: blur(10px);
	background: rgba(255, 255, 255, 0.9);
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav {
	transition: all 0.3s ease;
}

.nav-inner {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 0;
}

.brand {
	font-size: 1.2rem;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.3s ease;
}

.brand:hover {
	transform: scale(1.05);
}

.brand-badge {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 0.25rem 0.5rem;
	border-radius: 6px;
	font-size: 0.8rem;
	animation: pulse 2s infinite;
}

.nav-links {
	display: flex;
	gap: 2rem;
	align-items: center;
}

.nav-links a {
	text-decoration: none;
	color: #333;
	font-weight: 500;
	position: relative;
	transition: all 0.3s ease;
	padding: 0.5rem 1rem;
	border-radius: 6px;
}

.nav-links a::before {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 2px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	transition: all 0.3s ease;
	transform: translateX(-50%);
}

.nav-links a:hover::before {
	width: 100%;
}

.nav-links a:hover {
	color: #667eea;
	background: rgba(102, 126, 234, 0.1);
	transform: translateY(-2px);
}

/* 页面切换动画 */
.section {
	animation: fadeInUp 0.6s ease-out;
}

/* 动画关键帧 */
@keyframes slideInDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

/* 全局过渡效果 */
* {
	transition: all 0.3s ease;
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.nav-links {
		gap: 1rem;
	}
	
	.nav-links a {
		padding: 0.25rem 0.5rem;
		font-size: 0.9rem;
	}
	
	.brand {
		font-size: 1rem;
	}
}
</style>