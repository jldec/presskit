import fg from 'fast-glob'
import path from 'node:path'
import fs from 'node:fs'

let cwd = process.cwd()
let files = []
let redirects = []
let contentDir = process.argv[2] || path.join(cwd, 'content')

if (!fs.existsSync(contentDir)) {
  console.log(`Content directory: '${contentDir}' does not exist.`)
  process.exit(1)
}

let template = fs.readFileSync('index.js.template', { encoding: 'utf-8' })
if (!template) {
  console.log('no index.js.template')
  process.exit(1)
}

try {
  let redirectsFile = path.join(contentDir, '_redirects')
  // this is just for testing
  // _redirects is parsed in worker/src/redirects.ts
  redirects = fs
    .readFileSync(redirectsFile, { encoding: 'utf-8' })
    .split('\n')
    .map((line) => line.trim().split(/\s+/))
    .filter((line) => line.length >= 2)
    .map(([path, redirect, status]) => ({ path, redirect, status }))
} catch (e) {
  console.log(`No _redirects: ${e.message}`)
}

// https://github.com/mrmlnc/fast-glob#readme
try {
  let globPath = path.join(contentDir, '/**/*')
  files = (await fg.glob(globPath)).map((file) => file.slice(contentDir.length))
} catch (e) {
  console.log(`No files: ${e.message}`)
}

let outfile = template
  .replace('<MANIFEST>', JSON.stringify(files, null, 2))
  .replace('<REDIRECTS>', JSON.stringify(redirects, null, 2))
  .replace('<CONTENT_DIR>', JSON.stringify(contentDir))
// console.log(outfile)

fs.writeFileSync('index.js', outfile)
console.log('generated content manifest for localhost dev')
