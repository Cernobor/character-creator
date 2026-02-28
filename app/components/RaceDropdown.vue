<script setup>
import { computed } from 'vue';
import { selectedRace, selectedSubrace } from '~/utils/aspects';
import raceData from '~/assets/race.json';

const mainRaces = computed(() => {
  return raceData.filter(r => r.subrace === false);
});

const availableSubraces = computed(() => {
  if (!selectedRace.value) return [];
  return raceData.filter(r => r.subrace === true && r.race === selectedRace.value);
});

const handleMainRaceChange = () => {
  selectedSubrace.value = ''; 
};
</script>

<template>
  <div class="race-selects">
    <select v-model="selectedRace" @change="handleMainRaceChange">
      <option value="">-- Rasa --</option>
      <option v-for="race in mainRaces" :key="race.name" :value="race.name">
        {{ race.race_name }}
      </option>
    </select>

    <select v-if="availableSubraces.length > 0" v-model="selectedSubrace">
      <option value="">-- Národnost/Znamení --</option>
      <option v-for="sub in availableSubraces" :key="sub.name" :value="sub.name">
        {{ sub.race_name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
    .race-selects {display: flex; gap: 10px; padding-left: 20px;}
    select { padding: 5px; border-radius: 4px;}
</style>