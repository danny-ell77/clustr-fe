#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'

interface MigrationResult {
    file: string
    changes: number
    componentsAdded: Set<string>
}

function migrateButtons(content: string, componentsAdded: Set<string>): string {
    let newContent = content

    newContent = newContent.replace(
        /<button\s+([^>]*?)class="([^"]*?bg-blue-600[^"]*?)"([^>]*?)>([\s\S]*?)<\/button>/g,
        (_match, before, classes, after, btnContent) => {
            const attrs = `${before} ${after}`.trim().replace(/class="[^"]*"/g, '').trim()
            const remaining = classes.replace(/bg-blue-600|hover:bg-blue-700|text-white|rounded-lg|px-\d+|py-\d+|transition-colors/g, '').replace(/\s+/g, ' ').trim()
            componentsAdded.add('Button')
            const classAttr = remaining ? ` class="${remaining}"` : ''
            return `<Button${attrs ? ' ' + attrs : ''}${classAttr}>${btnContent}</Button>`
        }
    )

    newContent = newContent.replace(
        /<button\s+([^>]*?)class="([^"]*?bg-red-600[^"]*?)"([^>]*?)>([\s\S]*?)<\/button>/g,
        (_match, before, classes, after, btnContent) => {
            const attrs = `${before} ${after}`.trim().replace(/class="[^"]*"/g, '').trim()
            const remaining = classes.replace(/bg-red-600|hover:bg-red-700|text-white|rounded-lg|px-\d+|py-\d+/g, '').replace(/\s+/g, ' ').trim()
            componentsAdded.add('Button')
            const classAttr = remaining ? ` class="${remaining}"` : ''
            return `<Button${attrs ? ' ' + attrs : ''} variant="destructive"${classAttr}>${btnContent}</Button>`
        }
    )

    return newContent
}

function addImports(content: string, componentsAdded: Set<string>): string {
    if (componentsAdded.size === 0) return content

    const scriptMatch = content.match(/<script\s+setup\s+lang="ts">([\s\S]*?)<\/script>/)
    if (!scriptMatch) return content

    const scriptContent = scriptMatch[1]
    const imports: string[] = []

    if (componentsAdded.has('Button') && !scriptContent.includes("from '~/components/ui/button'")) {
        imports.push("import { Button } from '~/components/ui/button'")
    }

    if (imports.length === 0) return content

    const existingImports = scriptContent.match(/^import\s+.*$/gm) || []
    const lastImportIndex = existingImports.length > 0
        ? scriptContent.lastIndexOf(existingImports[existingImports.length - 1]) + existingImports[existingImports.length - 1].length
        : 0

    const newScriptContent =
        scriptContent.slice(0, lastImportIndex) +
        '\n' + imports.join('\n') +
        scriptContent.slice(lastImportIndex)

    return content.replace(scriptMatch[0], `<script setup lang="ts">${newScriptContent}</script>`)
}

async function migrateFile(filepath: string, dryRun: boolean = false): Promise<MigrationResult> {
    const content = readFileSync(filepath, 'utf-8')
    const componentsAdded = new Set<string>()

    let newContent = content
    newContent = migrateButtons(newContent, componentsAdded)
    newContent = addImports(newContent, componentsAdded)

    const changes = componentsAdded.size

    if (!dryRun && changes > 0) {
        writeFileSync(filepath, newContent, 'utf-8')
    }

    return { file: filepath, changes, componentsAdded }
}

async function main() {
    const args = process.argv.slice(2)
    const dryRun = args.includes('--dry-run')
    const fileArg = args.find(arg => arg.startsWith('--file='))
    const targetFile = fileArg ? fileArg.split('=')[1] : null

    console.log('🎨 Shadcn-Vue Component Migration\n')
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'WRITE'}\n`)

    let files: string[]

    if (targetFile) {
        files = [resolve(process.cwd(), targetFile)]
        console.log(`Target: ${targetFile}\n`)
    } else {
        files = await glob('modules/**/*.vue', {
            cwd: process.cwd(),
            absolute: true,
            ignore: ['**/node_modules/**']
        })
        console.log(`Scanning ${files.length} files...\n`)
    }

    const results: MigrationResult[] = []

    for (const file of files) {
        const result = await migrateFile(file, dryRun)
        if (result.changes > 0) {
            results.push(result)
        }
    }

    console.log('═'.repeat(60))

    if (results.length === 0) {
        console.log('\n✨ No changes needed - all files already use shadcn components!')
    } else {
        console.log('\n📊 Migration Results:\n')
        results.forEach(result => {
            const relativePath = result.file.replace(process.cwd(), '').replace(/\\/g, '/')
            console.log(`📁 ${relativePath}`)
            console.log(`   ✓ Components: ${Array.from(result.componentsAdded).join(', ')}\n`)
        })
        console.log(`✅ Modified ${results.length} file(s)`)

        if (dryRun) {
            console.log('\n💡 Run without --dry-run to apply changes')
        }
    }
    console.log()
}

main().catch(console.error)
