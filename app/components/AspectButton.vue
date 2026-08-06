<script setup lang="ts">
import {computed, onMounted, ref, onUnmounted} from 'vue';
const props = defineProps<{
  buttons: AspectList[]
}>();
const emit = defineEmits<{
  (e: 'overlay', value: boolean): void
}>()

const buttonBackgrounds: Record<string, string> = {
  red: '/images/red.webp',
  green: '/images/green.webp',
  yellow: '/images/yellow.webp',
  blue: '/images/blue.webp',
  grey: '/images/locked.webp',
};


const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const _activeTooltipBtn = ref<AspectList | null>(null);
const activeTooltipBtn = computed<AspectList | null>({
  get: () => _activeTooltipBtn.value,
  set: (btn: AspectList | null) => {
    _activeTooltipBtn.value = btn;
    console.log('emit', btn === null);
    emit('overlay', btn !== null);
  },
});

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

interface Columns {
  red: any[];
  yellow: any[];
  green: any[];
  blue: any[];
  others: any[];
}
const mobileColumns = computed<Columns>(() => {
  const res: Columns = {
    red: [],
    yellow: [],
    green: [],
    blue: [],
    others: [],
  };

  const visibleButtons = props.buttons.filter(btn => !btn.hidden);

  visibleButtons.forEach(btn => {
    const type_color = btn.type_color;
    if (type_color in res) {
      (res as unknown as Record<string, any[]>)[type_color]?.push(btn);
    } else {
      res.others?.push(btn);
    }
  });

  return res;
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

      <AspectInfo
          v-if="activeTooltipBtn === btn"
          :aspect="btn"
          :allAspects="props.buttons"
          :showButtons="false"
          :class="getTooltipPositionClass(btn)"
          class="ability-tooltip"
        />
      </div>
    </template>
  </div>
  <div class="mobile-tree-container mobile-only">
    <div v-for="[key, col] in Object.entries(mobileColumns).filter(([k, _]) => k !== 'others')" :key="key" class="mobile-column">
      <template v-for="(btn, idx) in col" :key="idx">
        <div v-if="btn.isPlaceholder" class="placeholder-space"></div>
       <div v-else class="btn-wrapper">
          <button
            @click="() => {
              if (activeTooltipBtn === null) {
                activeTooltipBtn = btn;
              }
            }"
            :style="[getButtonBackground(btn), {color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"
            class="custom-btn mobile-btn aspect_btn"
          >
            {{ btn.skill_name }}
          </button>
        </div>
      </template>
    </div>
    <div class="break"></div>
    <div v-for="(btn, idx) in mobileColumns.others" :key="idx" class="mobile-column">
      <div v-if="btn.isPlaceholder" class="placeholder-space"></div>
      <div v-else class="btn-wrapper">
        <button
          @click="activeTooltipBtn = (activeTooltipBtn === btn ? null : btn)"
          :style="[getButtonBackground(btn), {color: (btn.type_color === 'yellow' || btn.type_color === 'white') ? 'black' : 'aliceblue'}]"
          class="custom-btn mobile-btn aspect_btn"
        >
          {{ btn.skill_name }}
        </button>
      </div>
    </div>
    <AspectInfo
      v-if="activeTooltipBtn !== null"
      :aspect="activeTooltipBtn"
      :allAspects="props.buttons"
      :showButtons="true"
      @toggle="activeTooltipBtn.pressed_aspect()"
      @close="activeTooltipBtn = null"
    />
  </div>
</template>

<style scoped>
  .custom-btn { padding: 10px 10px; color: black;  cursor: pointer; width: 145px; height: 45px; border: none;}
  .tree-container {  display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(10, 35px); gap: 20px; position: relative;}
  .stats {min-width: 100px;}
  #reset-btn:hover {background-color: #c0392b;}
  .mobile-tree-container { display: none; width: 100%; justify-content: center; gap: 15px; }
  .mobile-column { display: flex; flex-direction: column; gap: 10px; align-items: center; }
  .mobile-btn { width: 145px;}
  @media (max-width: 849px) {.desktop-only { display: none; }.mobile-tree-container { display: flex; flex-wrap: wrap; } }
  @media (min-width: 850px) {.mobile-only { display: none; }}
  .placeholder-space { width: 145px; height: 45px; visibility: hidden;}
  .aspect_btn {background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; font-family: serif; font-weight: 400; font-style: normal; font-size: 15px;}
  .aspect_btn:hover {filter: brightness(1.2);}
  .btn-wrapper {position: relative; display: inline-block;}
  .btn-wrapper:hover {z-index: 9999;}
  .ability-tooltip.align-center {left: 50%; transform: translateX(-50%);}
  .ability-tooltip.position-top {bottom: 110%; top: auto;}
  .ability-tooltip.position-bottom {top: 110%; bottom: auto;}
  .ability-tooltip.position-side-right {left: 110%; top: 50%; transform: translateY(-50%); bottom: auto;}
  .ability-tooltip.position-side-left { right: 110%; left: auto; top: 50%; transform: translateY(-50%); bottom: auto;}
  .ability-tooltip.align-top {top: 0 !important; bottom: auto !important; transform: none !important;}
  .ability-tooltip.align-bottom {bottom: 0 !important; top: auto !important; transform: none !important;}
  .break { flex-basis: 100%; height: 0; }
</style>
