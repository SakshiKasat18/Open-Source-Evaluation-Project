// Simple script to test Climatiq API connection
const axios = require('axios');
require('dotenv').config();

const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY || 'YOUR_CLIMATIQ_API_KEY';
const CLIMATIQ_BASE_URL = 'https://api.climatiq.io/data/v1';

async function testClimatiqAPI() {
  console.log('🧪 Testing Climatiq API Connection...\n');
  
  if (CLIMATIQ_API_KEY === 'YOUR_CLIMATIQ_API_KEY') {
    console.error('❌ ERROR: API key not configured!');
    console.log('   Please add your Climatiq API key to .env file');
    console.log('   Get your free key from: https://www.climatiq.io/\n');
    return;
  }
  
  try {
    // Test 1: Car travel emissions
    console.log('Test 1: Calculating car travel emissions (100 km)...');
    const carResult = await axios.post(
      `${CLIMATIQ_BASE_URL}/estimate`,
      {
        emission_factor: {
          activity_id: 'passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na'
        },
        parameters: {
          distance: 100,
          distance_unit: 'km'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Success! CO2e:', carResult.data.co2e, 'kg\n');
    
    // Test 2: Electricity emissions
    console.log('Test 2: Calculating electricity emissions (250 kWh)...');
    const electricityResult = await axios.post(
      `${CLIMATIQ_BASE_URL}/estimate`,
      {
        emission_factor: {
          activity_id: 'electricity-supply_grid-source_supplier_mix-consumer_type_na'
        },
        parameters: {
          energy: 250,
          energy_unit: 'kWh'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Success! CO2e:', electricityResult.data.co2e, 'kg\n');
    
    // Test 3: Waste emissions
    console.log('Test 3: Calculating waste emissions (30 kg)...');
    const wasteResult = await axios.post(
      `${CLIMATIQ_BASE_URL}/estimate`,
      {
        emission_factor: {
          activity_id: 'waste_type_mixed_general_waste-disposal_method_landfill'
        },
        parameters: {
          weight: 30,
          weight_unit: 'kg'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Success! CO2e:', wasteResult.data.co2e, 'kg\n');
    
    console.log('🎉 All tests passed! Your Climatiq API is working correctly!');
    console.log('   You can now run: npm start\n');
    
  } catch (error) {
    console.error('❌ API Test Failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.error || error.response.data.message);
      
      if (error.response.status === 401) {
        console.log('\n   💡 This means your API key is invalid or expired');
        console.log('   Get a new key from: https://www.climatiq.io/');
      }
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }
}

// Run the test
testClimatiqAPI();
