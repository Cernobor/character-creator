<script setup lang="ts">
import {computed, onMounted, ref, onUnmounted} from 'vue';
const props = defineProps<{
  aspect: AspectList,
  allAspects: AspectList[],
  showButtons: boolean,
}>();
const emit = defineEmits<{
  (e: 'toggle'): void;
  (e: 'close'): void;
}>()

const getUnlockedByNames = (unlockedBy: string | string[] | undefined) => {
  if (!unlockedBy) return '';
  const targetNames = Array.isArray(unlockedBy) ? unlockedBy : [unlockedBy];
  const foundSkillNames = targetNames
    .map(name => props.allAspects.find(asp => asp.name === name)?.skill_name)
    .filter((skillName): skillName is string => Boolean(skillName));
  return foundSkillNames.join(', ');
};
</script>

<template>
  <div class="container">
    <h4>{{ aspect.skill_name }}</h4>
    <p v-if="aspect.unlocked_by && aspect.unlocked_by.length" class="reqs"><strong>Požadavky na otevření:</strong> {{ getUnlockedByNames(aspect.unlocked_by) }}</p>
    <hr />
    <p v-if="aspect.equipment" class="skills"><strong>Výbava:</strong> {{ aspect.equipment.join(', ')}}</p>
    <p v-if="aspect.abilities" class="skills"><strong>Schopnosti:</strong> {{ aspect.abilities.join(', ')}}</p>
    <p v-if="aspect.abilities_numerals" class="skills"><strong>Přidává:</strong> {{ aspect.abilities_numerals}}</p>    
    <p v-if="aspect.abilities_upgraded" class="skills"><strong>Vylepšení:</strong> {{ aspect.abilities_upgraded.join(', ')}}</p>
    <p v-if="aspect.upgrade_description" class="skills"><strong>Popis vylepšení:</strong> {{ aspect.upgrade_description }}</p>
    <p v-if="aspect.upgrade_reqs_description" class="reqs"><strong>Požadavky na vylepšení:</strong> {{ aspect.upgrade_reqs_description }}</p>
    <div v-if="showButtons" class="buttons">
      <button
        @click="emit('toggle')"
        class="btn"
        :class="{ 'disabled': !aspect.unlocked }"
      >{{ aspect.selected ? 'Odebrat' : 'Vybrat' }}</button>
      <button
        @click="emit('close')"
        class="btn"
      >Zavřít</button>
    </div>
  </div>
</template>

<style scoped>
  @media (max-width: 849px) {
    .container {
      width: calc(100% - 48px) !important;
      max-width: 440px;
      position: fixed !important;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .container {
    position: absolute;
    width: 240px;
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
    font-family: serif;
    font-size: 13px;
    text-align: left;
    color: black;
  }
  .container::-webkit-scrollbar {width: 4px;}
  .container::-webkit-scrollbar-thumb {background: #d4af37; border-radius: 2px;}
  h4 {margin: 0 0 6px 0; color: black; font-size: 15px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);}
  hr {color: rgba(212, 175, 55, 0.4); }
  p {margin: 4px 0; line-height: 1.3; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);}
  .reqs {color: #ff6b6b;}
  .buttons { width: 100%; margin-top: 12px; display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap; gap: 12px; }
  .btn { min-width: 131px; height: 45px; filter: brightness(0.8); z-index: 10; transition: all 0.2s ease; background-image: url('/images/race_button.webp'); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; background-color: transparent; border: none; font-family: serif; color: white; padding: 0 15px; cursor: pointer;}
  .btn.disabled { filter: saturate(0); cursor: not-allowed; }
</style>
