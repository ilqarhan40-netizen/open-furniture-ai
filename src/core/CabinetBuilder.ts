import { FurnitureConfig, PartData } from '../types';

export class CabinetBuilder {
  static build(config: FurnitureConfig): PartData[] {
    const parts: PartData[] = [];
    const { width, height, depth, thickness, category, base, worktop, hardware, mainSection, bottomSection } = config;

    // --- 1. ВНЕШНИЕ ГАБАРИТЫ И ЦОКОЛЬ ---
    const baseHeight = base.exists ? base.height : 0;
    let worktopThickness = 0;
    if (worktop && worktop.exists && (category === 'kitchen_base' || category === 'kitchen_island')) {
      worktopThickness = worktop.type === 'hpl_38mm' ? 38 : (worktop.type === 'compact_laminate_12mm' ? 12 : 20);
    }
    const cabinetHeight = height - baseHeight - worktopThickness;

    // Каркас (Стойки, Дно, Крыша)
    parts.push({ id: 'panel-left', name: 'left_side', dimensions: { width: thickness, height: cabinetHeight, depth: depth }, position: { x: 0, y: baseHeight + (cabinetHeight / 2), z: depth / 2 } });
    parts.push({ id: 'panel-right', name: 'right_side', dimensions: { width: thickness, height: cabinetHeight, depth: depth }, position: { x: width - thickness, y: baseHeight + (cabinetHeight / 2), z: depth / 2 } });
    parts.push({ id: 'panel-bottom', name: 'bottom', dimensions: { width: width - (thickness * 2), height: thickness, depth: depth }, position: { x: width / 2 - thickness, y: baseHeight + (thickness / 2), z: depth / 2 } });
    
    // Если это нижняя база кухни, вместо цельной крыши обычно ставят две царги (планки), но для упрощения пока оставим крышу
    parts.push({ id: 'panel-top', name: 'top', dimensions: { width: width - (thickness * 2), height: thickness, depth: depth }, position: { x: width / 2 - thickness, y: baseHeight + cabinetHeight - (thickness / 2), z: depth / 2 } });

    // --- 2. УМНАЯ ПАРАМЕТРИКА ВНУТРЯНКИ ---
    
    // Внутренняя ширина шкафа
    const internalWidth = width - (thickness * 2);
    
    // АВТО-ГЛУБИНА: Если это шкаф-купе, утапливаем всю внутрянку на 100 мм под рельсы!
    const internalDepth = category === 'wardrobe_sliding' ? depth - 100 : depth - 20; // -20мм отступ от фасада по умолчанию
    const internalZPosition = internalDepth / 2; // Центр для внутренних деталей

    // Внутренняя высота (чистое пространство между дном и крышей)
    let internalHeight = cabinetHeight - (thickness * 2);
    let currentY = baseHeight + thickness; // Начинаем отсчет от дна шкафа

    // --- 3. АВТО-РАСЧЕТ ЯЩИКОВ (Учет фурнитуры) ---
    if (bottomSection && bottomSection.exists && bottomSection.type === 'drawers' && bottomSection.count > 0) {
      const drawerBlockHeight = bottomSection.height;
      const singleDrawerFrontHeight = drawerBlockHeight / bottomSection.count; // Высота одного фасада ящика
      
      // АВТО-ЗАЗОРЫ по фурнитуре:
      let hardwareClearance = 0;
      if (hardware.drawers === 'side_ball_bearing') hardwareClearance = 26; // Шариковые (по 13мм с боков)
      if (hardware.drawers === 'blum_tandembox') hardwareClearance = 31;    // Blum (специфичный зазор)
      if (hardware.drawers === 'hettich_quadro') hardwareClearance = 21;    // Hettich (скрытые)

      const drawerBoxWidth = internalWidth - hardwareClearance;

      for (let i = 0; i < bottomSection.count; i++) {
        // Здесь мы генерируем "виртуальный" блок ящика. 
        // В будущем он разобьется на дно ящика, заднюю стенку и боковины.
        parts.push({
          id: `drawer-${i}`,
          name: `drawer_box_${hardware.drawers}`, // Имя содержит тип фурнитуры!
          dimensions: { width: drawerBoxWidth, height: singleDrawerFrontHeight - 20, depth: internalDepth - 50 },
          position: { 
            x: width / 2 - thickness, 
            y: currentY + (singleDrawerFrontHeight * i) + (singleDrawerFrontHeight / 2), 
            z: internalZPosition 
          }
        });
      }
      
      // Поднимаем стартовую точку для полок выше ящиков
      currentY += drawerBlockHeight;
      internalHeight -= drawerBlockHeight;
    }

    // --- 4. АВТО-РАСЧЕТ ПОЛОК ---
    if (mainSection && mainSection.shelvesCount > 0) {
      // Делим оставшуюся высоту на равные отсеки
      const gapBetweenShelves = (internalHeight - (thickness * mainSection.shelvesCount)) / (mainSection.shelvesCount + 1);
      
      for (let i = 0; i < mainSection.shelvesCount; i++) {
        const shelfY = currentY + gapBetweenShelves + (i * (gapBetweenShelves + thickness)) + (thickness / 2);
        
        parts.push({
          id: `shelf-${i}`,
          name: 'inner_shelf',
          // Ширина полки = внутренняя ширина. Глубина = авто-глубина (учитывает купе это или нет)
          dimensions: { width: internalWidth, height: thickness, depth: internalDepth },
          position: { x: width / 2 - thickness, y: shelfY, z: internalZPosition },
        });
      }
    }

    return parts;
  }
}
