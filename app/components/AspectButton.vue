<script setup lang="ts">
defineProps<{
  buttons: AspectList[]
}>()

</script>

<template>
  <div class="tree-container">
    <template v-for="btn in buttons" :key="btn.skill_name">
      <button
        v-if="!btn.hidden"
        @click="btn.pressed_aspect()"
        :title="`${btn.skill_name}\nSlova moci: ${btn.power_words ?? ''}\nPočet lektvarů: ${btn.potions ?? ''}\nBonusové životy:${btn.hp ?? ''}\nOdemknuto: ${btn.unlocked_by ?? ''}\nOdemiká: ${btn.unlocks ?? ''}\n${btn.abilities}\n${btn.upgrade_description ?? ''}\n${btn.upgrade_reqs_description ?? ''}\nOdemiká vybavení${btn.equipment ?? ''}\n${btn.abilities_upgraded ?? ''}\nOdemknuto: ${btn.unlocked_by ?? ''}`"
        :style="{ 
          backgroundColor: !btn.unlocked ? 'grey': btn.type_color,
          opacity: !btn.selected&& btn.unlocked ? 0.5 : 0.9,
          gridColumn: btn.position_x,
          gridRow: btn.postion_y
      }"
        class="custom-btn"
      >
        {{ btn.skill_name }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.custom-btn { padding: 10px 10px; color: black;  cursor: pointer; border-radius: 3px; border-color: grey; width: 131px; height: 45px;}
.tree-container {  display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(10, 35px); gap: 20px; position: relative;}
.stats {min-width: 100px;}
#reset-btn:hover {background-color: #c0392b;}
</style>