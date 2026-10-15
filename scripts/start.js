// Runs backend and frontend together, prefixing each output line.
// Stops both when either exits or on Ctrl+C
const { spawn } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const frontendDir = path.join(root, 'frontend')
const viteBin = path.join(
  path.dirname(require.resolve('vite/package.json', { paths: [frontendDir] })),
  'bin',
  'vite.js',
)

const apps = [
  { name: 'backend', color: 36, cwd: root, args: [path.join(root, 'backend', 'index.js')] },
  { name: 'frontend', color: 35, cwd: frontendDir, args: [viteBin] },
]

const children = []
let shuttingDown = false

const prefixLines = (name, color) => {
  const prefix = `\x1b[${color}m[${name}]\x1b[0m `
  let pending = ''
  return (chunk) => {
    const lines = (pending + chunk).split(/\r?\n/)
    pending = lines.pop()
    lines.forEach((line) => process.stdout.write(prefix + line + '\n'))
  }
}

const shutdown = (code = 0) => {
  if (shuttingDown) return
  shuttingDown = true
  children.forEach((child) => child.exitCode === null && child.kill())
  process.exitCode = code
}

apps.forEach(({ name, color, cwd, args }) => {
  const child = spawn(process.execPath, args, { cwd, env: { ...process.env, FORCE_COLOR: '1' } })
  const write = prefixLines(name, color)
  child.stdout.on('data', write)
  child.stderr.on('data', write)
  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.log(`[${name}] exited with code ${code}, stopping the other process`)
      shutdown(code || 1)
    }
  })
  children.push(child)
})

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
