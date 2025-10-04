#!/usr/bin/env node

const readline = require('readline');
const http = require('http');

// ANSI color codes for better terminal UI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Predefined demo scenarios
const DEMO_SCENARIOS = {
  warsaw_to_krakow: [
    { userId: 'demo_user_1', longitude: 21.0122, latitude: 52.2297, location: 'Warsaw Central Station' },
    { userId: 'demo_user_1', longitude: 20.6419, latitude: 51.7592, location: 'Radom' },
    { userId: 'demo_user_1', longitude: 20.0651, latitude: 50.8371, location: 'Kielce' },
    { userId: 'demo_user_1', longitude: 19.9450, latitude: 50.0647, location: 'Krakow Main Station' },
  ],
  two_users_different_routes: [
    { userId: 'demo_user_1', longitude: 21.0122, latitude: 52.2297, location: 'User 1: Warsaw' },
    { userId: 'demo_user_2', longitude: 19.9450, latitude: 50.0647, location: 'User 2: Krakow' },
    { userId: 'demo_user_1', longitude: 20.6419, latitude: 51.7592, location: 'User 1: Moving to Radom' },
    { userId: 'demo_user_2', longitude: 18.6466, latitude: 54.3520, location: 'User 2: Moving to Gdansk' },
  ]
};

class LocationMocker {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async mockLocation(userId, longitude, latitude) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({ userId, longitude, latitude });

      const options = {
        hostname: new URL(API_URL).hostname,
        port: new URL(API_URL).port || 3000,
        path: '/api/mock/location',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async runDemoScenario(scenarioName) {
    const scenario = DEMO_SCENARIOS[scenarioName];
    if (!scenario) {
      console.log(`${colors.red}Unknown scenario: ${scenarioName}${colors.reset}`);
      return;
    }

    console.log(`\n${colors.cyan}${colors.bright}Running Demo Scenario: ${scenarioName}${colors.reset}\n`);

    for (let i = 0; i < scenario.length; i++) {
      const step = scenario[i];
      console.log(`${colors.yellow}Step ${i + 1}/${scenario.length}:${colors.reset} ${step.location}`);
      console.log(`  User: ${colors.blue}${step.userId}${colors.reset}`);
      console.log(`  Location: ${colors.green}(${step.latitude}, ${step.longitude})${colors.reset}`);

      try {
        const result = await this.mockLocation(step.userId, step.longitude, step.latitude);
        console.log(`  ${colors.green}✓ Success${colors.reset}\n`);

        // Wait 1 second between steps for demo effect
        if (i < scenario.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log(`  ${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
      }
    }

    console.log(`${colors.green}${colors.bright}Demo scenario completed!${colors.reset}\n`);
  }

  async manualInput() {
    return new Promise((resolve) => {
      this.rl.question(`${colors.cyan}Enter User ID: ${colors.reset}`, (userId) => {
        this.rl.question(`${colors.cyan}Enter Latitude: ${colors.reset}`, (latitude) => {
          this.rl.question(`${colors.cyan}Enter Longitude: ${colors.reset}`, async (longitude) => {
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lon)) {
              console.log(`${colors.red}Invalid coordinates. Please enter valid numbers.${colors.reset}\n`);
              resolve();
              return;
            }

            try {
              const result = await this.mockLocation(userId, lon, lat);
              console.log(`${colors.green}${colors.bright}✓ Location mocked successfully!${colors.reset}`);
              console.log(`  User: ${colors.blue}${userId}${colors.reset}`);
              console.log(`  Location: ${colors.green}(${lat}, ${lon})${colors.reset}\n`);
            } catch (error) {
              console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
            }

            resolve();
          });
        });
      });
    });
  }

  showMenu() {
    console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║     🗺️  Location Mocker Tool 🗺️       ║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`);
    console.log(`${colors.yellow}Demo Scenarios:${colors.reset}`);
    console.log(`  ${colors.green}1${colors.reset} - Warsaw to Krakow journey (single user)`);
    console.log(`  ${colors.green}2${colors.reset} - Two users on different routes\n`);
    console.log(`${colors.yellow}Manual Options:${colors.reset}`);
    console.log(`  ${colors.green}3${colors.reset} - Manually input user location`);
    console.log(`  ${colors.green}4${colors.reset} - Exit\n`);
  }

  async start() {
    console.clear();
    console.log(`${colors.green}Connected to API: ${API_URL}${colors.reset}`);

    while (true) {
      this.showMenu();

      const choice = await new Promise((resolve) => {
        this.rl.question(`${colors.cyan}Select an option (1-4): ${colors.reset}`, resolve);
      });

      switch (choice.trim()) {
        case '1':
          await this.runDemoScenario('warsaw_to_krakow');
          break;
        case '2':
          await this.runDemoScenario('two_users_different_routes');
          break;
        case '3':
          await this.manualInput();
          break;
        case '4':
          console.log(`\n${colors.green}Goodbye! 👋${colors.reset}\n`);
          this.rl.close();
          process.exit(0);
          break;
        default:
          console.log(`${colors.red}Invalid option. Please select 1-4.${colors.reset}\n`);
      }
    }
  }
}

// Start the Location Mocker
const mocker = new LocationMocker();
mocker.start().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});

