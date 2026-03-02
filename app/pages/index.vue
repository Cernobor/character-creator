<script setup lang="ts">
const { data } = await useFetch('/api/test')
import { onMounted } from 'vue';
import { aspectList, reset, selectedRace, selectedSubrace, loadLocal, saveLocal} from '~/utils/aspects'
import { compAbilities, copmHp, compEquipment, compPotions, compPowerWords, actLevel} from '~/utils/aspects'

onMounted(() => {
  loadLocal();
});

watch(
  [aspectList, selectedRace, selectedSubrace],
  () => {
    saveLocal();
  },
  {deep: true}
);
</script>

<template>
  <h1>Character Creator</h1>
  <hr style="margin: 20px 0;">
  <RaceDropdown />
  <button @click="reset" id="reset-btn">
    Reset
  </button>
  <div style="padding: 40px; display: flex; flex-direction: row; align-items: flex-start; gap: 40px; padding: 20px;">
    <AspectButton :buttons="aspectList" />
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
</template>

<style scooped>
  #reset-btn{position: fixed; top: 25px; right: 60px; width: 80px; height: 30px;}
  .stats-cont {display: flex; flex-direction: row; justify-content: space-between; gap: 30px; align-items: flex-start;  flex-wrap: wrap; flex-direction: wrap; width: 100%;}
  .stats-main {flex: 0 0 auto;}
  .stats-abil {flex: 1 1 350px; min-width: 350px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;}

  
</style>