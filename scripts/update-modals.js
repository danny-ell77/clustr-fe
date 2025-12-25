/**
 * Bulk Modal Update Script
 * 
 * This script:
 * 1. Finds all .vue files that import from ~/components/ui/dialog or @/components/ui/dialog
 * 2. Wraps content between </DialogHeader> and </DialogContent> with <DialogBody>
 *    (excluding already-wrapped content and footer sections)
 * 3. Adds DialogBody to the import statement
 * 4. Creates backup files before modification
 * 5. Outputs a summary of changes
 * 
 * Handles variations:
 * - DialogFooter inside or outside form tags
 * - Different indentation (2-space, 4-space)
 * - Dialogs without DialogFooter
 * 
 * Usage: node scripts/update-modals.js [--dry-run]
 */

import { readFileSync, writeFileSync, copyFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const COMPONENTS_DIR = join(process.cwd(), 'components')
const BACKUP_SUFFIX = '.backup'

function getAllVueFiles(dir, files = []) {
    const items = readdirSync(dir)
    
    for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)
        
        if (stat.isDirectory()) {
            if (item === 'node_modules' || item === '.nuxt' || item === '.output' || item === 'ui') continue
            getAllVueFiles(fullPath, files)
        } else if (item.endsWith('.vue')) {
            files.push(fullPath)
        }
    }
    
    return files
}

function hasDialogImport(content) {
    return content.includes("from '~/components/ui/dialog'") ||
           content.includes('from "~/components/ui/dialog"') ||
           content.includes("from '@/components/ui/dialog'") ||
           content.includes('from "@/components/ui/dialog"')
}

function hasDialogHeader(content) {
    return content.includes('</DialogHeader>')
}

function hasDialogBody(content) {
    return content.includes('<DialogBody') || content.includes('DialogBody,') || content.includes('DialogBody }') || content.includes('DialogBody,')
}

function addDialogBodyToImport(content) {
    const patterns = [
        /(import\s*\{)([^}]*)(}\s*from\s*['"]~\/components\/ui\/dialog['"])/,
        /(import\s*\{)([^}]*)(}\s*from\s*['"]@\/components\/ui\/dialog['"])/
    ]
    
    for (const pattern of patterns) {
        const match = content.match(pattern)
        if (match) {
            const imports = match[2]
            if (!imports.includes('DialogBody')) {
                let newImports
                if (imports.includes('DialogHeader')) {
                    newImports = imports.replace(/DialogHeader/, 'DialogBody, DialogHeader')
                } else {
                    newImports = ' DialogBody,' + imports
                }
                content = content.replace(pattern, `$1${newImports}$3`)
            }
            break
        }
    }
    
    return content
}

function getIndent(content) {
    const match = content.match(/<DialogHeader[^>]*>/m)
    if (match) {
        const lineStart = content.lastIndexOf('\n', match.index) + 1
        const leadingSpaces = content.slice(lineStart, match.index)
        return leadingSpaces
    }
    return '            '
}

function findContentBoundaries(content) {
    const headerEndIdx = content.indexOf('</DialogHeader>')
    if (headerEndIdx === -1) return null
    
    const afterHeaderIdx = content.indexOf('\n', headerEndIdx) + 1
    
    const dialogContentEndIdx = content.lastIndexOf('</DialogContent>')
    if (dialogContentEndIdx === -1) return null
    
    const footerIdx = content.indexOf('<DialogFooter', afterHeaderIdx)
    const formEndIdx = content.lastIndexOf('</form>', dialogContentEndIdx)
    
    let contentEndIdx
    
    if (footerIdx !== -1 && footerIdx < dialogContentEndIdx) {
        const beforeFooterLineEnd = content.lastIndexOf('\n', footerIdx)
        contentEndIdx = beforeFooterLineEnd !== -1 ? beforeFooterLineEnd : footerIdx
    } else if (formEndIdx !== -1 && formEndIdx < dialogContentEndIdx) {
        const beforeFormEndLineEnd = content.lastIndexOf('\n', formEndIdx)
        contentEndIdx = beforeFormEndLineEnd !== -1 ? beforeFormEndLineEnd : formEndIdx
    } else {
        const beforeDialogContentEndLineEnd = content.lastIndexOf('\n', dialogContentEndIdx)
        contentEndIdx = beforeDialogContentEndLineEnd !== -1 ? beforeDialogContentEndLineEnd : dialogContentEndIdx
    }
    
    return {
        start: afterHeaderIdx,
        end: contentEndIdx
    }
}

function wrapContentWithDialogBody(content) {
    const bounds = findContentBoundaries(content)
    if (!bounds) return { content, wrapped: false, reason: 'could not find boundaries' }
    
    const { start, end } = bounds
    
    const beforeContent = content.slice(0, start)
    const middleContent = content.slice(start, end)
    const afterContent = content.slice(end)
    
    const trimmedMiddle = middleContent.trim()
    if (!trimmedMiddle) {
        return { content, wrapped: false, reason: 'empty content' }
    }
    
    if (trimmedMiddle.startsWith('<DialogBody')) {
        return { content, wrapped: false, reason: 'already wrapped' }
    }
    
    const indent = getIndent(content)
    const innerIndent = indent + '  '
    
    const indentedMiddle = middleContent
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            const trimmed = line.trimStart()
            return innerIndent + '  ' + trimmed
        })
        .join('\n')
    
    const newContent = beforeContent + 
        indent + '<DialogBody>\n' + 
        indentedMiddle + '\n' +
        indent + '</DialogBody>\n' +
        afterContent
    
    return { content: newContent, wrapped: true, reason: 'success' }
}

