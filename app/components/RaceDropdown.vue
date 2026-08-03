<script setup>
import { computed, ref } from 'vue';
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

// Logika pro hover popup okno u podras - ukládáme jen name (string)
const hoverTimer = ref(null);
const hoveredSubraceName = ref(null);

const handleMouseEnter = (subName) => {
  clearHoverTimer();
  hoverTimer.value = setTimeout(() => {
    hoveredSubraceName.value = subName;
  }, 50);
};

const handleMouseLeave = () => {
  clearHoverTimer();
  hoverTimer.value = setTimeout(() => {
    hoveredSubraceName.value = null;
  }, 150);
};

const clearHoverTimer = () => {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
};

// Pomocná funkce pro zobrazení pole schopností s čárkou a mezerou
const formatAbilities = (abilities) => {
  if (!abilities) return '';
  if (Array.isArray(abilities)) {
    return abilities.join(', ');
  }
  return abilities;
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
          <div
            v-for="sub in availableSubraces" 
            :key="sub.name"
            class="subrace-wrapper"
            @mouseenter="handleMouseEnter(sub.name)"
            @mouseleave="handleMouseLeave"
          >
            <button 
              class="custom-btn race-btn sub-btn"
              @click="selectedSubrace = sub.name"
            >
              {{ sub.race_name }}
            </button>

            <!-- Popup okno pro podrasu -->
            <div 
              v-if="hoveredSubraceName === sub.name" 
              class="ability-tooltip position-side-right"
              @mouseenter="clearHoverTimer()"
              @mouseleave="handleMouseLeave()"
            >
              <h4>{{ sub.race_name }}</h4>
              <p v-if="sub.abilities_description || sub.abilities" class="skills"><strong>Schopnosti:</strong> {{ formatAbilities(sub.abilities_description || sub.abilities) }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
  .race-picker-container { display: flex; flex-direction: column; gap: 15px; padding-bottom: 12px; padding-left: 2vw; padding-top: 2vw;}
  .race-grid { display: flex; flex-wrap: wrap; gap: 10px; align-items: center;}
  .race-column { position: relative; display: flex; flex-direction: column; align-items: center;}
  .subrace-vertical-list { z-index: 100; display: flex; flex-direction: column; animation: fadeIn 0.3s ease; position: absolute; margin-top: 42px;}
  .race-btn { min-width: 131px; height: 45px; filter: brightness(0.8); z-index: 10; transition: all 0.2s ease; background-image: url('/images/race_button.webp'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none; font-family: "Alice", serif; color: white; padding: 0 15px; cursor: pointer;}  
  .race-btn.selected { z-index: 10; filter: brightness(1.2); border: 2px solid gold; transform: scale(1.05); }
  .sub-btn { background-image: url('/images/subrace.webp'); font-size: 14px; width: 125px; height: 40px;}
  @keyframes fadeIn {from { opacity: 0; transform: translateY(-5px); }to { opacity: 1; transform: translateY(0); }}
  .button-group { display: flex; flex-wrap: wrap; gap: 10px;}
  .subrace-group { margin-top: 0px; padding-top: 0px;}
  .sub-btn:hover { filter: brightness(1.2); border: 2px solid gold; transform: scale(1.05);}

  /* Pozicování obalu podrasy s vyšším z-indexem pro otevřený hover */
  .subrace-wrapper {
    position: relative;
    display: inline-block;
  }
  .subrace-wrapper:hover {
    z-index: 1000;
  }

  /* Styl popup okna */
  .ability-tooltip {
    position: absolute;
    width: 220px;
    max-height: 250px;
    overflow-y: auto;
    
    background-image: url('/images/background.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #1a1a1a; 
    
    border: 1px solid #d4af37;
    color: #f0e6d2;
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.8);
    
    z-index: 10000; 
    pointer-events: auto;
    
    font-family: 'Alice', serif;
    font-size: 13px;
    text-align: left;
  }

  .ability-tooltip h4 {
    margin: 0 0 6px 0;
    color: black;
    font-size: 15px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    padding-bottom: 4px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }

  .ability-tooltip p {
    margin: 4px 0;
    line-height: 1.3;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .skills {
    color: rgb(0, 0, 0);
  }

  .ability-tooltip::-webkit-scrollbar {
    width: 4px;
  }
  .ability-tooltip::-webkit-scrollbar-thumb {
    background: #d4af37;
    border-radius: 2px;
  }

  /* Zarovnání napravo od tlačítka podrasy */
  .ability-tooltip.position-side-right {
    left: 105%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>