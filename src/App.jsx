import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Settings2,
  Plus,
  Check,
  PackageSearch,
  X,
  Factory,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Tags,
  PlusCircle,
} from 'lucide-react';

// --- CONFIGURAÇÃO GEMINI ---
const apiKey = 'AIzaSyDcMGMlDNYAMDP9MTgCHTUKtVxus_vcanc';

// --- COMPONENTE DE PREVIEW VISUAL ---
const LuggagePreview = ({ accessories, color = '#3b82f6' }) => {
  const hasExpandable = accessories.some((a) => a.id.includes('expandable'));
  const hasTSA = accessories.some((a) => a.id.includes('tsa'));
  const hasLogo = accessories.some((a) => a.id.includes('logo'));
  const hasAluminum = accessories.some((a) => a.id.includes('aluminum'));
  const hasDoubleWheels = accessories.some((a) =>
    a.id.includes('double_wheels')
  );
  const hasCorners = accessories.some((a) => a.id.includes('corner'));

  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner">
      <svg
        viewBox="0 0 200 240"
        className="w-48 h-56 drop-shadow-2xl transition-all duration-500"
      >
        <rect
          x="70"
          y="10"
          width="10"
          height="40"
          fill={hasAluminum ? '#cbd5e1' : '#475569'}
        />
        <rect
          x="120"
          y="10"
          width="10"
          height="40"
          fill={hasAluminum ? '#cbd5e1' : '#475569'}
        />
        <rect x="65" y="5" width="70" height="12" rx="4" fill="#1e293b" />
        <rect x="40" y="50" width="120" height="160" rx="15" fill={color} />
        <rect
          x="55"
          y="65"
          width="90"
          height="130"
          rx="8"
          fill="none"
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth="2"
        />
        {hasExpandable && (
          <line
            x1="48"
            y1="50"
            x2="48"
            y2="210"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="4"
            opacity="0.4"
          />
        )}
        {hasCorners && (
          <>
            <path
              d="M40 70 V55 Q40 50 55 50 H70"
              fill="none"
              stroke="#1e293b"
              strokeWidth="7"
            />
            <path
              d="M130 50 H145 Q160 50 160 65 V80"
              fill="none"
              stroke="#1e293b"
              strokeWidth="7"
            />
          </>
        )}
        {hasTSA && (
          <rect x="148" y="100" width="15" height="30" rx="3" fill="#1e293b" />
        )}
        {hasLogo && (
          <rect
            x="85"
            y="130"
            width="30"
            height="15"
            rx="2"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="1"
          />
        )}
        <g>
          <circle cx="60" cy="220" r="12" fill="#1e293b" />
          {hasDoubleWheels && <circle cx="72" cy="220" r="12" fill="#334155" />}
          <circle cx="140" cy="220" r="12" fill="#1e293b" />
          {hasDoubleWheels && (
            <circle cx="152" cy="220" r="12" fill="#334155" />
          )}
        </g>
      </svg>
    </div>
  );
};

// --- DADOS INICIAIS ---
const initialSuppliers = [
  { id: 'at_trip', name: 'At Express (Trip)', defaultRate: 6.88 },
  { id: 'at_harmony', name: 'At Express (Harmony)', defaultRate: 6.85 },
  { id: 'at_cheaper', name: 'At Express (Cheaper Mel)', defaultRate: 6.85 },
  { id: 'color_travel', name: 'Color Travel', defaultRate: 7.0 },
];

const initialModels = [
  { id: 'trip_20_at', name: 'Trip: 20"', rmb: 68.4, supplierId: 'at_trip' },
  {
    id: 'trip_20_ct',
    name: 'Trip: 20"',
    rmb: 66.5,
    supplierId: 'color_travel',
  },
  { id: 'flex_at', name: 'Trip Flex', rmb: 58.48, supplierId: 'at_trip' },
  { id: 'flex_ct', name: 'Trip Flex', rmb: 59.5, supplierId: 'color_travel' },
  { id: 'p0_18_at', name: 'P0: 18.5"', rmb: 57.45, supplierId: 'at_trip' },
  { id: 'p0_18_ct', name: 'P0: 18.5"', rmb: 59.5, supplierId: 'color_travel' },
  { id: 'p0_20_at', name: 'P0: 20"', rmb: 63.3, supplierId: 'at_trip' },
  { id: 'p0_20_har', name: 'P0: 20"', rmb: 56.85, supplierId: 'at_harmony' },
  { id: 'p0_20_ct', name: 'P0: 20"', rmb: 59.5, supplierId: 'color_travel' },
];

