// ==========================================
// 1. БАЗОВЫЕ ТИПЫ (ГЕОМЕТРИЯ)
// ==========================================
export interface Position { x: number; y: number; z: number; }
export interface Dimensions { width: number; height: number; depth: number; }
export interface PartData { id: string; name: string; dimensions: Dimensions; position: Position; }

// ==========================================
// 2. ГЛАВНЫЙ КОНТЕКСТ МЕБЕЛИ
// ==========================================
export type FurnitureCategory = 
  | 'kitchen_base'       
  | 'kitchen_wall'       
  | 'kitchen_tall'       
  | 'kitchen_island'     // <-- НОВОЕ: Кухонный остров
  | 'wardrobe_swing'     
  | 'wardrobe_sliding'   
  | 'wardrobe_folding'   
  | 'wardrobe_walk_in'   
  | 'vanity_bathroom'    
  | 'tv_unit';           

// ==========================================
// 3. ФУРНИТУРА И МЕХАНИЗМЫ (Hardware)
// ==========================================
export interface HardwareConfig {
  drawers: 'blum_tandembox' | 'blum_legrabox' | 'blum_merivobox' | 'blum_movento' | 'hettich_avantech' | 'hettich_quadro' | 'boyard_b_box' | 'side_ball_bearing' | 'roller';
  hinges: 'standard_110' | 'wide_angle_155' | 'blind_corner_90' | 'pie_corner_45' | 'glass_door' | 'push_to_open';
  slidingSystem: 'none' | 'bottom_rolling_standard' | 'top_hung_hettich_topline' | 'coplanar_system' | 'folding_hettich_wingline';
  lifts: 'none' | 'blum_aventos_hf' | 'blum_aventos_hk' | 'blum_aventos_hl' | 'blum_aventos_hs' | 'gas_strut';
  
  handleProfile: 
    | 'none' | 'standard_handle' | 'push_to_open' | 'frez_mdf' 
    | 'gola_horizontal_c' | 'gola_horizontal_l' | 'gola_vertical_single' | 'gola_vertical_double'
    | 'schuco_edge_profile'
    | 'classic_knob' | 'classic_drop'; // <-- НОВОЕ: Классические ручки (кнопка, капля)
}

// ==========================================
// 4. НАПОЛНЕНИЕ, АКСЕССУАРЫ И СВЕТ
// ==========================================
export type KitchenAccessory = 
  | 'none' | 'magic_corner' | 'le_mans' | 'cargo_bottle_150' | 'cargo_bottle_200' 
  | 'pull_out_column_dispensa' | 'dish_drainer_600' | 'dish_drainer_800' 
  | 'waste_bin_pull_out' | 'cutlery_tray_volpato'
  | 'wine_cross_rack' // <-- НОВОЕ: Крестовая бутылочница (классика/остров)
  | 'plate_rack_classic'; // <-- НОВОЕ: Открытая тарелочница

export type WardrobeAccessory = 'none' | 'pantograph_lift' | 'shoe_rack_pull_out' | 'trouser_rack' | 'tie_belt_rack' | 'jewelry_tray' | 'laundry_basket_pull_out' | 'mirror_pull_out';

export type ApplianceType = 'none' | 'oven' | 'microwave' | 'compact_oven_microwave' | 'fridge_built_in' | 'fridge_freestanding' | 'fridge_side_by_side' | 'dishwasher_450' | 'dishwasher_600' | 'washing_machine' | 'hob_induction' | 'hob_gas' | 'hood_built_in' | 'hood_wall' | 'hood_island' | 'wine_cooler' | 'coffee_machine';
export interface ApplianceSlot { type: ApplianceType; position: 'bottom' | 'middle' | 'top' | 'worktop'; }

export interface LightingConfig {
  exists: boolean;
  profileType: 'none' | 'mortise_vertical' | 'mortise_horizontal' | 'surface_mounted';
  colorTemperature: 'warm_3000k' | 'neutral_4000k' | 'cold_6000k';
  sensor: 'none' | 'ir_door' | 'ir_wave' | 'touch' | 'motion_pir';
}

