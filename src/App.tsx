import React, { useState } from 'react';

export default function App() {
  const [config, setConfig] = useState({
    H: 2200, W: 600, D: 550, shelves: 4, assembly: 'nakladnoe' as 'nakladnoe' | 'bokovoe'
  });
  
  // В стартовый промпт сразу вписал человеческий текст с метрами и сантиметрами
  const [prompt, setPrompt] = useState('Сделай шкаф: высота 2.2 метра, ширина 60 см, глубина 550. Три полки, сборка накладная.');
  const [status, setStatus] = useState('');

  const T = 18; 
  const L = 0;  

  const analyzeText = () => {
    setStatus('Анализ текста...');
    
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      let newConfig = { ...config };

      // Умная функция поиска размеров (понимает слова, цифры и единицы измерения: м, см, мм)
      const extractDimension = (text: string, keywords: string[]) => {
        for (let kw of keywords) {
          // Ищет шаблоны: "высота 2.2 м", "60 см ширина", "110h"
          const regexes = [
            new RegExp(`${kw}\\s*[:=-]?\\s*(\\d+[.,]?\\d*)\\s*(см|мм|метр|м)?`, 'i'),
            new RegExp(`(\\d+[.,]?\\d*)\\s*(см|мм|метр|м)?\\s*${kw}`, 'i')
          ];

          for (let r of regexes) {
            const match = text.match(r);
            if (match) {
              let val = parseFloat(match[1].replace(',', '.'));
              let unit = match[2] ? match[2] : '';
              
              // Перевод в миллиметры
              if (unit.startsWith('см')) {
                val *= 10;
              } else if (unit.startsWith('м') && !unit.startsWith('мм') && val < 10) {
                // Если указано "м" или "метр" и число маленькое (например, 2 или 2.5) -> умножаем на 1000
                val *= 1000;
              }
              return Math.round(val);
            }
          }
        }
        return null;
      };

      // Ищем высоту, ширину и глубину по ключевым словам
      const parsedH = extractDimension(lower, ['высот', 'h', 'х']);
      if (parsedH) newConfig.H = parsedH;

      const parsedW = extractDimension(lower, ['ширин', 'длин', 'l', 'л']);
      if (parsedW) newConfig.W = parsedW;

      const parsedD = extractDimension(lower, ['глубин', 'd']);
      if (parsedD) newConfig.D = parsedD;

      // Ищем количество полок
      if (lower.includes('одна') || lower.includes('1 полк')) newConfig.shelves = 1;
      if (lower.includes('две') || lower.includes('2 полк')) newConfig.shelves = 2;
      if (lower.includes('три') || lower.includes('3 полк')) newConfig.shelves = 3;
      if (lower.includes('четыре') || lower.includes('4 полк')) newConfig.shelves = 4;
      if (lower.includes('пять') || lower.includes('5 полк')) newConfig.shelves = 5;

      // Ищем тип сборки
      if (lower.includes('боков') || lower.includes('вкладн')) newConfig.assembly = 'bokovoe';
      if (lower.includes('наклад')) newConfig.assembly = 'nakladnoe';

      setConfig(newConfig);
      setStatus('Готово! Размеры пересчитаны в миллиметры.');
    }, 600);
  };

  const sideH = config.assembly === 'nakladnoe' ? config.H - L - (T * 2) : config.H - L;
  const topBottomW = config.assembly === 'nakladnoe' ? config.W : config.W - (T * 2);
  const shelfW = config.W - (T * 2);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <div className="w-96 bg-gray-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">Промпт-интерфейс</h1>
          <p className="text-xs text-gray-400 mt-1">Понимает метры (м), сантиметры (см) и слова</p>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-end bg-gray-800">
          
          <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-700">
            <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Распознано системой (в мм):</h3>
            <ul className="text-sm text-green-400 font-mono space-y-1">
              <li>Высота (H): {config.H}</li>
              <li>Ширина (W): {config.W}</li>
              <li>Глубина (D): {config.D}</li>
              <li>Полок: {config.shelves}</li>
              <li>Сборка: {config.assembly === 'nakladnoe' ? 'Накладная' : 'Боковая'}</li>
            </ul>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white text-gray-900 border-0 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={5}
          ></textarea>
          
          <button
            onClick={analyzeText}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition"
          >
            Рассчитать проект
          </button>
          <div className="text-center mt-2 text-xs text-green-400 h-4">{status}</div>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ */}
      <div className="flex-1 p-10 overflow-auto bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow border border-gray-200">
          <div className="border-b pb-4 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-gray-800">Спецификация (Распил)</h2>
              <p className="text-gray-500 mt-1">
                Крепление: <span className="font-bold text-blue-600 uppercase">{config.assembly === 'nakladnoe' ? 'Накладное' : 'Боковое'}</span>
              </p>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-y border-gray-300">
                <th className="p-4 font-bold text-gray-700 w-12">№</th>
                <th className="p-4 font-bold text-gray-700">Наименование</th>
                <th className="p-4 font-bold text-gray-700 w-32">Длина (мм)</th>
                <th className="p-4 font-bold text-gray-700 w-32">Ширина (мм)</th>
                <th className="p-4 font-bold text-gray-700 w-24 text-center">Шт</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-400">1</td>
                <td className="p-4 font-medium">Боковина (лев/прав)</td>
                <td className="p-4 font-mono font-bold text-blue-700 bg-blue-50">{sideH}</td>
                <td className="p-4 font-mono">{config.D}</td>
                <td className="p-4 font-mono text-center">2</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-400">2</td>
                <td className="p-4 font-medium">Крышка / Дно</td>
                <td className="p-4 font-mono font-bold text-blue-700 bg-blue-50">{topBottomW}</td>
                <td className="p-4 font-mono">{config.D}</td>
                <td className="p-4 font-mono text-center">2</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-400">3</td>
                <td className="p-4 font-medium">Полка жесткая</td>
                <td className="p-4 font-mono font-bold text-blue-700 bg-blue-50">{shelfW}</td>
                <td className="p-4 font-mono">{config.D}</td>
                <td className="p-4 font-mono text-center">{config.shelves}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
