<template>
  <ChatRoom :chatApi="api" :sse="true" :chatId="chatId">
    <template #title>
      <div class="row-gap-8">
        <div class="avatar study">学</div>
        <div>
          <div class="card-title" style="margin:0">学习规划大师</div>
          <div class="text-dim" style="font-size:12px">个性化·系统化·可执行的学习方案</div>
        </div>
      </div>
    </template>
  </ChatRoom>
</template>

<script setup>
import { ref } from 'vue'
import ChatRoom from '../components/ChatRoom.vue'
import { API_BASE_URL } from '../config/env.js'

function genId() {
  return Math.random().toString(36).slice(2, 10)
}
const chatId = ref(genId())
const api = `${API_BASE_URL}/ai/studyApp/chat/sse`
</script>