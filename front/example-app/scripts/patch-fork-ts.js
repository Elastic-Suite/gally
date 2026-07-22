const fs = require('fs');
const path = require('path');

// Fix fork-ts-checker-webpack-plugin crash with TypeScript 5.x
// The plugin tries to set properties on ts.performance which are read-only in TS 5+

const candidates = [
  path.resolve(__dirname, '../node_modules/fork-ts-checker-webpack-plugin/lib/typescript-reporter/profile/TypeScriptPerformance.js'),
  path.resolve(__dirname, '../../node_modules/fork-ts-checker-webpack-plugin/lib/typescript-reporter/profile/TypeScriptPerformance.js'),
];

const patched = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// PATCHED for TS 5.x compatibility
function getTypeScriptPerformance(typescript) { return typescript.performance; }
function connectTypeScriptPerformance(typescript, performance) { return performance; }
function disconnectTypeScriptPerformance(typescript) {}
exports.getTypeScriptPerformance = getTypeScriptPerformance;
exports.connectTypeScriptPerformance = connectTypeScriptPerformance;
exports.disconnectTypeScriptPerformance = disconnectTypeScriptPerformance;
`;

for (const fp of candidates) {
  if (fs.existsSync(fp)) {
    const content = fs.readFileSync(fp, 'utf8');
    if (!content.includes('// PATCHED')) {
      fs.writeFileSync(fp, patched, 'utf8');
      console.log('Patched:', fp);
    }
  }
}
