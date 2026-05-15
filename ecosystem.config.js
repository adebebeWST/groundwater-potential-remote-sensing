require('dotenv').config();
const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, './package.json');
const packageJson = fs.readFileSync(packagePath, 'utf8');
const pkg = JSON.parse(packageJson);

const env = process.env.NODE_ENV;

if (env !== 'production') {
  console.error('NODE ENV não esta configurado para produção');
  return;
}

module.exports = {
  apps: [
    {
      name: `${pkg.name.toUpperCase().replace(/-/g, ' ')}`,
      script: './dist/server.js',
      instances: process.env.INSTANCES || 2,
      exec_mode: 'cluster',
    },
  ],
};
