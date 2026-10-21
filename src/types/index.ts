// --- БАЗОВЫЕ ТИПЫ ---
export interface Position { x: number; y: number; z: number; }
export interface Dimensions { width: number; height: number; depth: number; }
export interface PartData { id: string; name: string; dimensions: Dimensions; position: Position; }

// --- 1. ГЛАВНЫЙ КОНТЕКСТ ---
export type FurnitureCategory = 'kitchen_base' | 'kitchen_wall' | 'kitchen_tall' | 'wardrobe_swing' | 'wardrobe_sliding';

// --- 2. БАЗА ФУРНИТУРЫ (МЕХАНИЗМЫ) ---
export interface HardwareConfig {
  drawers: 'blum_tandembox' | 'blum_legrabox' | 'blum_movento' | 'side_ball_bearing';
  doors: 'blum_clip_top' | 'blum_push_to_open' | 'sliding_system_topline';
  lifts: 'blum_aventos_hk' | 'blum_aventos_hf' | 'none';
}

// --- 3. НАПОЛНЕНИЕ И ТЕХНИКА ---
export type AccessoryType = 'wardrobe_lift' | 'pull_out_basket' | 'shoe_rack' | 'none';
export type ApplianceType = 'none' | 'oven' | 'microwave' | 'fridge' | 'dishwasher' | 'washing_machine';
export interface ApplianceSlot { type: ApplianceType; position: 'bottom' | 'middle' | 'top'; }

// --- 4. МОДУЛИ ШКАФА ---

// НОВЫЙ БЛОК: Цокольная база (Ножки)
export interface BaseConfig {
  exists: boolean;
  type: 'legs_with_plinth' /* Скрытые пластиковые ножки + цокольная планка */
      | 'plinth_box'       /* Короб из ЛДСП (часто у гардеробов) */
      | 'decorative_legs'  /* Открытые ножки (лофт, металл) */
      | 'suspended';       /* Подвесной (навесная тумба) */
  height: number;          // Высота (мм): 100, 120, 150 для кухонь; 50-100 для шкафов
}

export interface MezzanineConfig {
  exists: boolean;
  height: number;
  doors: 'none' | 'swing' | 'lift';
}

export interface BottomSectionConfig {
  exists: boolean;
  type: 'drawers' | 'doors' | 'dishwasher_space';
  count: number;
  height: number; // Высота самого блока (без учета ножек)
}

export interface MainSectionConfig {
  shelvesCount: number;
  doors: 'none' | 'swing' | 'sliding';
  accessories: AccessoryType[];
}

// --- 5. ГЛАВНАЯ КОНФИГУРАЦИЯ ---
export interface FurnitureConfig {
  category: FurnitureCategory; 
  
  width: number;
  height: number;  // ВАЖНО: Это общая высота габарита (включая ножки)
  depth: number;
  thickness: number;
  
  bodyMaterial: string;
  facadeMaterial: string;
  
  hardware: HardwareConfig;
  appliances: ApplianceSlot[]; 
  
  // Компоненты конструкции
  base: BaseConfig; // <-- Добавили цоколь сюда!
  mezzanine: MezzanineConfig;
  bottomSection: BottomSectionConfig;
  mainSection: MainSectionConfig;
}

// --- БЛОК СТАНДАРТОВ МАТЕРИАЛОВ ---
export interface MaterialSheet {
  id: string; name: string; length: number; width: number; thickness: number;
}
export const SHEET_FORMATS: Record<string, MaterialSheet> = {
  'format_3660': { id: 'format_3660', name: 'ЛДСП 3660x1830', length: 3660, width: 1830, thickness: 18 },
  'format_2800': { id: 'format_2800', name: 'ЛДСП 2800x2070 (Egger)', length: 2800, width: 2070, thickness: 18 },
  'format_2800_1220': { id: 'format_2800_1220', name: 'МДФ 2800x1220 (AGT)', length: 2800, width: 1220, thickness: 18 },
};
