import fg from 'fast-glob'
import path from 'node:path'
import fs from 'node:fs'

let cwd = process.cwd()
let files = []

let prefix = process.env.PRESSKIT_CONTENT_DIR ?? path.join(cwd, 'content')
if (!fs.existsSync(prefix)) {
  console.log(`Content directory: '${prefix}' does not exist.`)
  process.exit(1)
}

let template = fs.readFileSync('index.js.template', { encoding: 'utf-8' })
if (!template) {
  console.log('no index.js.template')
  process.exit(1)
}

// https://github.com/mrmlnc/fast-glob#readme
let globPath = path.join(prefix, '/**/*.md')
files = (await fg.glob(globPath)).map((file) => file.slice(prefix.length))
let list = JSON.stringify(files, null, 2)
let dir = JSON.stringify(prefix)

let outfile = template.replace('<MANIFEST>', list).replace('<CONTENT_DIR>', dir)
// console.log(outfile)

fs.writeFileSync('index.js', outfile)
console.log('generated content manifest for localhost dev')