const initialAccessories = [
  {
    id: 'ext_expandable',
    category: 'EXTERNO',
    name: 'Expandable',
    icon: '↔️',
    pricesRmb: {
      at_trip: 7.0,
      at_harmony: 7.0,
      at_cheaper: 7.0,
      color_travel: 4.9,
    },
  },
  {
    id: 'ext_tsa_1',
    category: 'EXTERNO',
    name: 'TSA Lock (Premium)',
    icon: '🔒',
    pricesRmb: {
      at_trip: 5.8,
      at_harmony: 5.8,
      at_cheaper: 5.8,
      color_travel: 7.0,
    },
  },
  {
    id: 'ext_tsa_2',
    category: 'EXTERNO',
    name: 'TSA Lock (Standard)',
    icon: '🔒',
    pricesRmb: {
      at_trip: 4.8,
      at_harmony: 4.8,
      at_cheaper: 4.8,
      color_travel: 5.0,
    },
  },
  {
    id: 'ext_nontsa',
    category: 'EXTERNO',
    name: 'Sunken Non-TSA Lock',
    icon: '🔓',
    pricesRmb: {
      at_trip: 1.5,
      at_harmony: 1.5,
      at_cheaper: 1.5,
      color_travel: 2.5,
    },
  },
  {
    id: 'ext_logo',
    category: 'EXTERNO',
    name: 'Logo Metal Plate',
    icon: '🏷️',
    pricesRmb: {
      at_trip: 1.4,
      at_harmony: 1.4,
      at_cheaper: 1.4,
      color_travel: 1.0,
    },
  },
  {
    id: 'ext_iron_trolley',
    category: 'EXTERNO',
    name: 'Iron Trolley',
    icon: '🏗️',
    pricesRmb: { at_trip: 0, at_harmony: 0, at_cheaper: 0, color_travel: 0 },
  },
  {
    id: 'ext_aluminum',
    category: 'EXTERNO',
    name: 'Aluminum Trolley',
    icon: '⛓️',
    pricesRmb: {
      at_trip: 4.0,
      at_harmony: 4.0,
      at_cheaper: 4.0,
      color_travel: 3.5,
    },
  },
  {
    id: 'ext_double_wheels',
    category: 'EXTERNO',
    name: 'Double Wheels',
    icon: '🎡',
    pricesRmb: {
      at_trip: 3.5,
      at_harmony: 3.5,
      at_cheaper: 3.5,
      color_travel: 2.0,
    },
  },
  {
    id: 'ext_single_wheels',
    category: 'EXTERNO',
    name: 'Single Wheels',
    icon: '⭕',
    pricesRmb: { at_trip: 0, at_harmony: 0, at_cheaper: 0, color_travel: 0 },
  },
  {
    id: 'ext_corner',
    category: 'EXTERNO',
    name: 'Corner Protection',
    icon: '📐',
    pricesRmb: {
      at_trip: 2.5,
      at_harmony: 2.5,
      at_cheaper: 2.5,
      color_travel: 2.0,
    },
  },
  {
    id: 'ext_zipper_color',
    category: 'EXTERNO',
    name: 'Colored Zipper',
    icon: '🤐',
    pricesRmb: {
      at_trip: 1.5,
      at_harmony: 1.5,
      at_cheaper: 1.5,
      color_travel: 1.0,
    },
  },
  {
    id: 'int_lining_color',
    category: 'INTERNO',
    name: 'Matching Color Lining',
    icon: '🎨',
    pricesRmb: {
      at_trip: 2.5,
      at_harmony: 2.5,
      at_cheaper: 2.5,
      color_travel: 2.0,
    },
  },
  {
    id: 'int_mesh_double',
    category: 'INTERNO',
    name: 'Double Mesh Pocket',
    icon: '🕸️',
    pricesRmb: {
      at_trip: 3.0,
      at_harmony: 3.0,
      at_cheaper: 3.0,
      color_travel: 2.5,
    },
  },
  {
    id: 'int_removable_pocket',
    category: 'INTERNO',
    name: 'Removable Pocket',
    icon: '🎒',
    pricesRmb: {
      at_trip: 4.5,
      at_harmony: 4.5,
      at_cheaper: 4.5,
      color_travel: 4.0,
    },
  },
];

