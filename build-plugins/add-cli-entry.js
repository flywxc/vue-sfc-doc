import MagicString from 'magic-string'

export default function addCliEntry () {
  return {
    name: 'add-cli-entry',
    renderChunk (code, chunkInfo) {
      const magicString = new MagicString(code)
      magicString.prepend('#!/usr/bin/env node\n\n')
      return { code: magicString.toString(), map: magicString.generateMap({ hires: true }) }
    }
  }
}
