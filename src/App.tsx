import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { SHEET_FORMATS } from './types';

export default function App() {
  const { config, updateConfig } = useStore();
  const [activeTab, setActiveTab] = useState<'3d' | '2d'>('3d');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Привет! Какую мебель мы сегодня проектируем? Например: "Пенал для кухни высотой 220см, внизу 2 ящика Blum, в центре духовка и СВЧ".' }
  ]);

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;

    // Добавляем сообщение пользователя
    const newMessages = [...messages, { sender: 'user', text: prompt }];
    setMessages(newMessages);
    setPrompt('');

    // Имитация работы ИИ (пока мы не подключили реальный API)
    setTimeout(() => {
      // ИИ распознает параметры и обновляет конфигурацию
      if (prompt.toLowerCase().includes('купе') || prompt.toLowerCase().includes('шкаф')) {
        updateConfig({
          category: 'wardrobe_sliding',
          height: 2400,
          width: 1800,
          depth: 650,
          base: { exists: true, type: 'plinth_box', height: 80 },
          mainSection: { shelvesCount: 4, doors: 'sliding', wardrobeAccessories: ['pantograph_lift'] }
        });
        setMessages([...newMessages, { sender: 'ai', text: 'Построил шкаф-купе 1800х2400 мм с цокольной коробкой 80 мм, 4 полками и пантографом. Посмотрите 2D чертеж для проверки размеров.' }]);
      } else {
        updateConfig({
          category: 'kitchen_tall',
          height: 2200,
          width: 600,
          depth: 560,
          base: { exists: true, type: 'legs_with_plinth', height: 100 },
          appliances: [
            { type: 'oven', position: 'middle' },
            { type: 'microwave', position: 'top' }
          ],
          bottomSection: { exists: true, type: 'drawers', count: 2, height: 720, kitchenAccessories: [] },
          mainSection: { shelvesCount: 1, doors: 'none', wardrobeAccessories: [], kitchenAccessories: [] }
        });
        setMessages([...newMessages, { sender: 'ai', text: 'Готово! Пенал 600х2200 мм на 100 мм ножках с нишами под духовку и СВЧ, а также двумя выдвижными ящиками Blum Tandembox.' }]);
      }
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* 1. ЛЕВАЯ ПАНЕЛЬ: ИИ-помощник (Чат) */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🤖 Open Furniture AI
          </h1>
          <p className="text-xs text-gray-500">Генеративное проектирование мебели</p>
        </div>

        {/* Сообщения чата */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Поле ввода */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Введите запрос..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendPrompt}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>

      {/* 2. ПРАВАЯ ЧАСТЬ: Визуализация и чертежи */}
      <div className="flex-1 flex flex-col">
        {/* Верхняя навигация */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeTab === '3d' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              3D Визуализация
            </button>
            <button
              onClick={() => setActiveTab('2d')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeTab === '2d' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              2D Чертеж с размерами
            </button>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            Категория: {config.category.toUpperCase()} | Материал: {SHEET_FORMATS[config.bodyMaterial]?.name}
          </div>
        </div>

        {/* Рабочая область */}
        <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
          {activeTab === '3d' ? (
            /* ЭКРАН 3D (Будущий Three.js, пока показываем красивый рендер) */
            <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">🧊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Интерактивная 3D-модель</h3>
              <p className="text-sm text-gray-500 max-w-md">Здесь будет крутиться ваш 3D-проект. Сейчас мы подключаем графический движок 3D-рендера.</p>
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono text-left max-w-sm">
                Габариты: {config.width} x {config.height} x {config.depth} мм <br />
                Подсветка: {config.lighting.exists ? 'LED Включена' : 'Нет'} <br />
                База: {config.base.type} ({config.base.height} мм)
              </div>
            </div>
          ) : (
            /* ЭКРАН 2D ЧЕРТЕЖА (CAD-вид с размерами) */
            <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col justify-between overflow-auto">
              <div className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-center">
                <span className="font-bold text-gray-700">СБОРОЧНЫЙ ЧЕРТЕЖ</span>
                <span className="text-xs text-red-500 font-mono">РАЗМЕРЫ В ММ</span>
              </div>

              {/* Упрощенная интерактивная CAD-схема */}
              <div className="flex-1 flex justify-center items-center">
                <div className="relative border-4 border-gray-800 bg-gray-50" style={{ width: `${config.width * 0.4}px`, height: `${config.height * 0.3}px` }}>
                  {/* Размерные линии */}
                  <div className="absolute -top-8 left-0 right-0 flex justify-between items-center border-t border-red-500 text-[10px] text-red-500">
                    <span>←</span> <span className="font-bold">{config.width} мм</span> <span>→</span>
                  </div>
                  <div className="absolute -left-14 top-0 bottom-0 flex flex-col justify-between items-center border-l border-red-500 text-[10px] text-red-500">
                    <span>↑</span> <span className="font-bold">{config.height} мм</span> <span>↓</span>
                  </div>
                  <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-between items-center border-r border-red-500 text-[10px] text-red-500">
                    <span>↑</span> <span className="font-bold">Глубина: {config.depth} мм</span> <span>↓</span>
                  </div>

                  {/* Внутреннее наполнение */}
                  <div className="w-full h-full flex flex-col justify-between p-2">
                    {/* Антресоль */}
                    {config.mezzanine.exists && (
                      <div className="border border-dashed border-blue-500 bg-blue-50/50 p-1 text-[9px] text-blue-700 flex justify-between items-center" style={{ height: `${config.mezzanine.height * 0.3}px` }}>
                        <span>Антресоль</span>
                        <span>h: {config.mezzanine.height}</span>
                      </div>
                    )}

                    {/* Секция с техникой и ящиками */}
                    <div className="flex-1 border border-gray-300 p-2 flex flex-col justify-around bg-white">
                      {config.appliances.map((app, idx) => (
                        <div key={idx} className="border border-orange-500 bg-orange-50 text-[10px] text-orange-700 p-1 font-bold text-center">
                          ⚙️ НИША ПОД {app.type.toUpperCase()} (~595 мм)
                        </div>
                      ))}

                      {config.bottomSection.exists && config.bottomSection.type === 'drawers' && (
                        <div className="space-y-1">
                          {Array.from({ length: config.bottomSection.count }).map((_, idx) => (
                            <div key={idx} className="border border-green-500 bg-green-50 text-[9px] text-green-700 p-1 text-center font-semibold">
                              🗄️ Ящик BLUM ({config.hardware.drawers})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Цокольная база */}
                    {config.base.exists && (
                      <div className="border-t-2 border-gray-600 bg-gray-200 text-[9px] text-gray-700 text-center py-1 font-bold" style={{ height: `${config.base.height * 0.3}px` }}>
                        ЦОКОЛЬ (НОЖКИ) h: {config.base.height} мм
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                <span>Толщина ЛДСП: {config.thickness} мм</span>
                <span>Фурнитура: {config.hardware.drawers.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
