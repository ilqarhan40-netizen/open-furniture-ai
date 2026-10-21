import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { SHEET_FORMATS } from './types';

export default function App() {
  const { config, updateConfig } = useStore();
  // ТРИ СТРОГИЕ ВКЛАДКИ: Картинка, Чертеж, Деталировка
  const [activeTab, setActiveTab] = useState<'render' | '2d' | 'details'>('render');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Опишите проект. Например: "Пенал высотой 2200, ширина 600, внизу 2 ящика, ниша под духовку".' }
  ]);

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: prompt }];
    setMessages(newMessages);
    setPrompt('');

    setTimeout(() => {
      if (prompt.toLowerCase().includes('купе') || prompt.toLowerCase().includes('шкаф')) {
        updateConfig({
          category: 'wardrobe_sliding', height: 2400, width: 1800, depth: 650,
          base: { exists: true, type: 'plinth_box', height: 80 }
        });
        setMessages([...newMessages, { sender: 'ai', text: 'Проект готов. Сгенерирована реалистичная картинка, чертежи и полная деталировка распила на шкаф 1800х2400.' }]);
      } else {
        updateConfig({
          category: 'kitchen_tall', height: 2200, width: 600, depth: 560,
          base: { exists: true, type: 'legs_with_plinth', height: 100 },
          appliances: [{ type: 'oven', position: 'middle' }],
          bottomSection: { exists: true, type: 'drawers', count: 2, height: 720, kitchenAccessories: [] }
        });
        setMessages([...newMessages, { sender: 'ai', text: 'Проект пенала 600х2200 построен. Доступен рендер, чертеж и деталировка с учетом зазоров.' }]);
      }
    }, 800);
  };

  // Вычисляем размеры деталей (математика толщины ЛДСП = 18мм)
  const T = 18;
  const innerWidth = config.width - (T * 2);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* ЛЕВАЯ ПАНЕЛЬ: Чат */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-lg font-bold text-gray-800">🤖 Open Furniture AI</h1>
          <p className="text-xs text-gray-500">Сценарий: Промпт → Рендер → Чертеж → Деталировка</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()} placeholder="Введите описание проекта..." className="flex-1 px-3 py-2 border rounded-md text-sm" />
            <button onClick={handleSendPrompt} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">Ввод</button>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: Результаты */}
      <div className="flex-1 flex flex-col">
        {/* Навигация */}
        <div className="bg-white border-b px-6 py-3 flex gap-2">
          <button onClick={() => setActiveTab('render')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'render' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>1. Реалистичная картинка</button>
          <button onClick={() => setActiveTab('2d')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === '2d' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>2. План и Чертеж</button>
          <button onClick={() => setActiveTab('details')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'details' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>3. Деталировка (Распил)</button>
        </div>

        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          {/* ВКЛАДКА 1: Картинка */}
          {activeTab === 'render' && (
            <div className="w-full h-full bg-white rounded-xl border flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400 opacity-20"></div>
              <span className="text-6xl mb-4">🖼️</span>
              <h2 className="text-xl font-bold">Фотореалистичный рендер</h2>
              <p className="text-gray-500 max-w-md text-center mt-2">Здесь ИИ выдает готовую сочную картинку для согласования с клиентом (с фасадами, техникой и освещением).</p>
            </div>
          )}

          {/* ВКЛАДКА 2: Чертеж */}
          {activeTab === '2d' && (
             <div className="w-full h-full bg-white rounded-xl border p-8 flex flex-col justify-center items-center">
               <h2 className="text-lg font-bold mb-8">Инженерный чертеж (Габариты: {config.width}x{config.height}x{config.depth})</h2>
               <div className="relative border-4 border-gray-800 bg-gray-50 w-64" style={{ height: '400px' }}>
                  <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs text-red-600 font-bold border-t border-red-500"><span>←</span><span>{config.width} мм</span><span>→</span></div>
                  <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-red-600 font-bold border-l border-red-500"><span>↑</span><span>{config.height} мм</span><span>↓</span></div>
                  <div className="w-full h-full flex flex-col justify-between p-2">
                    <div className="border border-gray-300 p-2 text-center text-xs">Верхняя секция</div>
                    {config.appliances.length > 0 && <div className="border border-orange-500 bg-orange-50 p-2 text-center text-xs font-bold text-orange-700">Ниша под технику</div>}
                    <div className="border border-gray-300 p-2 text-center text-xs">Нижняя секция</div>
                    <div className="border-t-2 border-gray-600 bg-gray-200 text-center text-xs h-8 pt-1">Цоколь ({config.base.height}мм)</div>
                  </div>
               </div>
             </div>
          )}

          {/* ВКЛАДКА 3: Деталировка */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Список деталей в распил (ЛДСП {T}мм)</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-sm">
                    <th className="p-3 border">Наименование</th>
                    <th className="p-3 border">Длина (мм)</th>
                    <th className="p-3 border">Ширина (мм)</th>
                    <th className="p-3 border">Кол-во</th>
                    <th className="p-3 border">Кромка</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr><td className="p-3 border">Стойка левая</td><td className="p-3 border font-mono">{config.height - config.base.height}</td><td className="p-3 border font-mono">{config.depth}</td><td className="p-3 border text-center">1</td><td className="p-3 border">1 длин.</td></tr>
                  <tr><td className="p-3 border">Стойка правая</td><td className="p-3 border font-mono">{config.height - config.base.height}</td><td className="p-3 border font-mono">{config.depth}</td><td className="p-3 border text-center">1</td><td className="p-3 border">1 длин.</td></tr>
                  <tr><td className="p-3 border">Дно</td><td className="p-3 border font-mono">{innerWidth}</td><td className="p-3 border font-mono">{config.depth}</td><td className="p-3 border text-center">1</td><td className="p-3 border">1 длин.</td></tr>
                  <tr><td className="p-3 border">Крыша (Вязка)</td><td className="p-3 border font-mono">{innerWidth}</td><td className="p-3 border font-mono">{config.depth}</td><td className="p-3 border text-center">1</td><td className="p-3 border">1 длин.</td></tr>
                  <tr><td className="p-3 border">Полка жесткая</td><td className="p-3 border font-mono">{innerWidth}</td><td className="p-3 border font-mono">{config.depth - 20}</td><td className="p-3 border text-center">2</td><td className="p-3 border">1 длин.</td></tr>
                  <tr><td className="p-3 border bg-gray-50 text-gray-500">Цоколь</td><td className="p-3 border bg-gray-50 font-mono">{config.width}</td><td className="p-3 border bg-gray-50 font-mono">{config.base.height}</td><td className="p-3 border bg-gray-50 text-center">1</td><td className="p-3 border bg-gray-50">2 длин.</td></tr>
                </tbody>
              </table>
              <div className="mt-4 text-xs text-gray-500">* Размеры высчитаны автоматически из габаритов {config.width}x{config.height}x{config.depth} с учетом толщины ЛДСП {T}мм.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
