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

const toggleRace = (raceName) => {
  if (selectedRace.value === raceName && !selectedSubrace.value) {
    selectedRace.value = '';
    selectedSubrace.value = '';
  } else {
    selectedRace.value = raceName;
    selectedSubrace.value = '';
  }
};
</script>

<template>
  <div class="race-picker-container">
    <div class="race-grid">
      <div v-for="race in mainRaces" :key="race.name" class="race-column">
        
        <button 
          class="custom-btn race-btn"
          :class="{ selected: selectedRace === race.name && !selectedSubrace}"
          @click="toggleRace(race.name)"
        >
          {{ race.race_name }}
        </button>

        <div 
          v-if="selectedRace === race.name && availableSubraces.length > 0 && !selectedSubrace" 
          class="subrace-vertical-list"
        >
          <button 
            v-for="sub in availableSubraces" 
            :key="sub.name"
            class="custom-btn race-btn sub-btn"
            @click="selectedSubrace = sub.name"
          >
            {{ sub.race_name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
  .race-picker-container { display: flex; flex-direction: column; gap: 15px; padding-bottom: 12px; padding-left: 2vw; padding-top: 2vw;}
  .race-grid { display: flex; flex-wrap: wrap; gap: 10px;  align-items: center;}
  .race-column {position: relative; display: flex; flex-direction: column; align-items: center;}
  .subrace-vertical-list {z-index: 11; display: flex; flex-direction: column; animation: fadeIn 0.3s ease; position: absolute; margin-top: 42px;}
  .race-btn {min-width: 131px; height: 45px; filter: brightness(0.8); z-index: 10; transition: all 0.2s ease; background-image: url('/images/race_button.png'); background-size: 100% 100%;  background-position: center; background-repeat: no-repeat; background-color: transparent; border: none; font-family: "Alice", serif; color: white;  padding: 0 15px; cursor: pointer;}  
  .race-btn.selected { z-index: 10; filter: brightness(1.2);  border: 2px solid gold;  transform: scale(1.05); }
  .sub-btn { background-image: url('/images/subrace.png'); font-size: 14px; width: 125px; height: 40px;}
  @keyframes fadeIn {from { opacity: 0; transform: translateY(-5px); }to { opacity: 1; transform: translateY(0); }}
  .button-group { display: flex; flex-wrap: wrap; gap: 10px;}
  .race-btn { z-index: 1; min-width: 131px; height: 45px; filter: brightness(0.8); transition: all 0.2s ease; background-image: url('/images/race_button.png'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none; font-family: "Alice", serif; font-weight: 400; font-style: normal; font-size: 15px; color: white; padding-left: 15px; padding-right: 15px;}
  .race-btn.selected {filter: brightness(1.2); border: 2px solid gold; transform: scale(1.05);}
  .subrace-group {margin-top: 0px; padding-top: 0px;}
  .sub-btn {min-width: 100px; background-image: url('/images/subraces.png'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none; font-family: "Alice", serif; font-weight: 400; font-style: normal; font-size: 15px; color: white;}
  .sub-btn:hover {filter: brightness(1.2); border: 2px solid gold; transform: scale(1.05);}
</style>