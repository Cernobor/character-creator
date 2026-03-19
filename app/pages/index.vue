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
    <div v-if="!isMobile"><RaceDropdown /></div>
    <div v-if="isMobile" class="mobile-layout">
      <div class="tab-menu">
        <button class="mobile_tabs" :class="tab === 'tree' ? 'tabs-tree-active' : 'tabs-tree-inactive'" @click="tab = 'tree' ">Aspekty</button>
        <button class="mobile_tabs" :class="tab === 'stats' ? 'tabs-stats-active' : 'tabs-stats-inactive'" @click="tab = 'stats'">Postava</button>
        <div class="mobile_tabs_underline" :class="'underline-' + tab"></div>
      </div>
      <div class = "tab-content">
        <div v-if="tab === 'tree'" class="tree-container">
          <AspectButton :buttons="aspectList" />
        </div>
      <div v-if="tab === 'stats'" class="stats-panel mobile-stats">
        <RaceDropdown />
        <div class ="stats-main">
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
  @import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
#main-row {display: flex; align-items: center; justify-content: space-between; padding: 10px 5% 10px 20px; width: 100%; box-sizing: border-box; gap: 10px;}
  #main-row h1 {margin: 0; flex-shrink: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
  #reset-btn{padding-top: 0px; flex-shrink: 0; font-family: "Alice", serif; font-weight: 400; font-style: normal; font-size: 20px; color: aliceblue; -webkit-text-stroke: 0.2px grey; align-self: right; min-width: 100px; height: 50px; background-image: url('/images/reset.png'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none;}
  #reset-btn:hover {filter: brightness(1.2);}
  #reset-btn:active {filter: brightness(0.8);}
  .desktop-layout {display: flex; flex-direction: row;flex-wrap: wrap; align-items: flex-start; gap: 40px; padding: 20px;}
  .desktop-layout {display: flex; flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 40px; padding: 20px; justify-content: flex-start;}
  .tree-wrapper {flex: 0 0 840px;  width: 840px;}
  .stats-panel {flex: 1 1 350px; min-width: 320px; padding: 20px; border-radius: 8px;}
  .stats-cont {display: flex; flex-direction: row; flex-wrap: wrap; gap: 20px; justify-content: flex-start;}
  .stats-main {padding-left: 3%;padding-right: 3%; padding-bottom: 6%; padding-top: 1%; flex: 0 0 180px; background-image: url('/images/abilities_background.png'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none;}
  .stats-abil {padding-left: 3%;padding-right: 3%; padding-bottom: 6%; padding-top: 1%;flex: 1 1 200px; min-width: 0; word-wrap: break-word; background-image: url('/images/abilities_background.png'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none;}
  .tab-menu {display: flex; flex-wrap: wrap; width: 100%; margin-bottom: 20px; border-bottom: 2px solid #ccc; }
  .tab-menu button {flex: 1; padding: 12px; border: none; cursor: pointer; font-weight: bold;}
  .mobile-layout { padding: 10px; }
  .main{font-family: "Alice", serif; font-weight: 400; font-style: normal;}
  .tree-container { overflow-x: auto; padding-bottom: 20px; }
  body{margin: 0; padding: 0;}
  body::before{content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;background-image: url('/images/background.webp'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none;}
  .mobile_tabs {flex: 1; height: 50px; border: none; cursor: pointer; font-family: "Alice", serif; font-size: 16px; color: white; text-shadow: 1px 1px 2px black; background-size: 100% 100%; background-color: transparent; transition: all 0.2s ease;}
  .tabs-tree-inactive { background-image: url('/images/mobile_tab_left.png'); filter: brightness(0.7);}
  .tabs-tree-active {background-image: url('/images/mobile_tab_left_active.png'); filter: brightness(1.2);}
  .tabs-stats-inactive {background-image: url('/images/mobile_tab_right.png'); filter: brightness(0.7);}
  .tabs-stats-active { background-image: url('/images/mobile_tab_right_active.png'); filter: brightness(1.2);}
  .mobile_tabs_underline { width: 100%; height: 10px; margin-top: -2px; background-size: 100% 100%; transition: background-image 0.3s ease;}
  .underline-tree { background-image: url('/images/mobile_tab_lower_left.png'); margin-top: 0.6px;}
  .underline-stats { background-image: url('/images/mobile_tab_lower_right.png'); margin-top: 0.6px;}
</style>