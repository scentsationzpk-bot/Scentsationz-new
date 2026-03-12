import React, { useState } from 'react';
import { FRAGRANCE_LIBRARY } from '../constants';
import { calculateProductionCost } from '../services/calculator';

const BrandBuilder: React.FC = () => {
  const [selectedFragrance, setSelectedFragrance] = useState(FRAGRANCE_LIBRARY[0]);
  const [bottleSize, setBottleSize] = useState(50);
  const [concentration, setConcentration] = useState(25);
  const [quantity, setQuantity] = useState(20);

  const costs = calculateProductionCost(selectedFragrance.pricePer100g, bottleSize, concentration, quantity);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-black mb-8">Brand Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label>Fragrance</label>
          <select className="w-full p-3 border rounded" onChange={(e) => setSelectedFragrance(FRAGRANCE_LIBRARY.find(f => f.name === e.target.value)!)}>
            {FRAGRANCE_LIBRARY.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
          </select>
          
          <label>Bottle Size (ml)</label>
          <select className="w-full p-3 border rounded" onChange={(e) => setBottleSize(Number(e.target.value))}>
            <option value={30}>30ml</option>
            <option value={50}>50ml</option>
            <option value={100}>100ml</option>
          </select>
          
          <label>Concentration (%)</label>
          <input type="number" className="w-full p-3 border rounded" value={concentration} onChange={(e) => setConcentration(Number(e.target.value))} />
          
          <label>Quantity</label>
          <input type="number" className="w-full p-3 border rounded" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        
        <div className="bg-slate-100 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Production Cost</h2>
          <p>Oil Needed: {costs.oilNeededMl.toFixed(2)}ml</p>
          <p>Oil Cost: Rs. {costs.oilCost.toFixed(2)}</p>
          <p>Alcohol: Rs. {costs.alcoholCost}</p>
          <p>Bottle: Rs. {costs.bottleCost}</p>
          <p>Packaging: Rs. {costs.packagingCost}</p>
          <p>Fixer: Rs. {costs.fixerCost}</p>
          <p>Logo: Free</p>
          <hr className="my-4" />
          <p className="text-xl font-bold">Total Cost: Rs. {costs.totalCost.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BrandBuilder;
