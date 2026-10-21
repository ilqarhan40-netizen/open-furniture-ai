import { create } from 'zustand';
import { FurnitureConfig, PartData } from '../types';

// Описание того, что хранится в оперативной памяти движка
interface AppState {
  config: FurnitureConfig; // Текущие параметры мебели
  parts: PartData[];       // Массив готовых 3D-деталей
  updateConfig: (newConfig: Partial<FurnitureConfig>) => void; // Функция для изменения настроек
}

// Дефолтная (стартовая) модель, которая загружается до команд ИИ
const initialConfig: FurnitureConfig = {
  category: 'kitchen_base', 
  width: 600,
  height: 860, // Общая высота со столешницей и ножками
  depth: 560,
  thickness: 18,
  
  bodyMaterial: 'format_2800',
  facadeMaterial: 'format_2800_1220',
  
  hardware: {
    drawers: 'blum_tandembox',
    hinges: 'standard_110',
    slidingSystem: 'none',
    lifts: 'none',
    handleProfile: 'gola_horizontal_c' // По умолчанию современная кухня без ручек
  },
  
  appliances: [], 
  lighting: { exists: false, profileType: 'none', colorTemperature: 'neutral_4000k', sensor: 'none' },
  classicDecor: { style: 'modern', topCornice: false, bottomValance: false, pilasters: false, balusters: false, corbels: false },
  
  base: { exists: true, type: 'legs_with_plinth', height: 100 }, // Ножки 100 мм
  worktop: { exists: true, type: 'hpl_38mm', overhangFront: 40, overhangBack: 50, overhangBar: 0 },
  
  mezzanine: { exists: false, height: 0, doors: 'none' },
  bottomSection: { exists: true, type: 'doors', count: 1, height: 722, kitchenAccessories: [] },
  mainSection: { shelvesCount: 1, doors: 'swing', wardrobeAccessories: [], kitchenAccessories: [] }
};

// Создаем глобальное хранилище (Zustand)
export const useStore = create<AppState>((set) => ({
  config: initialConfig,
  parts: [], // Пока пусто, пересчет деталей добавим на следующем шаге
  
  updateConfig: (newConfig) =>
    set((state) => {
      const mergedConfig = { ...state.config, ...newConfig };
      return { config: mergedConfig };
    }),
}));