export default function App() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [models, setModels] = useState(initialModels);
  const [accessories, setAccessories] = useState(initialAccessories);
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [selectedSupplierId, setSelectedSupplierId] = useState('at_trip');
  const [selectedModelId, setSelectedModelId] = useState('trip_20_at');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState([]);
  const [openCategory, setOpenCategory] = useState('EXTERNO');

  // Estados Gemini
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // Estados para Modais
  const [isFactoryModalOpen, setIsFactoryModalOpen] = useState(false);
  const [newFactory, setNewFactory] = useState({ name: '', rate: '' });

  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [newAccessory, setNewAccessory] = useState({
    name: '',
    category: 'EXTERNO',
    icon: '📦',
    pricesRmb: {},
  });

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', rmb: '' });

  const currentSupplier = suppliers.find((s) => s.id === selectedSupplierId);
  const currentRate = currentSupplier?.defaultRate || 7.0;
  const availableModels = models.filter(
    (m) => m.supplierId === selectedSupplierId
  );
  const selectedModel =
    models.find((m) => m.id === selectedModelId) || availableModels[0];

  const accessoriesTotalRmb = accessories
    .filter((a) => selectedAccessoryIds.includes(a.id))
    .reduce((sum, acc) => sum + (acc.pricesRmb[selectedSupplierId] || 0), 0);

  const totalRmb = (selectedModel?.rmb || 0) + accessoriesTotalRmb;
  const totalUsd = totalRmb / currentRate;

  const formatValue = (val) => {
    if (displayCurrency === 'USD') return `$ ${(val / currentRate).toFixed(2)}`;
    return `¥ ${val.toFixed(2)}`;
  };

 // --- FUNÇÕES GEMINI ---
 const callGemini = async (prompt, isStructured = false) => {
  setIsAiLoading(true);
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: isStructured ? {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              estimated_price: { type: 'number' },
              currency: { type: 'string' },
              analysis: { type: 'string' }
            }
          }
        } : {}
      })
    });

    const data = await response.json();
    setIsAiLoading(false);
    return isStructured ? JSON.parse(data.candidates[0].content.parts[0].text) : data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Erro na Gemini:", error);
    setIsAiLoading(false);
    return null;
  }
};

