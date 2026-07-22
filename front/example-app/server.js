// Minimal static file server for local development - no bundler, no dependency.
// Usage: node server.js (reads PORT from the environment, defaults to 3001)
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = new URL('.', import.meta.url).pathname
const PORT = Number(process.env.PORT) || 3001

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
}

function resolveRequestPath(url) {
  const pathname = url === '/' ? '/index.html' : url
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  return join(ROOT, safePath)
}

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)
  const filePath = resolveRequestPath(url.pathname)

  readFile(filePath)
    .then((content) => {
      response.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream' })
      response.end(content)
    })
    .catch(() => {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('404 Not Found')
    })
})

server.listen(PORT, () => {
  console.log(`example-app running at http://localhost:${PORT}`)
})