// ==========================================
// 5. ДЕКОР И КЛАССИКА (НОВЫЙ БЛОК ДЛЯ ИИ)
// ==========================================
export interface ClassicDecorConfig {
  style: 'modern' | 'classic' | 'neoclassic' | 'provence' | 'loft'; // Стиль кухни
  topCornice: boolean;      // Верхний декоративный карниз (багет)
  bottomValance: boolean;   // Нижняя световая планка (под навесными шкафами)
  pilasters: boolean;       // Пилястры (декоративные колонны между фасадами)
  balusters: boolean;       // Балясины (точеные опоры для острова/барной стойки)
  corbels: boolean;         // Менсолодержатели / Капители
}

// ==========================================
// 6. КОНСТРУКТИВНЫЕ БЛОКИ (Модули)
// ==========================================
export interface BaseConfig {
  exists: boolean;
  type: 'legs_with_plinth' | 'plinth_box' | 'decorative_legs' | 'suspended';
  height: number;
}

export interface MezzanineConfig { exists: boolean; height: number; doors: 'none' | 'swing' | 'lift'; }

export interface BottomSectionConfig {
  exists: boolean;
  type: 'drawers' | 'doors' | 'dishwasher_space' | 'fridge_space';
  count: number;
  height: number;
  kitchenAccessories: KitchenAccessory[];
}

export interface MainSectionConfig {
  shelvesCount: number;
  doors: 'none' | 'swing' | 'sliding' | 'folding';
  wardrobeAccessories: WardrobeAccessory[];
  kitchenAccessories: KitchenAccessory[];
}

export interface WorktopConfig {
  exists: boolean;
  type: 'hpl_38mm' | 'compact_laminate_12mm' | 'stone_quartz_20mm' | 'acrylic_solid_surface';
  overhangFront: number; // Свес столешницы спереди (обычно 40мм)
  overhangBack: number;  // Свес сзади
  overhangBar: number;   // <-- НОВОЕ: Свес для барной стойки/острова (обычно 250-300мм)
}

// ==========================================
// 7. ГЛАВНЫЙ СБОРОЧНЫЙ ЧЕРТЕЖ
// ==========================================
export interface FurnitureConfig {
  category: FurnitureCategory; 
  width: number; height: number; depth: number; thickness: number;
  
  bodyMaterial: string;   
  facadeMaterial: string; 
  
  hardware: HardwareConfig;
  appliances: ApplianceSlot[]; 
  lighting: LightingConfig;
  classicDecor: ClassicDecorConfig; // <-- Подключили декор балясин и карнизов!
  
  base: BaseConfig;
  worktop: WorktopConfig; 
  mezzanine: MezzanineConfig;
  bottomSection: BottomSectionConfig;
  mainSection: MainSectionConfig;
}

// ==========================================
// 8. СТАНДАРТЫ МАТЕРИАЛОВ
// ==========================================
export interface MaterialSheet { id: string; name: string; length: number; width: number; thickness: number; type: 'wood' | 'glass' | 'mdf_painted' | 'acrylic' | 'stone' | 'mirror'; }
export const SHEET_FORMATS: Record<string, MaterialSheet> = {
  'format_3660': { id: 'format_3660', name: 'ЛДСП 3660x1830', length: 3660, width: 1830, thickness: 18, type: 'wood' },
  'format_2800': { id: 'format_2800', name: 'ЛДСП 2800x2070 (Egger)', length: 2800, width: 2070, thickness: 18, type: 'wood' },
  'format_2800_1220': { id: 'format_2800_1220', name: 'МДФ Пленка/Эмаль 2800x1220', length: 2800, width: 1220, thickness: 18, type: 'mdf_painted' },
  'glass_clear_4mm': { id: 'glass_clear_4mm', name: 'Стекло прозрачное 4мм', length: 3210, width: 2250, thickness: 4, type: 'glass' },
  'worktop_hpl_4100': { id: 'worktop_hpl_4100', name: 'Столешница 4100x600', length: 4100, width: 600, thickness: 38, type: 'wood' }
};