const handleAiSuggest = async () => {
  const prompt = `Como especialista em malas, analise o modelo ${selectedModel?.name} com os acessórios selecionados e sugira um preço FOB justo em USD e uma breve análise de mercado.`;
  const result = await callGemini(prompt, true);
  if (result) {
    setAiAnalysis(result.analysis);
  }
};



  const handleAiAnalyze = async () => {
    const selectedAccNames = accessories
      .filter((a) => selectedAccessoryIds.includes(a.id))
      .map((a) => a.name)
      .join(', ');
    const prompt = `Analise a viabilidade comercial desta mala:
    - Modelo: ${selectedModel.name}
    - Fábrica: ${currentSupplier.name}
    - Custo FOB Final: $ ${totalUsd.toFixed(2)}
    - Acessórios: ${selectedAccNames || 'Configuração Básica'}
    
    Explique brevemente (em 3 frases) se esse preço está competitivo para o mercado brasileiro e qual o diferencial dessa configuração.`;

    const result = await callGemini(prompt);
    if (result) setAiAnalysis(result);
  };

  // --- CRUD HANDLERS ---
  const handleAddFactory = (e) => {
    e.preventDefault();
    if (!newFactory.name || !newFactory.rate) return;
    const id =
      newFactory.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    const rateNum = parseFloat(newFactory.rate.replace(',', '.'));
    setSuppliers([
      ...suppliers,
      { id, name: newFactory.name, defaultRate: rateNum },
    ]);
    setIsFactoryModalOpen(false);
    setNewFactory({ name: '', rate: '' });
  };

  const handleAddAccessory = (e) => {
    e.preventDefault();
    if (!newAccessory.name) return;

    const id =
      (newAccessory.category === 'EXTERNO' ? 'ext_' : 'int_') +
      newAccessory.name.toLowerCase().replace(/\s+/g, '_') +
      '_' +
      Date.now();

    setAccessories([...accessories, { ...newAccessory, id }]);
    setIsAccessoryModalOpen(false);
    setNewAccessory({
      name: '',
      category: 'EXTERNO',
      icon: '📦',
      pricesRmb: {},
    });
  };

  const handleAddModel = (e) => {
    e.preventDefault();
    if (!newModel.name || !newModel.rmb) return;

    const id =
      'mod_' +
      newModel.name.toLowerCase().replace(/\s+/g, '_') +
      '_' +
      Date.now();
    const rmbNum = parseFloat(newModel.rmb.replace(',', '.'));

    const modelObj = {
      id,
      name: newModel.name,
      rmb: rmbNum,
      supplierId: selectedSupplierId,
    };

    setModels([...models, modelObj]);
    setSelectedModelId(id);
    setIsModelModalOpen(false);
    setNewModel({ name: '', rmb: '' });
  };

  const updateNewAccessoryPrice = (supplierId, value) => {
    const price = parseFloat(value.replace(',', '.')) || 0;
    setNewAccessory((prev) => ({
      ...prev,
      pricesRmb: { ...prev.pricesRmb, [supplierId]: price },
    }));
  };

  useEffect(() => {
    const modelExists = availableModels.some((m) => m.id === selectedModelId);
    if (!modelExists && availableModels.length > 0) {
      setSelectedModelId(availableModels[0].id);
    }
  }, [selectedSupplierId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* MODAL ADICIONAR FÁBRICA */}
      {isFactoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Factory className="text-blue-600" /> Nova Fábrica
              </h3>
              <button
                onClick={() => setIsFactoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleAddFactory} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                  Nome da Fábrica
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                  placeholder="Ex: Harmony Factory"
                  value={newFactory.name}
                  onChange={(e) =>
                    setNewFactory({ ...newFactory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                  Taxa de Câmbio (USD/RMB)
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                  placeholder="Ex: 6.85"
                  value={newFactory.rate}
                  onChange={(e) =>
                    setNewFactory({ ...newFactory, rate: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4"
              >
                SALVAR FÁBRICA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR ACESSÓRIO */}
      {isAccessoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Tags className="text-blue-600" /> Novo Acessório
              </h3>
              <button
                onClick={() => setIsAccessoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleAddAccessory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                    Nome do Acessório
                  </label>
                  <input
                    autoFocus
                    required
                    type="text"
                    className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                    placeholder="Ex: Roda 360 Graus"
                    value={newAccessory.name}
                    onChange={(e) =>
                      setNewAccessory({ ...newAccessory, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                    Categoria
                  </label>
                  <select
                    className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold"
                    value={newAccessory.category}
                    onChange={(e) =>
                      setNewAccessory({
                        ...newAccessory,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="EXTERNO">Externo</option>
                    <option value="INTERNO">Interno</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                    Ícone (Emoji)
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold text-center"
                    value={newAccessory.icon}
                    onChange={(e) =>
                      setNewAccessory({ ...newAccessory, icon: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">
                  Preços por Fábrica (RMB)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {suppliers.map((sup) => (
                    <div
                      key={sup.id}
                      className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100"
                    >
                      <span className="flex-1 text-xs font-bold text-slate-600 truncate">
                        {sup.name}
                      </span>
                      <input
                        type="text"
                        placeholder="0.00"
                        className="w-24 p-2 bg-white rounded-xl border border-slate-200 text-right font-mono font-bold text-sm"
                        value={newAccessory.pricesRmb[sup.id] || ''}
                        onChange={(e) =>
                          updateNewAccessoryPrice(sup.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4"
              >
                CADASTRAR ACESSÓRIO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR MODELO */}
      {isModelModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <PackageSearch className="text-blue-600" /> Novo Modelo
              </h3>
              <button
                onClick={() => setIsModelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">
              Adicionando para: {currentSupplier.name}
            </p>
            <form onSubmit={handleAddModel} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                  Descrição do Modelo
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                  placeholder="Ex: Modelo Executivo 24 polegadas"
                  value={newModel.name}
                  onChange={(e) =>
                    setNewModel({ ...newModel, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">
                  Preço Base (RMB)
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                  placeholder="Ex: 85.50"
                  value={newModel.rmb}
                  onChange={(e) =>
                    setNewModel({ ...newModel, rmb: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4"
              >
                SALVAR MODELO
              </button>
            </form>
          </div>
        </div>
      )}

      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
              <Calculator size={24} />
            </div>
            Sourcing Pro <span className="text-blue-600">v2</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Gestão de Orçamentos e Customização de Malas
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {['RMB', 'USD'].map((curr) => (
            <button
              key={curr}
              onClick={() => setDisplayCurrency(curr)}
              className={`px-5 py-2 rounded-lg font-bold transition-all text-xs ${
                displayCurrency === curr
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA 1: FORNECEDOR E MODELO */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Factory size={16} /> Fábrica Selecionada
              </h2>
              <button
                onClick={() => setIsFactoryModalOpen(true)}
                className="bg-blue-50 text-blue-600 p-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {suppliers.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSupplierId(s.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 font-bold transition-all text-sm ${
                    selectedSupplierId === s.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  {selectedSupplierId === s.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <PackageSearch size={16} /> Modelos
              </h2>
              <button
                onClick={() => setIsModelModalOpen(true)}
                className="bg-blue-50 text-blue-600 p-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <PlusCircle size={18} />
              </button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {availableModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedModelId === m.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-800 text-sm">{m.name}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase mt-1">
                    Base: {formatValue(m.rmb)}
                  </p>
                </button>
              ))}
              {availableModels.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">
                  Nenhum modelo cadastrado para esta fábrica.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* COLUNA 2: ACESSÓRIOS */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Settings2 size={16} /> Componentes Extra
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAccessoryModalOpen(true)}
                  className="bg-slate-100 text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Novo Acessório"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={handleAiSuggest}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
                >
                  {isAiLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  SUGESTÃO ✨
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {['EXTERNO', 'INTERNO'].map((cat) => (
                <div
                  key={cat}
                  className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() =>
                      setOpenCategory(openCategory === cat ? '' : cat)
                    }
                    className="w-full flex justify-between items-center p-4 bg-slate-50 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {cat === 'EXTERNO' ? '🌐' : '🏠'} {cat}
                    </span>
                    {openCategory === cat ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  {openCategory === cat && (
                    <div className="p-2 grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto">
                      {accessories
                        .filter((a) => a.category === cat)
                        .map((acc) => {
                          const isSelected = selectedAccessoryIds.includes(
                            acc.id
                          );
                          const price = acc.pricesRmb[selectedSupplierId] || 0;
                          return (
                            <button
                              key={acc.id}
                              onClick={() =>
                                setSelectedAccessoryIds((prev) =>
                                  isSelected
                                    ? prev.filter((i) => i !== acc.id)
                                    : [...prev, acc.id]
                                )
                              }
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-transparent hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-lg bg-white w-10 h-10 flex items-center justify-center rounded-lg shadow-sm border border-slate-100">
                                {acc.icon}
                              </span>
                              <div className="flex-1">
                                <p className="text-[11px] font-bold text-slate-700 leading-tight truncate">
                                  {acc.name}
                                </p>
                                <p className="text-[10px] font-bold text-blue-500">
                                  {price > 0 ? formatValue(price) : 'Incluso'}
                                </p>
                              </div>
                              {isSelected && (
                                <Check size={14} className="text-blue-600" />
                              )}
                            </button>
                          );
                        })}
                      {accessories.filter((a) => a.category === cat).length ===
                        0 && (
                        <p className="text-[10px] text-slate-400 italic text-center py-4">
                          Nenhum acessório cadastrado.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {aiAnalysis && (
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-[2rem] border border-blue-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-tighter flex items-center gap-1">
                    <Sparkles size={10} /> Insight ✨
                  </h3>
                  <button onClick={() => setAiAnalysis(null)}>
                    <X
                      size={14}
                      className="text-blue-300 hover:text-blue-600"
                    />
                  </button>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{aiAnalysis}"
                </p>
              </div>
            </section>
          )}
        </div>

        {/* COLUNA 3: SUMMARY */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">
              Preview Visual
            </h2>
            <LuggagePreview
              accessories={accessories.filter((a) =>
                selectedAccessoryIds.includes(a.id)
              )}
            />

            <div className="mt-6 p-4 bg-slate-50 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-bold border-b pb-2">
                <span className="truncate max-w-[70%]">
                  {selectedModel?.name || 'Selecione um modelo'}
                </span>
                <span>{formatValue(selectedModel?.rmb || 0)}</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1 pt-1">
                {accessories
                  .filter((a) => selectedAccessoryIds.includes(a.id))
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between text-[10px] text-slate-500"
                    >
                      <span className="truncate max-w-[70%]">+ {a.name}</span>
                      <span>
                        {formatValue(a.pricesRmb[selectedSupplierId] || 0)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Preço FOB Estimado
                </p>
                <button
                  onClick={handleAiAnalyze}
                  disabled={isAiLoading}
                  className="text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                >
                  {isAiLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono">
                  {formatValue(totalRmb).split(' ')[1]}
                </span>
                <span className="text-blue-400 font-bold">
                  {displayCurrency}
                </span>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Taxa de Câmbio</span>
                  <span className="text-white">
                    1 USD = {currentRate.toFixed(2)} RMB
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">
                    Total em {displayCurrency === 'USD' ? 'RMB' : 'USD'}
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {displayCurrency === 'USD'
                      ? `¥ ${totalRmb.toFixed(2)}`
                      : `$ ${totalUsd.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={80} className="text-blue-500" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
