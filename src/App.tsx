import React, { useState } from 'react';

export default function App() {
  const [config, setConfig] = useState({
    H: 2200, W: 600, D: 550, shelves: 4, assembly: 'nakladnoe' as 'nakladnoe' | 'bokovoe'
  });
  
  const [prompt, setPrompt] = useState('Сделай шкаф: высота 2.2 метра, ширина 60 см, глубина 550. Четыре полки, сборка накладная.');
  const [status, setStatus] = useState('');
  
  // Добавляем переключатель вкладок
  const [activeTab, setActiveTab] = useState<'render' | '2d' | 'details'>('render');

  const T = 18; // Толщина ЛДСП
  const L = 0;  // Цоколь

  const analyzeText = () => {
    setStatus('Анализ текста и генерация...');
    
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      let newConfig = { ...config };

      const extractDimension = (text: string, keywords: string[]) => {
        for (let kw of keywords) {
          const regexes = [
            new RegExp(`${kw}\\s*[:=-]?\\s*(\\d+[.,]?\\d*)\\s*(см|мм|метр|м)?`, 'i'),
            new RegExp(`(\\d+[.,]?\\d*)\\s*(см|мм|метр|м)?\\s*${kw}`, 'i')
          ];
          for (let r of regexes) {
            const match = text.match(r);
            if (match) {
              let val = parseFloat(match[1].replace(',', '.'));
              let unit = match[2] ? match[2] : '';
              if (unit.startsWith('см')) val *= 10;
              else if (unit.startsWith('м') && !unit.startsWith('мм') && val < 10) val *= 1000;
              return Math.round(val);
            }
          }
        }
        return null;
      };

      const parsedH = extractDimension(lower, ['высот', 'h', 'х']);
      if (parsedH) newConfig.H = parsedH;

      const parsedW = extractDimension(lower, ['ширин', 'длин', 'l', 'л']);
      if (parsedW) newConfig.W = parsedW;

      const parsedD = extractDimension(lower, ['глубин', 'd']);
      if (parsedD) newConfig.D = parsedD;

      if (lower.includes('одна') || lower.includes('1 полк')) newConfig.shelves = 1;
      if (lower.includes('две') || lower.includes('2 полк')) newConfig.shelves = 2;
      if (lower.includes('три') || lower.includes('3 полк')) newConfig.shelves = 3;
      if (lower.includes('четыре') || lower.includes('4 полк')) newConfig.shelves = 4;
      if (lower.includes('пять') || lower.includes('5 полк')) newConfig.shelves = 5;

      if (lower.includes('боков') || lower.includes('вкладн')) newConfig.assembly = 'bokovoe';
      if (lower.includes('наклад')) newConfig.assembly = 'nakladnoe';

      setConfig(newConfig);
      setStatus('Готово! Проект сгенерирован.');
      
      // Автоматически переключаем на картинку после генерации
      setActiveTab('render');
    }, 800);
  };

  // МАТЕМАТИКА РАСПИЛА
  const sideH = config.assembly === 'nakladnoe' ? config.H - L - (T * 2) : config.H - L;
  const topBottomW = config.assembly === 'nakladnoe' ? config.W : config.W - (T * 2);
  const shelfW = config.W - (T * 2);

  // Расчет расстояния между полками для чертежа
  const innerH = config.H - (T * 2);
  const gap = innerH / (config.shelves + 1);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* ЛЕВАЯ ПАНЕЛЬ: ЧАТ */}
      <div className="w-96 bg-gray-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">Промпт-интерфейс</h1>
          <p className="text-xs text-gray-400 mt-1">Ввод параметров текстом</p>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-end bg-gray-800">
          <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-700">
            <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Распознано системой:</h3>
            <ul className="text-sm text-green-400 font-mono space-y-1">
              <li>Габариты: {config.W} х {config.H} х {config.D}</li>
              <li>Полок: {config.shelves}</li>
              <li>Крепление: {config.assembly === 'nakladnoe' ? 'Накладное' : 'Боковое'}</li>
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
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg"
          >
            Сгенерировать проект
          </button>
          <div className="text-center mt-2 text-xs text-green-400 h-4">{status}</div>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: РЕЗУЛЬТАТЫ */}
      <div className="flex-1 flex flex-col bg-gray-200">
        
        {/* ВКЛАДКИ */}
        <div className="bg-white px-8 py-4 flex gap-4 shadow-sm z-0">
          <button onClick={() => setActiveTab('render')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'render' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>1. Реальное фото</button>
          <button onClick={() => setActiveTab('2d')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === '2d' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>2. CAD Чертеж</button>
          <button onClick={() => setActiveTab('details')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>3. Деталировка</button>
        </div>

        <div className="flex-1 p-8 overflow-auto flex justify-center items-start">
          
          {/* ВКЛАДКА 1: ФОТО (Рендер) */}
          {activeTab === 'render' && (
            <div className="w-full max-w-4xl bg-white p-2 rounded-xl shadow-lg border border-gray-300">
              <h2 className="text-xl font-bold mb-4 ml-4 mt-2">Фотореалистичный рендер</h2>
              {/* Заглушка, имитирующая реальную генерацию */}
              <img src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=1200&q=80" alt="3D Render" className="w-full h-auto rounded-lg object-cover" style={{maxHeight: '65vh'}} />
            </div>
          )}

          {/* ВКЛАДКА 2: ЧЕРТЕЖ (Динамический вектор) */}
          {activeTab === '2d' && (
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-300 flex flex-col items-center">
               <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 w-full text-left">Фронтальный чертеж (Габариты: {config.W}x{config.H})</h2>
               
               <svg viewBox={`-200 -200 ${config.W + 400} ${config.H + 400}`} className="w-full drop-shadow-md" style={{maxHeight: '65vh'}}>
                 {/* КАРКАС (с учетом накладного/бокового крепления) */}
                 <g fill="#f3f4f6" stroke="#374151" strokeWidth="4">
                   {config.assembly === 'nakladnoe' ? (
                     <>
                       {/* Накладное: Дно и крыша на всю ширину, боковины внутри */}
                       <rect x="0" y="0" width={config.W} height={T} /> {/* Крыша */}
                       <rect x="0" y={config.H - T} width={config.W} height={T} /> {/* Дно */}
                       <rect x="0" y={T} width={T} height={config.H - T*2} /> {/* Лев. Бок */}
                       <rect x={config.W - T} y={T} width={T} height={config.H - T*2} /> {/* Прав. Бок */}
                     </>
                   ) : (
                     <>
                       {/* Боковое: Боковины на всю высоту, дно и крыша внутри */}
                       <rect x="0" y="0" width={T} height={config.H} /> {/* Лев. Бок */}
                       <rect x={config.W - T} y="0" width={T} height={config.H} /> {/* Прав. Бок */}
                       <rect x={T} y="0" width={config.W - T*2} height={T} /> {/* Крыша */}
                       <rect x={T} y={config.H - T} width={config.W - T*2} height={T} /> {/* Дно */}
                     </>
                   )}
                   
                   {/* ПОЛКИ */}
                   {Array.from({ length: config.shelves }).map((_, i) => (
                     <rect key={i} x={T} y={T + gap * (i + 1)} width={config.W - T*2} height={T} />
                   ))}
                 </g>

                 {/* РАЗМЕРНЫЕ ЛИНИИ (ГОСТ стиль) */}
                 <g stroke="#dc2626" strokeWidth="3" fill="#dc2626" fontSize="48" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                   {/* Ширина */}
                   <line x1="0" y1="-80" x2={config.W} y2="-80" />
                   <line x1="0" y1="-100" x2="0" y2="-40" strokeWidth="2" />
                   <line x1={config.W} y1="-100" x2={config.W} y2="-40" strokeWidth="2" />
                   <text x={config.W/2} y="-110">{config.W}</text>
                   
                   {/* Высота */}
                   <line x1="-80" y1="0" x2="-80" y2={config.H} />
                   <line x1="-100" y1="0" x2="-40" y2="0" strokeWidth="2" />
                   <line x1="-100" y1={config.H} x2="-40" y2={config.H} strokeWidth="2" />
                   <text x="-120" y={config.H/2} transform={`rotate(-90, -120, ${config.H/2})`}>{config.H}</text>

                   {/* Внутренняя ширина для полок */}
                   <line x1={T} y1={config.H + 80} x2={config.W - T} y2={config.H + 80} />
                   <line x1={T} y1={config.H + 40} x2={T} y2={config.H + 100} strokeWidth="2" />
                   <line x1={config.W - T} y1={config.H + 40} x2={config.W - T} y2={config.H + 100} strokeWidth="2" />
                   <text x={config.W/2} y={config.H + 150}>Внутр: {config.W - T*2}</text>
                 </g>
               </svg>
            </div>
          )}

          {/* ВКЛАДКА 3: ДЕТАЛИРОВКА */}
          {activeTab === 'details' && (
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow border border-gray-200">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-black text-gray-800">Спецификация (Распил)</h2>
                <p className="text-gray-500 mt-1">Крепление: <span className="font-bold text-blue-600 uppercase">{config.assembly === 'nakladnoe' ? 'Накладное' : 'Боковое'}</span></p>
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
          )}

        </div>
      </div>
    </div>
  );
}
