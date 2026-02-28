export interface AspectList {
    skill_name: string;
    name: string;
    type_color: string;
    hp?: number; //až budu dělat logiku vybrání aspektu pro věci s ? přidat toto(hp nahradit za příslušný element): (item.hp ?? 0), v případě textu (item.text ?? "")
    power_words?: number;
    potions?: number;
    equipment?: string[];
    abilities?: string[];
    unlocks?: string[]; //Jaké schoposti odemiká - children
    unlocked_by?: string[]; //Jakými schoposti je odemikána - parents
    abilities_upgraded?: string[]; //Jak vypadají VŠECHNY schopnosti po vylepšení
    upgrade_description?: string;
    upgrade_reqs_description?: string;
    upgrade_type?: string; //red, blue, yellow, green, lvl
    upgrade_value?: number;
    upgraded?: boolean;
    it_upgrades?: string[];
    postion_y?:number;
    position_x?:number;
    selected: boolean;
    unlocked: boolean;
    hidden?: boolean;
    pressed_aspect: () => void;
}

export interface RaceList{
    race_name: string;
    name: string;
    race: string;
    subrace: boolean;
    hp?: number;
    potions?: number;
    power_words?: number;
    abilities?: string[];

}