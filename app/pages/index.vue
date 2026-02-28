<script setup lang="ts">
const { data } = await useFetch('/api/test')
import { aspectList, reset} from '~/utils/aspects'
import { compAbilities, copmHp, compEquipment, compPotions, compPowerWords, actLevel} from '~/utils/aspects'
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
      <h2>Postava</h2>
      <p>Úroveň: {{ actLevel }}</p>
      <p>Životy: {{ copmHp }}</p>
      <p>Lektvary: {{ compPotions }}</p>
      <p>Slova moci: {{ compPowerWords }}</p>
      
      <h3>Výbava:</h3>
      <ul>
        <li v-for="ability in compEquipment" :key="ability">{{ ability }}</li>
      </ul>

      <h3>Schopnosti:</h3>
      <ul>
        <li v-for="ability in compAbilities" :key="ability">{{ ability }}</li>
      </ul>
    </div>
  </div>
</template>

<style scooped>
  #reset-btn{position: fixed; top: 25px; right: 60px; width: 80px; height: 30px;}
</style>