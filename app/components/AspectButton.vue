<script setup lang="ts">
import {computed, onMounted, ref, onUnmounted} from 'vue';
const props = defineProps<{
  buttons: AspectList[]
}>();

const buttonBackgrounds: Record<string, string> = {
  red: '/images/red.webp',
  green: '/images/green.webp',
  yellow: '/images/yellow.webp',
  blue: '/images/blue.webp',
  grey: '/images/locked.webp',
};


const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const activeTooltipBtn = ref<AspectList | null>(null);

const handleMouseEnter = (btn: AspectList) => {
  clearHoverTimer();
  hoverTimer.value = setTimeout(() => {
    activeTooltipBtn.value = btn;
  }, 10);
};

const handleMouseLeave = () => {
  clearHoverTimer();
  activeTooltipBtn.value = null;
};

const clearHoverTimer = () => {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
};

const getTooltipPositionClass = (btn: AspectList) => {
  const classes: string[] = [];
  const posX = Number(btn.position_x);
  const posY = Number(btn.postion_y);

  if (posX === 1) {
    classes.push('position-side-right');
  } 
  else if (posX === 5) { 
    classes.push('position-side-left');
  } 
  else if (posY === 1) {
    classes.push('position-bottom', 'align-center');
  } 
  else {
    classes.push('position-top', 'align-center');
  }
  return classes.join(' ');
};
const getMobileTooltipClass = (columnIndex: 'left' | 'right', index: number, totalItems: number) => {
  const classes: string[] = [];

  // 1. Horizontální pozice (strana)
  classes.push(columnIndex === 'left' ? 'position-side-right' : 'position-side-left');

  // 2. Vertikální přichycení podle pozice tlačítka v seznamu
  if (index < 3) {
    // Pro první 3 tlačítka zarovnáme horní hranu tooltipu s horní hranou tlačítka (nepřeteče nahoru)
    classes.push('align-top');
  } else if (index >= totalItems - 3) {
    // Pro poslední 3 tlačítka zarovnáme dolní hranu
    classes.push('align-bottom');
  }

  return classes.join(' ');
};

const getButtonBackground = (btn: AspectList) => {
  if (!btn.unlocked) {
    if(btn.type_color==='red' || btn.type_color==='blue'|| btn.type_color==='yellow' || btn.type_color==='green'){
      return { backgroundImage: `url(/images/${btn.type_color}.webp)`, opacity: '0.6' };
    }
    else{
      return { backgroundImage: `url(/images/${btn.name}.webp)`, opacity: '0.6' };
    }
  }
  let bgUrl = "";
  const stateSuffix = btn.selected ? '_selected' : '';
  if(btn.type_color==='red' || btn.type_color==='blue'|| btn.type_color==='yellow' || btn.type_color==='green'){
    bgUrl = `/images/${btn.type_color}${stateSuffix}.webp`;
  }
  else{
    bgUrl = `/images/${btn.name}${stateSuffix}.webp`;
  }
  return { 
    backgroundImage: `url(${bgUrl})`,
    transform: btn.selected ? 'scale(1.05)' : 'scale(1)',
    zIndex: btn.selected ? '10' : '1',
    backgroundPosition: 'center'
  };
};

