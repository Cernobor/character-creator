<script setup lang="ts">
import {computed, onMounted, ref, onUnmounted} from 'vue';
const props = defineProps<{
  buttons: AspectList[]
}>();

const mobileColumns = computed(() => {
  const left: any[] = [];
  const right: any[] = [];
  const others: any[] = [];
  
  const visibleButtons = props.buttons.filter(btn => !btn.hidden);

  visibleButtons.forEach(btn => {
    if (btn.type_color === 'red' || btn.type_color === 'green') {
      left.push(btn);
    }
    else if (btn.type_color === 'yellow' || btn.type_color === 'blue') {
      right.push(btn);
    }
    else {
      others.push(btn);
    }
  });

  const diff = left.length - right.length;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      right.push({ isPlaceholder: true });
    }
  }
  else if (diff < 0) {
    for (let i = 0; i < Math.abs(diff); i++) {
      left.push({ isPlaceholder: true });
    }
  }

  others.forEach((btn, index) => {
    if (index % 2 === 0) left.push(btn);
    else right.push(btn);
  });

  return { left, right };
});

</script>

<template>
  <div class="tree-container desktop-only">
    <template v-for="btn in buttons" :key="btn.skill_name">
      <button
        v-if="!btn.hidden"
        @click="btn.pressed_aspect()"
        :title="btn.skill_name"
        :style="{ backgroundColor: !btn.unlocked ? 'grey': btn.type_color, opacity: !btn.selected && btn.unlocked ? 0.5 : 0.9, gridColumn: btn.position_x, gridRow: btn.postion_y }"class="custom-btn">
        {{ btn.skill_name }}
      </button>
    </template>
  </div>
<div class="mobile-tree-container mobile-only">
    <div class="mobile-column">
      <template v-for="(btn, index) in mobileColumns.left" :key="'left-' + index">
        <div v-if="btn.isPlaceholder" class="placeholder-space"></div>
        <button
          v-else
          @click="btn.pressed_aspect()"
          :style="{ backgroundColor: !btn.unlocked ? 'grey': btn.type_color, opacity: !btn.selected && btn.unlocked ? 0.5 : 0.9 }"class="custom-btn mobile-btn">
          {{ btn.skill_name }}
        </button>
      </template>
    </div>
    <div class="mobile-column">
      <template v-for="(btn, index) in mobileColumns.right" :key="'right-' + index">
        <div v-if="btn.isPlaceholder" class="placeholder-space"></div>
        <button
          v-else
          @click="btn.pressed_aspect()"
          :style="{ backgroundColor: !btn.unlocked ? 'grey': btn.type_color, opacity: !btn.selected && btn.unlocked ? 0.5 : 0.9 }" class="custom-btn mobile-btn">
          {{ btn.skill_name }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.custom-btn { padding: 10px 10px; color: black;  cursor: pointer; border-radius: 3px; border-color: grey; width: 131px; height: 45px;}
.tree-container {  display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(10, 35px); gap: 20px; position: relative;}
.stats {min-width: 100px;}
#reset-btn:hover {background-color: #c0392b;}
.mobile-tree-container { display: none; width: 100%; justify-content: center; gap: 15px; padding: 10px; }
.mobile-column { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.mobile-btn { width: 140px;}
@media (max-width: 768px) {.desktop-only { display: none; }.mobile-tree-container { display: flex; }}
@media (min-width: 769px) {.mobile-only { display: none; }}
.placeholder-space { width: 131px; height: 45px; visibility: hidden;}
</style>