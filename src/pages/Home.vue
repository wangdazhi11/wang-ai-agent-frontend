<template>
  <section class="section">
    <!-- 顶部学习主题横幅 -->
    <div class="landing-hero">
      <div class="bg"></div>
      <div class="fg">
        <div class="badge">AI助手</div>
        <h2 class="landing-title">学习规划大师</h2>
        <p class="landing-sub">王大志</p>
        <div class="cta-group">
          <router-link to="/study" class="btn">立即体验学习规划</router-link>
          <router-link to="/manus" class="btn secondary">试试超级智能体</router-link>
          <a class="btn ghost" href="https://example.com" target="_blank">查看文档</a>
          <router-link to="/markdown-test" class="btn ghost">测试Markdown</router-link>
        </div>
        <div class="stats">
          <span class="pill">多端自适应</span>
          <span class="pill">流式响应</span>
          <span class="pill">轻量快速</span>
        </div>
      </div>
    </div>

    <!-- 亮点功能区块 -->
    <div class="features">
      <div class="feature">
        <div class="row-gap-8"><div class="avatar study">学</div><h4>个性化学习路径</h4></div>
        <p>你可以根据学习的内容进行学习规划</p>
      </div>
      <div class="feature">
        <div class="row-gap-8"><div class="avatar manus">智</div><h4>多工具智能体</h4></div>
        <p>AI智能体整合相关工具，为你提供各种的帮助。</p>
      </div>
      <div class="feature">
        <div class="row-gap-8"><div class="avatar ai">AI</div><h4>实时流式反馈</h4></div>
        <p>点击对话窗快试试吧</p>
      </div>
    </div>

    <!-- 预览骨架（增强高阶感） -->
    <div class="preview mt-20">
      <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
      <div class="body">
        <div class="skel" style="width:60%"></div>
        <div class="skel" style="width:86%"></div>
        <div class="skel" style="width:72%"></div>
        <div class="skel" style="width:52%"></div>
      </div>
    </div>

    <!-- 应用入口卡片 -->
    <div class="grid mt-20">
      <article class="card">
        <div class="row-gap-8">
          <div class="avatar study">学</div>
          <div>
            <h3 class="card-title">学习规划大师</h3>
            <p class="card-desc">系统化制定学习计划与每日任务，适配不同阶段目标。</p>
          </div>
        </div>
        <router-link to="/study" class="btn" style="margin-top:12px; display:inline-flex;">进入对话</router-link>
      </article>

      <article class="card">
        <div class="row-gap-8">
          <div class="avatar manus">智</div>
          <div>
            <h3 class="card-title">超级智能体</h3>
            <p class="card-desc">多工具协作，处理复杂任务：调研、整理、格式转换与自动化。</p>
          </div>
        </div>
        <router-link to="/manus" class="btn secondary" style="margin-top:12px; display:inline-flex;">进入对话</router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.home { text-align: center; margin-top: 100px; }
.nav { display: flex; justify-content: center; gap: 16px; margin-top: 24px; }
.btn { padding: 10px 16px; border: 1px solid #409eff; color: #409eff; border-radius: 6px; text-decoration: none; transition: all 0.3s ease; }
.btn:hover { background: #ecf5ff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2); }

/* 动画效果 */
.landing-hero {
	animation: fadeInUp 0.8s ease-out;
}

.landing-title {
	animation: slideInUp 0.6s ease-out 0.2s both;
}

.landing-sub {
	animation: slideInUp 0.6s ease-out 0.4s both;
}

.cta-group {
	animation: slideInUp 0.6s ease-out 0.6s both;
}

.stats {
	animation: slideInUp 0.6s ease-out 0.8s both;
}

.features {
	animation: fadeInUp 0.8s ease-out 1s both;
}

.feature {
	transition: all 0.3s ease;
}

.feature:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.preview {
	animation: fadeInUp 0.8s ease-out 1.2s both;
}

.grid {
	animation: fadeInUp 0.8s ease-out 1.4s both;
}

.card {
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.card::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
	transition: left 0.5s ease;
}

.card:hover::before {
	left: 100%;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 动画关键帧 */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 按钮悬停效果 */
.btn {
	position: relative;
	overflow: hidden;
}

.btn::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	transform: translate(-50%, -50%);
	transition: width 0.3s ease, height 0.3s ease;
}

.btn:hover::before {
	width: 300px;
	height: 300px;
}

/* 响应式动画 */
@media (max-width: 768px) {
	.landing-hero {
		animation-duration: 0.6s;
	}
	
	.feature:hover {
		transform: translateY(-3px);
	}
	
	.card:hover {
		transform: translateY(-3px);
	}
}
</style>