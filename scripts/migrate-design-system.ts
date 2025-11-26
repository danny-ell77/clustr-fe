#!/usr/bin/env node
/**
 * Design System Migration Script
 * Migrates inline Tailwind classes to standardized design system classes
 * 
 * Usage:
 *   npm run migrate:design-system -- --dry-run
 *   npm run migrate:design-system -- --file=modules/property/pages/index.vue
 *   npm run migrate:design-system
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'

interface Pattern {
  name: string
  search: RegExp
  replace: string | ((match: string, ...groups: string[]) => string)
  description: string
  category: string
}

interface MigrationResult {
  file: string
  changes: number
  patterns: string[]
  preview?: string[]
}

const patterns: Pattern[] = [
  {
    name: 'card-with-shadow',
    search: /class="([^"]*?)bg-white\s+rounded-lg\s+shadow(?:\s+p-6)?([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/bg-white|rounded-lg|shadow|p-6/g, '').replace(/\s+/g, ' ').trim()
      return `class="card${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Card with shadow',
    category: 'Card'
  },

  {
    name: 'card-header',
    search: /class="([^"]*?)px-6\s+py-4\s+border-b\s+border-gray-200([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/px-6|py-4|border-b|border-gray-200/g, '').replace(/\s+/g, ' ').trim()
      return `class="card-header${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Card header',
    category: 'Card'
  },

  {
    name: 'btn-primary-white',
    search: /class="([^"]*?)(?:px-4\s+py-2\s+)?bg-white\s+text-blue-600\s+rounded-lg(?:\s+text-sm)?(?:\s+font-medium)?(?:\s+hover:bg-blue-50)?([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/px-4|py-2|bg-white|text-blue-600|rounded-lg|text-sm|font-medium|hover:bg-blue-50/g, '').replace(/\s+/g, ' ').trim()
      return `class="btn-primary${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Primary button (white variant)',
    category: 'Button'
  },

  {
    name: 'btn-secondary',
    search: /class="([^"]*?)(?:px-4\s+py-2\s+)?bg-gray-100\s+text-gray-700\s+rounded-lg(?:\s+text-sm)?(?:\s+font-medium)?(?:\s+hover:bg-gray-200)?([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/px-4|py-2|bg-gray-100|text-gray-700|rounded-lg|text-sm|font-medium|hover:bg-gray-200/g, '').replace(/\s+/g, ' ').trim()
      return `class="btn-secondary${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Secondary button',
    category: 'Button'
  },

  {
    name: 'btn-ghost',
    search: /class="([^"]*?)p-2\s+hover:bg-gray-100\s+rounded-lg([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/p-2|hover:bg-gray-100|rounded-lg/g, '').replace(/\s+/g, ' ').trim()
      return `class="btn-ghost${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Ghost button',
    category: 'Button'
  },

  {
    name: 'badge-success',
    search: /class="([^"]*?)bg-green-100\s+text-green-800([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/bg-green-100|text-green-800/g, '').replace(/\s+/g, ' ').trim()
      return `class="badge-success${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Success badge',
    category: 'Badge'
  },

  {
    name: 'badge-info',
    search: /class="([^"]*?)bg-blue-100\s+text-blue-800([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/bg-blue-100|text-blue-800/g, '').replace(/\s+/g, ' ').trim()
      return `class="badge-info${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Info badge',
    category: 'Badge'
  },

  {
    name: 'badge-warning',
    search: /class="([^"]*?)bg-yellow-100\s+text-yellow-800([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/bg-yellow-100|text-yellow-800/g, '').replace(/\s+/g, ' ').trim()
      return `class="badge-warning${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Warning badge',
    category: 'Badge'
  },

  {
    name: 'badge-error',
    search: /class="([^"]*?)bg-red-100\s+text-red-800([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/bg-red-100|text-red-800/g, '').replace(/\s+/g, ' ').trim()
      return `class="badge-error${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Error badge',
    category: 'Badge'
  },

  {
    name: 'table-base',
    search: /class="([^"]*?)min-w-full\s+divide-y\s+divide-gray-200([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/min-w-full|divide-y|divide-gray-200/g, '').replace(/\s+/g, ' ').trim()
      return `class="table${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Table base',
    category: 'Table'
  },

  {
    name: 'table-header-bg',
    search: /class="([^"]*?)bg-gray-50([^"]*)"/g,
    replace: (match, before, after) => {
      const fullClass = `${before}${after}`.trim()
      if (fullClass.includes('thead') || fullClass.includes('th')) {
        return match
      }
      const otherClasses = fullClass.replace(/bg-gray-50/g, '').replace(/\s+/g, ' ').trim()
      return `class="${otherClasses}"`
    },
    description: 'Table header background (handled by CSS)',
    category: 'Table'
  },

  {
    name: 'table-row-hover',
    search: /class="([^"]*?)hover:bg-gray-50([^"]*)"/g,
    replace: (match, before, after) => {
      const fullClass = `${before}${after}`.trim()
      const otherClasses = fullClass.replace(/hover:bg-gray-50/g, '').replace(/\s+/g, ' ').trim()
      return `class="${otherClasses}"`
    },
    description: 'Table row hover (handled by CSS)',
    category: 'Table'
  },

  {
    name: 'icon-container',
    search: /class="([^"]*?)p-3\s+bg-blue-100\s+rounded-lg([^"]*)"/g,
    replace: (match, before, after) => {
      const classes = `${before}${after}`.trim()
      const otherClasses = classes.replace(/p-3|bg-blue-100|rounded-lg/g, '').replace(/\s+/g, ' ').trim()
      return `class="p-3 bg-accent rounded-lg${otherClasses ? ' ' + otherClasses : ''}"`
    },
    description: 'Icon container with accent background',
    category: 'Icon'
  },

  {
    name: 'text-gray-900',
    search: /text-gray-900/g,
    replace: 'text-foreground',
    description: 'Primary text color',
    category: 'Typography'
  },

  {
    name: 'text-gray-600',
    search: /text-gray-600/g,
    replace: 'text-muted-foreground',
    description: 'Muted text color',
    category: 'Typography'
  },

  {
    name: 'text-gray-500',
    search: /text-gray-500/g,
    replace: 'text-muted-foreground',
    description: 'Muted text color',
    category: 'Typography'
  },

  {
    name: 'text-gray-700',
    search: /text-gray-700/g,
    replace: 'text-foreground',
    description: 'Primary text color',
    category: 'Typography'
  },

  {
    name: 'border-gray-200',
    search: /border-gray-200/g,
    replace: 'border-border',
    description: 'Border color',
    category: 'Border'
  },

  {
    name: 'border-gray-300',
    search: /border-gray-300/g,
    replace: 'border-border',
    description: 'Border color',
    category: 'Border'
  },

  {
    name: 'divide-gray-200',
    search: /divide-gray-200/g,
    replace: 'divide-border',
    description: 'Divider color',
    category: 'Border'
  }
]

async function migrateFile(filepath: string, dryRun: boolean = false): Promise<MigrationResult> {
  const content = readFileSync(filepath, 'utf-8')
  let newContent = content
  let changes = 0
  const appliedPatterns: string[] = []
  const preview: string[] = []

  patterns.forEach(pattern => {
    const before = newContent

    if (typeof pattern.replace === 'function') {
      newContent = newContent.replace(pattern.search, (...args) => {
        const result = pattern.replace(...args)
        if (result !== args[0]) {
          changes++
          if (!appliedPatterns.includes(pattern.name)) {
            appliedPatterns.push(pattern.name)
          }
          if (dryRun && preview.length < 5) {
            preview.push(`  - ${pattern.description}:\n    Before: ${args[0].substring(0, 80)}...\n    After:  ${result.substring(0, 80)}...`)
          }
        }
        return result
      })
    } else {
      newContent = newContent.replace(pattern.search, pattern.replace)
      if (before !== newContent) {
        changes++
        if (!appliedPatterns.includes(pattern.name)) {
          appliedPatterns.push(pattern.name)
        }
      }
    }
  })

  if (!dryRun && changes > 0) {
    writeFileSync(filepath, newContent, 'utf-8')
  }

  return {
    file: filepath,
    changes,
    patterns: appliedPatterns,
    preview: dryRun ? preview : undefined
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const fileArg = args.find(arg => arg.startsWith('--file='))
  const targetFile = fileArg ? fileArg.split('=')[1] : null

  console.log('🎨 Design System Migration Script\n')
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN' : '✏️  WRITE'}\n`)

  let files: string[]

  if (targetFile) {
    files = [resolve(process.cwd(), targetFile)]
    console.log(`Target: Single file - ${targetFile}\n`)
  } else {
    files = await glob('modules/**/*.vue', {
      cwd: process.cwd(),
      absolute: true,
      ignore: ['**/node_modules/**']
    })
    console.log(`Target: All module pages (${files.length} files)\n`)
  }

  const results: MigrationResult[] = []
  let totalChanges = 0

  for (const file of files) {
    const result = await migrateFile(file, dryRun)
    if (result.changes > 0) {
      results.push(result)
      totalChanges += result.changes
    }
  }

  console.log('📊 Migration Results:\n')
  console.log('═'.repeat(80))

  if (results.length === 0) {
    console.log('✨ No changes needed - all files already use design system classes!')
  } else {
    results.forEach(result => {
      const relativePath = result.file.replace(process.cwd(), '').replace(/\\/g, '/')
      console.log(`\n📁 ${relativePath}`)
      console.log(`   ✓ ${result.changes} replacements made`)
      console.log(`   ✓ Patterns applied: ${result.patterns.join(', ')}`)

      if (result.preview && result.preview.length > 0) {
        console.log('\n   Preview of changes:')
        result.preview.forEach(p => console.log(p))
      }
    })

    console.log('\n' + '═'.repeat(80))
    console.log(`\n📈 Summary:`)
    console.log(`   • Files modified: ${results.length}`)
    console.log(`   • Total replacements: ${totalChanges}`)

    if (dryRun) {
      console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.')
    } else {
      console.log('\n✅ Migration complete!')
    }
  }

  console.log('\n')
}

main().catch(console.error)
