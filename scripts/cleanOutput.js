#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const output = path.resolve(__dirname, "..", "wiki", "output");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
console.log(`Cleaned ${output}`);
