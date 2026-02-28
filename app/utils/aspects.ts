import rawData from '~/assets/skill.json'
import rawDataRace from '~/assets/race.json'

export const aspectList = ref<AspectList[]>(rawData.map(item => ({...item,
  selected: item.selected || false,
  it_upgrades: item.it_upgrades || ["self"],
  unlocked: item.unlocked_by === undefined ? true : false,
  pressed_aspect: function() { toggleAspect(this); }
})))

export const selectedRace = ref('');
export const selectedSubrace = ref('');
export const selectedRaceData = computed(() => {
  return rawDataRace.find(r => r.name === selectedSubrace.value) || 
         rawDataRace.find(r => r.name === selectedRace.value);
});

export const toggleAspect = (aspect: AspectList) => {
  if(!aspect.unlocked)return;
  aspect.selected=!aspect.selected;
  updateUnlocks();
  checkUpgrade();
};

export const selectedAspects = computed(() => {
  return aspectList.value.filter(item => item.selected)
})

const updateUnlocks = () => {
  aspectList.value.forEach(aspect => {
    if(!aspect.unlocked_by || !aspect.unlocked_by.length){
      aspect.unlocked = true;
      return;
    }
    const reqMet = aspect.unlocked_by.every(req => {
      const reqAspect = aspectList.value.find(a => a.name === req);
      return reqAspect?.selected;
    });
    aspect.unlocked = reqMet;
    if(!aspect.unlocked){
      aspect.selected = false;
    }
  })
}

const checkUpgrade = () => {
  aspectList.value.forEach(a => a.upgraded = false);
  const stats = {
    lvl: -1,
    red: 0,
    green: 0,
    blue: 0,
    yellow: 0
  };
  aspectList.value.forEach(aspect => {
    if(!aspect.selected)return;
    stats.lvl++;
    const color = aspect.type_color as keyof typeof stats;
    if (color in stats) {
      (stats[color] as number)++;
    }
  });
  const upgradeSources = aspectList.value.filter(aspect => {
    if(!aspect.selected)return false;
    if(aspect.upgrade_type === 'lvl') return stats.lvl >= (aspect.upgrade_value || 0);
    const colorKey = aspect.upgrade_type as keyof typeof stats;
    if (colorKey && colorKey in stats) {
      return (stats[colorKey] as number) >= (aspect.upgrade_value || 0);
    }
    return false;
  });
  upgradeSources.forEach(source => {
    const targets = source.it_upgrades || ["self"];
    targets.forEach(target => {
      if(target === "self"){
        source.upgraded = true;
      }
      else {
      aspectList.value.forEach(a => {
        if (a.type_color === target && a.selected) a.upgraded = true;
      });
      const targetByName = aspectList.value.find(a => a.name === target);
      if (targetByName && targetByName.selected) targetByName.upgraded = true;
    }
    });
  });
};

const upgrStatBonuses = (abilites: string[], suffix: string): number => {
  let count = 0;
  const regex = new RegExp(`(\\d+)${suffix}`, 'i');

  abilites.forEach(ability => {
    const match = ability.match(regex);
    if (match&& match[1]) {
      count += parseInt(match[1], 10);
    }
  });
  return count;
}

export const copmHp = computed(() => {
  const aspectHp = selectedAspects.value.reduce((acc, aspect) => {
    let val = aspect.hp || 0;
    const abilites = (aspect.upgraded && aspect.abilities_upgraded) ? aspect.abilities_upgraded : (aspect.abilities || []);
    val += upgrStatBonuses(abilites, 'hp');
    return acc + val
  }, 0);
  const raceHp = (selectedRaceData.value as any)?.hp || 0;
  return aspectHp + raceHp;
});

export const compPowerWords = computed(() => {
  const aspectPw = selectedAspects.value.reduce((acc, aspect) => {
    return acc + (aspect.power_words || 0)}, 0
  );
  const racePw= (selectedRaceData.value as any)?.power_words || 0;
  return aspectPw + racePw;
});

export const compPotions = computed(() => {
  const aspectPots = selectedAspects.value.reduce((acc, aspect) => {
    return acc + (aspect.potions || 0)}, 0
  );
  const racePots= (selectedRaceData.value as any)?.potions || 0;
  return aspectPots + racePots;
});

export const compAbilities = computed(() => {
  const dynamicAbilities = selectedAspects.value.flatMap(aspect => {
    const abilities = (aspect.upgraded && aspect.abilities_upgraded) ? aspect.abilities_upgraded : (aspect.abilities || []);
    return abilities.filter(ability => {
      const bonus = /(\d+)(hp|pt|pw)/i.test(ability);
      return !bonus;
    });
  });
  const raceAbilities = (selectedRaceData.value as any)?.abilities || [];
  return [...raceAbilities, ...dynamicAbilities];
});

export const compEquipment = computed(() => {
  return selectedAspects.value.flatMap(aspect => aspect.equipment || [])
});

export const actLevel = computed(() => {
  return selectedAspects.value.reduce((acc, aspect) => {
    return acc + 1}, -1);
});

export const reset = () => {
  aspectList.value = rawData.map(item => ({...item,
    selected: item.selected || false,
    it_upgrades: item.it_upgrades || ["self"],
    unlocked: item.unlocked_by === undefined || item.unlocked_by.length === 0,
    upgraded: false,
    pressed_aspect: function() { toggleAspect(this as AspectList); }
  }));
  updateUnlocks();
  checkUpgrade();
  
}