import MagicString from 'magic-string'
import { Plugin } from 'rollup'

export default function addCliEntry(): Plugin {
  return {
    name: 'add-cli-entry',
    renderChunk(code) {
      const magicString = new MagicString(code)
      magicString.prepend('#!/usr/bin/env node\n\n')
      return { code: magicString.toString(), map: magicString.generateMap({ hires: true }) }
    }
  }
}