function processFile(filePath) {
    const content = readFileSync(filePath, 'utf-8')
    
    if (!hasDialogImport(content)) {
        return { modified: false, reason: 'no dialog import' }
    }
    
    if (!hasDialogHeader(content)) {
        return { modified: false, reason: 'no DialogHeader' }
    }
    
    if (hasDialogBody(content)) {
        return { modified: false, reason: 'already has DialogBody' }
    }
    
    let newContent = addDialogBodyToImport(content)
    const { content: wrappedContent, wrapped, reason } = wrapContentWithDialogBody(newContent)
    
    if (!wrapped) {
        return { modified: false, reason }
    }
    
    newContent = wrappedContent
    
    if (newContent === content) {
        return { modified: false, reason: 'no changes needed' }
    }
    
    if (!DRY_RUN) {
        copyFileSync(filePath, filePath + BACKUP_SUFFIX)
        writeFileSync(filePath, newContent, 'utf-8')
    }
    
    return { modified: true, reason: 'updated' }
}

function main() {
    console.log('🔍 Scanning for Vue files in components directory...')
    console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
    console.log('')
    
    const vueFiles = getAllVueFiles(COMPONENTS_DIR)
    console.log(`   Found ${vueFiles.length} Vue files (excluding ui/ directory)`)
    console.log('')
    
    const results = {
        modified: [],
        skipped: []
    }
    
    for (const filePath of vueFiles) {
        const relativePath = relative(COMPONENTS_DIR, filePath)
        const result = processFile(filePath)
        
        if (result.modified) {
            results.modified.push({ path: relativePath })
            console.log(`✅ ${relativePath}`)
        } else {
            results.skipped.push({ path: relativePath, reason: result.reason })
        }
    }
    
    console.log('')
    console.log('=' .repeat(50))
    console.log('SUMMARY')
    console.log('=' .repeat(50))
    console.log(`✅ Modified: ${results.modified.length} files`)
    console.log(`⏭️  Skipped: ${results.skipped.length} files`)
    console.log('')
    
    if (results.modified.length > 0) {
        console.log('Modified files:')
        for (const file of results.modified) {
            console.log(`  - ${file.path}`)
        }
        console.log('')
        
        if (!DRY_RUN) {
            console.log('💾 Backup files created with .backup extension')
        }
    }
    
    const skippedByReason = {}
    for (const file of results.skipped) {
        if (!skippedByReason[file.reason]) {
            skippedByReason[file.reason] = []
        }
        skippedByReason[file.reason].push(file.path)
    }
    
    console.log('Skipped files by reason:')
    for (const [reason, files] of Object.entries(skippedByReason)) {
        console.log(`  ${reason}: ${files.length} files`)
    }
}

main()
