import { defineConfig, Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Vite plugin to resolve Figma asset imports.
 * Transforms `figma:asset/<hash>.png` → `src/assets/<hash>.png`
 * If the asset doesn't exist locally, returns a transparent 1x1 pixel placeholder.
 */
function figmaAssetResolver(): Plugin {
  const FIGMA_PREFIX = 'figma:asset/'
  const assetsDir = path.resolve(__dirname, 'src/assets')

  // 1x1 transparent PNG as base64 data URI (fallback)
  const PLACEHOLDER =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg=='

  return {
    name: 'figma-asset-resolver',
    enforce: 'pre',

    resolveId(source) {
      if (source.startsWith(FIGMA_PREFIX)) {
        const filename = source.slice(FIGMA_PREFIX.length)
        const absolute = path.join(assetsDir, filename)

        if (fs.existsSync(absolute)) {
          return absolute
        }
        // Return a virtual module id for missing assets
        return `\0figma-placeholder:${filename}`
      }
      return null
    },

    load(id) {
      if (id.startsWith('\0figma-placeholder:')) {
        return `export default "${PLACEHOLDER}";`
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
