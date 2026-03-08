<script setup lang="ts">
const { data } = await useFetch('/api/test')
import { onMounted, ref, onUnmounted } from 'vue';
import { aspectList, reset, selectedRace, selectedSubrace, loadLocal, saveLocal} from '~/utils/aspects'
import { compAbilities, copmHp, compEquipment, compPotions, compPowerWords, actLevel} from '~/utils/aspects'

onMounted(() => {
  loadLocal();
  screenWidth();
  window.addEventListener('resize', screenWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', screenWidth);
});

const tab = ref('tree');

const isMobile = ref(false);

const screenWidth = () => {
    isMobile.value = window.innerWidth < 790;
};



watch(
  [aspectList, selectedRace, selectedSubrace],
  () => {
    saveLocal();
  },
  {deep: true}
);
</script>

<template>
  <div class="main">
    <div id="main-row">
      <h1>Character Creator</h1>
      <button @click="reset" id="reset-btn">Reset</button>
    </div>
    <hr style="margin: 1px 0;">
    <div v-if="isMobile" class="mobile-layout">
      <div class="tab-menu">
        <button :class="{ active: tab === 'tree' }" @click="tab = 'tree'">Aspekty</button>
        <button :class="{ active: tab === 'stats' }" @click="tab = 'stats'">Postava</button>
      </div>
      <div class = "tab-content">
        <div v-if="tab === 'tree'" class="tree-container">
          <AspectButton :buttons="aspectList" />
        </div>
      <div v-if="tab === 'stats'" class="stats-panel mobile-stats">
        <RaceDropdown />
        <h2>Postava</h2>
        <p>Úroveň: {{ actLevel }}</p>
        <p>Životy: {{ copmHp }}</p>
        <p>Lektvary: {{ compPotions }}</p>
        <p>Slova moci: {{ compPowerWords }}</p>  
        <h3>Výbava:</h3>
        <ul>
          <li v-for="ability in compEquipment" :key="ability">{{ ability }}</li>
        </ul>
        <div class="stats-abil">
          <h3>Schopnosti:</h3>
          <ul>
            <li v-for="ability in compAbilities" :key="ability">{{ ability }}</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
    <div v-else class="desktop-layout">
  <div class="tree-wrapper">
    <AspectButton :buttons="aspectList" />
  </div>
    <div class="stats-panel">
      <div class="stats-cont">
        <div class="stats-main">
          <h2>Postava</h2>
          <p>Úroveň: {{ actLevel }}</p>
          <p>Životy: {{ copmHp }}</p>
          <p>Lektvary: {{ compPotions }}</p>
          <p>Slova moci: {{ compPowerWords }}</p>
          <h3>Výbava:</h3>
          <ul>
            <li v-for="ability in compEquipment" :key="ability">{{ ability }}</li>
          </ul>
        </div>
        <div class="stats-abil">
          <h3>Schopnosti:</h3>
            <ul>
              <li v-for="ability in compAbilities" :key="ability">{{ ability }}</li>
            </ul>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scooped>
  #main-row {display: flex; justify-content: space-between; align-items: center;}
  #reset-btn{align-self: right; top: 25px; right: 60px; width: 80px; height: 30px;}
  .desktop-layout {display: flex; flex-direction: row;flex-wrap: wrap; align-items: flex-start; gap: 40px; padding: 20px;}
  .desktop-layout {display: flex; flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 40px; padding: 20px; justify-content: flex-start;}
  .tree-wrapper {flex: 0 0 750px;  width: 750px;}
  .stats-panel {flex: 1 1 350px; min-width: 320px; background: #fdfdfd; padding: 20px; border-radius: 8px; border: 1px solid #ddd;}
  .stats-cont {display: flex; flex-direction: row; flex-wrap: wrap; gap: 20px; justify-content: flex-start;}
  .stats-main {flex: 0 0 180px; }
  .stats-abil {flex: 1 1 200px; min-width: 0; word-wrap: break-word;}
  .tab-menu {display: flex; width: 100%; margin-bottom: 20px; border-bottom: 2px solid #ccc; }
  .tab-menu button {flex: 1; padding: 12px; background-color: #f0f0f0; border: none; cursor: pointer; font-weight: bold;}
  .tab-menu button.active { background: #fff; border-bottom: 3px solid #3498db; color: #3498db; }
  .mobile-layout { padding: 10px; }
  .tree-container { overflow-x: auto; padding-bottom: 20px; } /* Umožní scrollovat strom do stran na mobilu */
</style>