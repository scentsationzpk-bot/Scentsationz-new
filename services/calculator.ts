export const calculateProductionCost = (
  pricePer100g: number,
  bottleSizeMl: number,
  concentrationPercentage: number,
  quantity: number
) => {
  const pricePerMl = pricePer100g / 100;
  const oilNeededMl = bottleSizeMl * (concentrationPercentage / 100);
  const oilCost = oilNeededMl * pricePerMl;
  
  const alcoholCost = 150; 
  const bottleCost = 275; 
  const packagingCost = 250; // Average of 200-300
  const fixerCost = 200;
  const logoCost = 0; // Complimentary
  
  const totalProductionCostPerBottle = oilCost + alcoholCost + bottleCost + packagingCost + fixerCost + logoCost;
  
  return {
    oilNeededMl,
    oilCost,
    alcoholCost,
    bottleCost,
    packagingCost,
    fixerCost,
    logoCost,
    totalProductionCostPerBottle,
    totalCost: totalProductionCostPerBottle * quantity
  };
};
