import { FurnitureConfig, PartData } from '../types';

export class CabinetBuilder {
  static build(config: FurnitureConfig): PartData[] {
    const parts: PartData[] = [];
    const { width, height, depth, thickness } = config;

    // 1. Левая стойка
    parts.push({
      id: 'panel-left',
      name: 'left_panel',
      dimensions: { width: thickness, height: height, depth: depth },
      position: { x: 0, y: height / 2, z: depth / 2 },
    });

    // 2. Правая стойка
    parts.push({
      id: 'panel-right',
      name: 'right_panel',
      dimensions: { width: thickness, height: height, depth: depth },
      position: { x: width - thickness, y: height / 2, z: depth / 2 },
    });

    // 3. Дно
    parts.push({
      id: 'panel-bottom',
      name: 'bottom_panel',
      dimensions: { width: width - (thickness * 2), height: thickness, depth: depth },
      position: { x: width / 2 - thickness, y: thickness / 2, z: depth / 2 },
    });

    // 4. Крыша
    parts.push({
      id: 'panel-top',
      name: 'top_panel',
      dimensions: { width: width - (thickness * 2), height: thickness, depth: depth },
      position: { x: width / 2 - thickness, y: height - thickness / 2, z: depth / 2 },
    });

    return parts;
  }
}
