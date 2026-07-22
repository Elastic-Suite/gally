// Static site, nothing to bundle: just copy the served files into dist/.
import { cpSync, mkdirSync, rmSync } from 'node:fs'

const FILES = [
  'index.html',
  'style.css',
  'script.js',
  'products.js',
  'favicon.ico',
  'manifest.json',
  'robots.txt',
  'logo192.png',
  'logo512.png',
]

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist')
for (const file of FILES) {
  cpSync(file, `dist/${file}`)
}

console.log(`example-app built to dist/ (${FILES.length} files)`)
