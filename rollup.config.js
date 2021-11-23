import json from '@rollup/plugin-json'
import addCliEntry from './build-plugins/add-cli-entry'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/vue-sfc-doc',
    format: 'cjs'
  },
  plugins: [
    addCliEntry(),
    json()
  ]
}