<script setup lang="ts">
import {computed, onMounted, ref, onUnmounted} from 'vue';
const props = defineProps<{
  buttons: AspectList[]
}>();

const buttonBackgrounds: Record<string, string> = {
  red: '/images/red.png',
  green: '/images/green.png',
  yellow: '/images/yellow.png',
  blue: '/images/blue.png',
  grey: '/images/locked.png',
};

const getButtonBackground = (btn: AspectList) => {
  if (!btn.unlocked) {
    if(btn.type_color==='red' || btn.type_color==='blue'|| btn.type_color==='yellow' || btn.type_color==='green'){
      return { backgroundImage: `url(/images/${btn.type_color}.png)`, opacity: '0.6' };
    }
    else{
      return { backgroundImage: `url(/images/${btn.name}.png)`, opacity: '0.6' };
    }
  }
  let bgUrl = "";
  const stateSuffix = btn.selected ? '_selected' : '';
  if(btn.type_color==='red' || btn.type_color==='blue'|| btn.type_color==='yellow' || btn.type_color==='green'){
    bgUrl = `/images/${btn.type_color}${stateSuffix}.png`;
  }
  else{
    bgUrl = `/images/${btn.name}${stateSuffix}.png`;
  }
  return { 
    backgroundImage: `url(${bgUrl})`,
    transform: btn.selected ? 'scale(1.05)' : 'scale(1)',
    zIndex: btn.selected ? '10' : '1',
    backgroundPosition: 'center'
  };
};

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
        :style="[ getButtonBackground(btn), {gridColumn: btn.position_x, gridRow: btn.postion_y, color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"class="custom-btn aspect_btn">
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
          :style="[getButtonBackground(btn), {color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"class="custom-btn mobile-btn aspect_btn">
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
          :style="[getButtonBackground(btn), {color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]" class="custom-btn mobile-btn aspect_btn">
          {{ btn.skill_name }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
.custom-btn { padding: 10px 10px; color: black;  cursor: pointer; width: 145px; height: 45px; border: none;}
.tree-container {  display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(10, 35px); gap: 20px; position: relative;}
.stats {min-width: 100px;}
#reset-btn:hover {background-color: #c0392b;}
.mobile-tree-container { display: none; width: 100%; justify-content: center; gap: 15px; padding: 10px; }
.mobile-column { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.mobile-btn { width: 145px;}
@media (max-width: 768px) {.desktop-only { display: none; }.mobile-tree-container { display: flex; }}
@media (min-width: 769px) {.mobile-only { display: none; }}
.placeholder-space { width: 145px; height: 45px; visibility: hidden;}
.aspect_btn {background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; font-family: "Alice", serif; font-weight: 400; font-style: normal; font-size: 15px;}
.aspect_btn:hover {filter: brightness(1.2);}
</style>