const getUnlockedByNames = (unlockedBy: string | string[] | undefined) => {
  if (!unlockedBy) return '';
  const targetNames = Array.isArray(unlockedBy) ? unlockedBy : [unlockedBy];
  const foundSkillNames = targetNames
    .map(name => props.buttons.find(btn => btn.name === name)?.skill_name)
    .filter((skillName): skillName is string => Boolean(skillName));
  return foundSkillNames.join(', ');
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
      
    <div 
      v-if="!btn.hidden" 
      class="btn-wrapper"
      :style="{ gridColumn: btn.position_x, gridRow: btn.postion_y }"
      @mouseenter="handleMouseEnter(btn)"
      @mouseleave="handleMouseLeave"
    >
      <button
        @click="btn.pressed_aspect(); handleMouseLeave();"
        :style="[ getButtonBackground(btn), { color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"
        class="custom-btn aspect_btn">
        {{ btn.skill_name }}
      </button>

      <div v-if="activeTooltipBtn === btn" class="ability-tooltip" :class="getTooltipPositionClass(btn)">
        <h4>{{ btn.skill_name }}</h4>
        <p v-if="btn.equipment" class="skills"><strong>Výbava:</strong> {{ btn.equipment.join(', ')}}</p>
        <p v-if="btn.abilities" class="skills"><strong>Schopnosti:</strong> {{ btn.abilities.join(', ')}}</p>
        <p v-if="btn.abilities_upgraded" class="skills"><strong>Vylepšené:</strong> {{ btn.abilities_upgraded.join(', ') }}</p>
        <p v-if="btn.upgrade_description" class="skills"><strong>Popis:</strong> {{ btn.upgrade_description}}</p>
        <p v-if="btn.upgrade_reqs_description" class="reqs"><strong>Požadavky na vylepšení:</strong> {{ btn.upgrade_reqs_description}}</p>
        <p v-if="btn.unlocked_by && btn.unlocked_by.length" class="reqs"><strong>Požadavky na otevření:</strong> {{ getUnlockedByNames(btn.unlocked_by) }}</p>
      </div>
    </div>
    </template>
  </div>
<div class="mobile-tree-container mobile-only">
    <div class="mobile-column">
      <template v-for="(btn, index) in mobileColumns.left" :key="'left-' + index">
        <div v-if="btn.isPlaceholder" class="placeholder-space"></div>
        <div 
        v-else 
        class="btn-wrapper"
        @mouseenter="handleMouseEnter(btn)"
        @mouseleave="handleMouseLeave"
      >
        <button
          @click="activeTooltipBtn = (activeTooltipBtn === btn ? null : btn); btn.pressed_aspect();"
          :style="[getButtonBackground(btn), {color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"
          class="custom-btn mobile-btn aspect_btn"
        >
          {{ btn.skill_name }}
        </button>
        <div 
          v-if="activeTooltipBtn === btn" 
          class="ability-tooltip" 
          :class="getMobileTooltipClass('left', index, mobileColumns.left.length)"
          @mouseenter="clearHoverTimer()"
          @mouseleave="handleMouseLeave()"
        >
          <h4>{{ btn.skill_name }}</h4>
          <p v-if="btn.equipment" class="skills"><strong>Výbava:</strong> {{ btn.equipment.join(', ')}}</p>
          <p v-if="btn.abilities" class="skills"><strong>Schopnosti:</strong> {{ btn.abilities.join(', ')}}</p>
          <p v-if="btn.abilities_upgraded" class="skills"><strong>Vylepšené:</strong> {{ btn.abilities_upgraded.join(', ')}}</p>
          <p v-if="btn.upgrade_description" class="skills"><strong>Popis:</strong> {{ btn.upgrade_description }}</p>
          <p v-if="btn.upgrade_reqs_description" class="reqs"><strong>Požadavky:</strong> {{ btn.upgrade_reqs_description }}</p>
          <p v-if="btn.unlocked_by && btn.unlocked_by.length" class="reqs"><strong>Požadavky na otevření:</strong> {{ getUnlockedByNames(btn.unlocked_by) }}</p>
        </div>
      </div>
      </template>
    </div>
    <div class="mobile-column">
      <template v-for="(btn, index) in mobileColumns.right" :key="'right-' + index">
        <div v-if="btn.isPlaceholder" class="placeholder-space"></div>
        <div 
        v-else 
        class="btn-wrapper"
        @mouseenter="handleMouseEnter(btn)"
        @mouseleave="handleMouseLeave"
      >
        <button
          @click="activeTooltipBtn = (activeTooltipBtn === btn ? null : btn); btn.pressed_aspect();"
          :style="[getButtonBackground(btn), {color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"
          class="custom-btn mobile-btn aspect_btn"
        >
          {{ btn.skill_name }}
        </button>
        <div 
          v-if="activeTooltipBtn === btn" 
          class="ability-tooltip" 
          :class="getMobileTooltipClass('right', index, mobileColumns.right.length)"
          @mouseenter="clearHoverTimer()"
          @mouseleave="handleMouseLeave()"
        >
          <h4>{{ btn.skill_name }}</h4>
          <p v-if="btn.equipment" class="skills"><strong>Výbava:</strong> {{ btn.equipment.join(', ')}}</p>
          <p v-if="btn.abilities" class="skills"><strong>Schopnosti:</strong> {{ btn.abilities.join(', ')}}</p>
          <p v-if="btn.abilities_upgraded" class="skills"><strong>Vylepšené:</strong> {{ btn.abilities_upgraded.join(', ')}}</p>
          <p v-if="btn.upgrade_description" class="skills"><strong>Popis:</strong> {{ btn.upgrade_description }}</p>
          <p v-if="btn.upgrade_reqs_description" class="reqs"><strong>Požadavky:</strong> {{ btn.upgrade_reqs_description }}</p>
          <p v-if="btn.unlocked_by && btn.unlocked_by.length" class="reqs"><strong>Požadavky na otevření:</strong> {{ getUnlockedByNames(btn.unlocked_by) }}</p>
        </div>
      </div>
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
  @media (max-width: 768px) {.desktop-only { display: none; }.mobile-tree-container { display: flex; } .ability-tooltip { width: 170px; font-size: 11px; padding: 8px;}}
  @media (min-width: 769px) {.mobile-only { display: none; }}
  .placeholder-space { width: 145px; height: 45px; visibility: hidden;}
  .aspect_btn {background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; font-family: "Alice", serif; font-weight: 400; font-style: normal; font-size: 15px;}
  .aspect_btn:hover {filter: brightness(1.2);}
  .btn-wrapper {position: relative; display: inline-block;}
  .btn-wrapper:hover {z-index: 9999;}
  .ability-tooltip {position: absolute; width: 240px; overflow-y: auto; background-image: url('/images/background.webp'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: #1a1a1a; border: 1px solid #d4af37; color: #f0e6d2; padding: 12px; border-radius: 6px; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.8); z-index: 10000; pointer-events: auto; font-family: 'Alice', serif; font-size: 13px; text-align: left;}
  .ability-tooltip h4 {margin: 0 0 6px 0; color: black; font-size: 15px; border-bottom: 1px solid rgba(212, 175, 55, 0.4); padding-bottom: 4px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);}
  .ability-tooltip p {margin: 4px 0; line-height: 1.3; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);}
  .ability-tooltip .reqs {color: #ff6b6b;}
  .skills{color:rgb(0, 0, 0);}
  .ability-tooltip::-webkit-scrollbar {width: 4px;}
  .ability-tooltip::-webkit-scrollbar-thumb {background: #d4af37; border-radius: 2px;}
  .ability-tooltip.align-center {left: 50%; transform: translateX(-50%);}
  .ability-tooltip.position-top {bottom: 110%; top: auto;}
  .ability-tooltip.position-bottom {top: 110%; bottom: auto;}
  .ability-tooltip.position-side-right {left: 110%; top: 50%; transform: translateY(-50%); bottom: auto;}
  .ability-tooltip.position-side-left { right: 110%; left: auto; top: 50%; transform: translateY(-50%); bottom: auto;}
  .ability-tooltip.align-top {top: 0 !important; bottom: auto !important; transform: none !important;}
  .ability-tooltip.align-bottom {bottom: 0 !important; top: auto !important; transform: none !important;}
</style>