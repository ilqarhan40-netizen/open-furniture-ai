import React, { useState } from 'react';

export default function App() {
  const [config, setConfig] = useState({
    H: 2200, W: 600, D: 550, shelves: 4, assembly: 'nakladnoe' as 'nakladnoe' | 'bokovoe'
  });
  
  const [prompt, setPrompt] = useState('Сделай шкаф: высота 2.2 метра, ширина 60 см, глубина 550. Четыре полки, сборка накладная.');
  const [status, setStatus] = useState('Ожидание запроса...');
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'render' | '2d' | 'details'>('render');
  const [isLoading, setIsLoading] = useState(false);

  const T = 18; 
  const L = 0;  

  const analyzeAndGenerate = async () => {
    setIsLoading(true);
    setImageUrl('');
    setStatus('Подключение к OpenAI...');
    
    // Получаем ключ из скрытого файла .env
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      setStatus('Ошибка: Ключ API не найден в .env');
      setIsLoading(false);
      return;
    }

    try {
      // 1. ИИ АНАЛИЗИРУЕТ ТЕКСТ И ВЫДАЕТ ТОЧНЫЕ РАЗМЕРЫ В JSON
      setStatus('Шаг 1: ИИ анализирует параметры и математику...');
      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: "Ты мебельный инженер. Переведи размеры пользователя строго в миллиметры. Верни ТОЛЬКО JSON без лишнего текста и без форматирования (маркдауна): {\"H\": число, \"W\": число, \"D\": число, \"shelves\": число, \"assembly\": \"nakladnoe\" или \"bokovoe\"}."
          }, { role: "user", content: prompt }]
        })
      });
      
      const chatData = await chatRes.json();
      if (chatData.error) throw new Error(chatData.error.message);
      
      const content = chatData.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(content);
      setConfig(parsed);

      // 2. ИИ ГЕНЕРИРУЕТ РЕАЛЬНОЕ ФОТО ПО ЗАПРОСУ
      setStatus('Шаг 2: DALL-E 3 рисует фотореалистичный рендер (10-15 сек)...');
      const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Профессиональный 3D рендер мебели в интерьере. Запрос клиента: "${prompt}". Фотореализм, студийное освещение, четкие текстуры ЛДСП.`,
          n: 1,
          size: "1024x1024"
        })
      });

      const imgData = await imgRes.json();
      if (imgData.error) throw new Error(imgData.error.message);
      
      setImageUrl(imgData.data[0].url);
      setStatus('Готово! Проект успешно сгенерирован.');
      setActiveTab('render');

    } catch (error: any) {
      console.error(error);
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sideH = config.assembly === 'nakladnoe' ? config.H - L - (T * 2) : config.H - L;
  const topBottomW = config.assembly === 'nakladnoe' ? config.W : config.W - (T * 2);
  const shelfW = config.W - (T * 2);
  const innerH = config.H - (T * 2);
  const gap = innerH / (config.shelves + 1);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-96 bg-gray-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">OpenAI Движок</h1>
          <p className="text-xs text-gray-400 mt-1">Подключено к боевому API</p>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-end bg-gray-800">
          <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-700">
            <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Распознано нейросетью:</h3>
            <ul className="text-sm text-green-400 font-mono space-y-1">
              <li>Габариты: {config.W} х {config.H} х {config.D}</li>
              <li>Полок: {config.shelves}</li>
              <li>Крепление: {config.assembly === 'nakladnoe' ? 'Накладное' : 'Боковое'}</li>
            </ul>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 border-0 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
            rows={5}
          ></textarea>
          
          <button
            onClick={analyzeAndGenerate}
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:bg-gray-600 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Запустить ИИ'}
          </button>
          <div className="text-center mt-3 text-xs font-bold text-yellow-400 h-4">{status}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-200">
        <div className="bg-white px-8 py-4 flex gap-4 shadow-sm z-0">
          <button onClick={() => setActiveTab('render')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'render' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>1. Реальное фото</button>
          <button onClick={() => setActiveTab('2d')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === '2d' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>2. CAD Чертеж</button>
          <button onClick={() => setActiveTab('details')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>3. Деталировка</button>
        </div>

        <div className="flex-1 p-8 overflow-auto flex justify-center items-start">
          {activeTab === 'render' && (
            <div className="w-full max-w-4xl bg-white p-2 rounded-xl shadow-lg border border-gray-300">
              <h2 className="text-xl font-bold mb-4 ml-4 mt-2">DALL-E 3 Рендер</h2>
              {imageUrl ? (
                <img src={imageUrl} alt="AI Generated Render" className="w-full h-auto rounded-lg object-contain" style={{maxHeight: '70vh'}} />
              ) : (
                <div className="w-full h-[65vh] flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 border-2 border-dashed border-gray-300">
                   {isLoading ? 'Генерация изображения...' : 'Нажмите "Запустить ИИ", чтобы получить фото.'}
                </div>
              )}
            </div>
          )}

          {activeTab === '2d' && (
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg border border-gray-300 flex flex-col items-center">
               <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 w-full text-left">Фронтальный чертеж (Габариты: {config.W}x{config.H})</h2>
               <svg viewBox={`-200 -200 ${config.W + 400} ${config.H + 400}`} className="w-full drop-shadow-md" style={{maxHeight: '65vh'}}>
                 <g fill="#f3f4f6" stroke="#374151" strokeWidth="4">
                   {config.assembly === 'nakladnoe' ? (
                     <>
                       <rect x="0" y="0" width={config.W} height={T} />
                       <rect x="0" y={config.H - T} width={config.W} height={T} />
                       <rect x="0" y={T} width={T} height={config.H - T*2} />
                       <rect x={config.W - T} y={T} width={T} height={config.H - T*2} />
                     </>
                   ) : (
                     <>
                       <rect x="0" y="0" width={T} height={config.H} />
                       <rect x={config.W - T} y="0" width={T} height={config.H} />
                       <rect x={T} y="0" width={config.W - T*2} height={T} />
                       <rect x={T} y={config.H - T} width={config.W - T*2} height={T} />
                     </>
                   )}
                   {Array.from({ length: config.shelves }).map((_, i) => (
                     <rect key={i} x={T} y={T + gap * (i + 1)} width={config.W - T*2} height={T} />
                   ))}
                 </g>
                 <g stroke="#dc2626" strokeWidth="3" fill="#dc2626" fontSize="48" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                   <line x1="0" y1="-80" x2={config.W} y2="-80" />
                   <line x1="0" y1="-100" x2="0" y2="-40" strokeWidth="2" />
                   <line x1={config.W} y1="-100" x2={config.W} y2="-40" strokeWidth="2" />
                   <text x={config.W/2} y="-110">{config.W}</text>
                   <line x1="-80" y1="0" x2="-80" y2={config.H} />
                   <line x1="-100" y1="0" x2="-40" y2="0" strokeWidth="2" />
                   <line x1="-100" y1={config.H} x2="-40" y2={config.H} strokeWidth="2" />
                   <text x="-120" y={config.H/2} transform={`rotate(-90, -120, ${config.H/2})`}>{config.H}</text>
                   <line x1={T} y1={config.H + 80} x2={config.W - T} y2={config.H + 80} />
                   <line x1={T} y1={config.H + 40} x2={T} y2={config.H + 100} strokeWidth="2" />
                   <line x1={config.W - T} y1={config.H + 40} x2={config.W - T} y2={config.H + 100} strokeWidth="2" />
                   <text x={config.W/2} y={config.H + 150}>Внутр: {config.W - T*2}</text>
                 </g>
               </svg>
            </div>
          )}

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
