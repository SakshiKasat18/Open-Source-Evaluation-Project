// Import required packages
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = 3001;

// Climatiq API Configuration
// IMPORTANT: Replace with your actual Climatiq API key from https://www.climatiq.io/
const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY || 'YOUR_CLIMATIQ_API_KEY';
const CLIMATIQ_BASE_URL = 'https://api.climatiq.io/data/v1';

// Check if API key is configured
if (CLIMATIQ_API_KEY === 'YOUR_CLIMATIQ_API_KEY') {
  console.warn('⚠️  WARNING: Climatiq API key not configured!');
  console.warn('   Get your free API key from: https://www.climatiq.io/');
  console.warn('   Add it to server.js line 11 or use environment variable');
}

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to call Climatiq API
async function calculateWithClimatiq(activityId, parameters) {
  try {
    const response = await axios.post(
      `${CLIMATIQ_BASE_URL}/estimate`,
      {
        emission_factor: {
          activity_id: activityId
        },
        parameters: parameters
      },
      {
        headers: {
          'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Climatiq API Error:', error.message);
    return null;
  }
}

// Main API endpoint
app.post('/api/calculate', async (req, res) => {
  const data = req.body;
  
  let emissions = {
    travel: { co2e: 0, co2: 0, ch4: 0, n2o: 0 },
    electricity: { co2e: 0, co2: 0, ch4: 0, n2o: 0 },
    diet: { co2e: 0, co2: 0, ch4: 0, n2o: 0 },
    waste: { co2e: 0, co2: 0, ch4: 0, n2o: 0 }
  };
  
  try {
    // Calculate travel emissions using Climatiq API
    if (data.type === 'individual' && data.travelKm > 0) {
      let activityId = '';
      
      // Map travel mode to Climatiq activity IDs
      if (data.travelMode === 'car') {
        activityId = 'passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na';
      } else if (data.travelMode === 'bus') {
        activityId = 'passenger_vehicle-vehicle_type_bus-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na';
      } else if (data.travelMode === 'train') {
        activityId = 'passenger_train-route_type_national_rail-fuel_source_na';
      } else if (data.travelMode === 'scooter') {
        activityId = 'passenger_vehicle-vehicle_type_motorbike-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na';
      } else if (data.travelMode === 'ev') {
        activityId = 'passenger_vehicle-vehicle_type_car-fuel_source_bev-engine_size_na-vehicle_age_na-vehicle_weight_na';
      }
      
      if (activityId) {
        const travelResult = await calculateWithClimatiq(activityId, {
          distance: parseFloat(data.travelKm),
          distance_unit: 'km'
        });
        
        if (travelResult && travelResult.co2e) {
          emissions.travel = {
            co2e: travelResult.co2e,
            co2: travelResult.co2e * 0.95,
            ch4: travelResult.co2e * 0.03,
            n2o: travelResult.co2e * 0.02
          };
        }
      }
    }
    
    // Family vehicle emissions using Climatiq API
    if (data.type === 'family' && data.familyTravelKm > 0) {
      let activityId = '';
      
      if (data.vehicleType === 'petrol') {
        activityId = 'passenger_vehicle-vehicle_type_car-fuel_source_petrol-engine_size_na-vehicle_age_na-vehicle_weight_na';
      } else if (data.vehicleType === 'diesel') {
        activityId = 'passenger_vehicle-vehicle_type_car-fuel_source_diesel-engine_size_na-vehicle_age_na-vehicle_weight_na';
      } else if (data.vehicleType === 'ev') {
        activityId = 'passenger_vehicle-vehicle_type_car-fuel_source_bev-engine_size_na-vehicle_age_na-vehicle_weight_na';
      }
      
      if (activityId) {
        const totalDistance = parseFloat(data.familyTravelKm) * parseInt(data.vehicles);
        const vehicleResult = await calculateWithClimatiq(activityId, {
          distance: totalDistance,
          distance_unit: 'km'
        });
        
        if (vehicleResult && vehicleResult.co2e) {
          emissions.travel = {
            co2e: vehicleResult.co2e,
            co2: vehicleResult.co2e * 0.95,
            ch4: vehicleResult.co2e * 0.03,
            n2o: vehicleResult.co2e * 0.02
          };
        }
      }
    }
    
    // Electricity emissions using Climatiq API
    const kWh = data.kWh || data.familyKwh || 0;
    if (kWh > 0) {
      const electricityResult = await calculateWithClimatiq(
        'electricity-supply_grid-source_supplier_mix-consumer_type_na',
        {
          energy: parseFloat(kWh),
          energy_unit: 'kWh'
        }
      );
      
      if (electricityResult && electricityResult.co2e) {
        emissions.electricity = {
          co2e: electricityResult.co2e,
          co2: electricityResult.co2e * 0.92,
          ch4: electricityResult.co2e * 0.05,
          n2o: electricityResult.co2e * 0.03
        };
      }
    }
    
    // Diet emissions (using standard factors as Climatiq doesn't have direct diet APIs)
    const diet = data.diet || data.familyDiet;
    const members = data.members || 1;
    let dietEmission = 0;
    if (diet === 'meat') {
      dietEmission = 150 * members;
    } else if (diet === 'mixed') {
      dietEmission = 100 * members;
    } else if (diet === 'veg') {
      dietEmission = 50 * members;
    }
    emissions.diet = {
      co2e: dietEmission,
      co2: dietEmission * 0.70,
      ch4: dietEmission * 0.25,
      n2o: dietEmission * 0.05
    };
    
    // Waste emissions using Climatiq API
    const waste = data.waste || data.familyWaste || 0;
    if (waste > 0) {
      const wasteResult = await calculateWithClimatiq(
        'waste_type_mixed_general_waste-disposal_method_landfill',
        {
          weight: parseFloat(waste),
          weight_unit: 'kg'
        }
      );
      
      if (wasteResult && wasteResult.co2e) {
        emissions.waste = {
          co2e: wasteResult.co2e,
          co2: wasteResult.co2e * 0.50,
          ch4: wasteResult.co2e * 0.45,
          n2o: wasteResult.co2e * 0.05
        };
      }
    }
  } catch (error) {
    console.error('Error calculating emissions:', error.message);
    // Continue with calculated values even if API fails
  }
  
  // Calculate totals
  const totalCO2e = emissions.travel.co2e + emissions.electricity.co2e + 
                    emissions.diet.co2e + emissions.waste.co2e;
  const totalCO2 = emissions.travel.co2 + emissions.electricity.co2 + 
                   emissions.diet.co2 + emissions.waste.co2;
  const totalCH4 = emissions.travel.ch4 + emissions.electricity.ch4 + 
                   emissions.diet.ch4 + emissions.waste.ch4;
  const totalN2O = emissions.travel.n2o + emissions.electricity.n2o + 
                   emissions.diet.n2o + emissions.waste.n2o;
  
  // Calculate reduction potential
  const reduction = calculateReduction(data, emissions);
  
  // Average emissions for comparison (global average per person per month)
  const globalAverage = 833; // kg CO2e per month per person
  
  // Send response
  res.json({
    success: true,
    message: 'Carbon emissions calculated successfully',
    data: {
      totalEmissions: Math.round(totalCO2e * 100) / 100,
      unit: 'kg CO2e/month',
      type: data.type,
      gasBreakdown: {
        co2: Math.round(totalCO2 * 100) / 100,
        ch4: Math.round(totalCH4 * 100) / 100,
        n2o: Math.round(totalN2O * 100) / 100,
        co2e: Math.round(totalCO2e * 100) / 100
      },
      categoryBreakdown: {
        travel: Math.round(emissions.travel.co2e * 100) / 100,
        electricity: Math.round(emissions.electricity.co2e * 100) / 100,
        diet: Math.round(emissions.diet.co2e * 100) / 100,
        waste: Math.round(emissions.waste.co2e * 100) / 100
      },
      comparison: {
        yourEmissions: Math.round(totalCO2e * 100) / 100,
        globalAverage: globalAverage,
        difference: Math.round((totalCO2e - globalAverage) * 100) / 100,
        percentDiff: Math.round(((totalCO2e - globalAverage) / globalAverage * 100) * 10) / 10
      },
      reduction: {
        current: Math.round(totalCO2e * 100) / 100,
        potential: Math.round(reduction * 100) / 100,
        afterReduction: Math.round((totalCO2e - reduction) * 100) / 100,
        percentReduction: Math.round((reduction / totalCO2e * 100) * 10) / 10
      }
    }
  });
});

// Calculate potential reduction
function calculateReduction(data, emissions) {
  let reduction = 0;
  
  // Travel reduction
  if (data.travelMode === 'car') {
    reduction += emissions.travel.co2e * 0.5; // 50% by switching to public transport
  } else if (data.travelMode === 'scooter') {
    reduction += emissions.travel.co2e * 0.3;
  }
  
  if (data.vehicleType === 'petrol' || data.vehicleType === 'diesel') {
    reduction += emissions.travel.co2e * 0.4;
  }
  
  // Electricity reduction
  const kWh = data.kWh || data.familyKwh || 0;
  if (kWh > 200) {
    reduction += emissions.electricity.co2e * 0.25; // 25% by energy saving
  }
  
  // Diet reduction
  const diet = data.diet || data.familyDiet;
  if (diet === 'meat') {
    reduction += emissions.diet.co2e * 0.33; // 33% by reducing meat
  } else if (diet === 'mixed') {
    reduction += emissions.diet.co2e * 0.20;
  }
  
  // Waste reduction
  const waste = data.waste || data.familyWaste || 0;
  if (waste > 20) {
    reduction += emissions.waste.co2e * 0.30; // 30% by recycling
  }
  
  return reduction;
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Carbon Calculator API ready!`);
  console.log(`🌍 Using Climatiq-based emission factors`);
});
