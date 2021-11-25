import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import addCliEntry from './build-plugins/add-cli-entry'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/vue-sfc-doc',
    format: 'cjs'
  },
  plugins: [
    json(),
    typescript(),
    addCliEntry()
  ]
}