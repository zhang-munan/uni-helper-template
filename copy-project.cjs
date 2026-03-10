#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

/**
 * 解析 .gitignore 文件，返回匹配模式数组
 */
function parseGitignore(gitignorePath) {
  if (!fs.existsSync(gitignorePath)) {
    console.warn('Warning: .gitignore not found, no files will be excluded')
    return []
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8')
  const lines = content.split('\n')

  const patterns = []
  for (const line of lines) {
    const trimmed = line.trim()
    // 跳过空行和注释
    if (!trimmed || trimmed.startsWith('#'))
      continue
    patterns.push(trimmed)
  }

  return patterns
}

/**
 * 将 gitignore 模式转换为正则表达式
 */
function patternToRegex(pattern) {
  // 处理 ** 匹配任意目录
  let regex = pattern.replace(/\*\*/g, '{{DOUBLE_STAR}}')

  // 转义特殊字符
  regex = regex.replace(/[.+^${}()|[\]\\]/g, '\\$&')

  // 处理 * 匹配任意字符（除了路径分隔符）
  regex = regex.replace(/\*/g, '[^/\\\\]*')

  // 处理 ? 匹配单个字符
  regex = regex.replace(/\?/g, '[^/\\\\]')

  // 恢复 **
  regex = regex.replace(/\{\{DOUBLE_STAR\}\}/g, '.*')

  // 处理目录模式（以 / 结尾）
  if (regex.endsWith('/')) {
    regex = `${regex}.*`
  }

  return new RegExp(`(^|/)${regex}(/|$)`)
}

/**
 * 检查路径是否应该被忽略
 */
function shouldIgnore(filePath, patterns, baseDir) {
  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/')
  const fileName = path.basename(filePath)

  for (const pattern of patterns) {
    // 检查是否是简单的文件扩展名模式 (如 *.log)
    if (pattern.startsWith('*.')) {
      const ext = pattern.slice(1) // 获取 .log 这样的扩展名
      if (fileName.endsWith(ext) || relativePath.endsWith(ext)) {
        return true
      }
    }

    // 检查是否是简单的名称模式 (如 node_modules)
    if (!pattern.includes('/') && !pattern.includes('*')) {
      if (fileName === pattern || relativePath === pattern) {
        return true
      }
    }

    // 检查路径中的任何部分
    const parts = relativePath.split('/')
    for (let i = 0; i < parts.length; i++) {
      const subPath = parts.slice(i).join('/')
      try {
        const regex = patternToRegex(pattern)
        if (regex.test(subPath) || regex.test(relativePath)) {
          return true
        }
      }
      catch {
        // 如果正则转换失败，使用简单的字符串匹配
        if (subPath.includes(pattern) || fileName === pattern) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * 递归复制目录
 */
function copyDirectory(src, dest, patterns, baseDir) {
  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    // 检查是否应该忽略
    if (shouldIgnore(srcPath, patterns, baseDir)) {
      continue
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, patterns, baseDir)
    }
    else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // eslint-disable-next-line no-console
    console.log('Usage: node copy-project.js <destination-path>')
    // eslint-disable-next-line no-console
    console.log('Example: node copy-project.js /path/to/backup')
    process.exit(1)
  }

  const destPath = path.resolve(args[0])
  const srcPath = process.cwd()
  const gitignorePath = path.join(srcPath, '.gitignore')

  // 默认忽略的模式
  const defaultIgnore = ['.git', 'copy-project.cjs']

  // 解析 .gitignore
  const gitignorePatterns = parseGitignore(gitignorePath)
  const allPatterns = [...defaultIgnore, ...gitignorePatterns]

  // eslint-disable-next-line no-console
  console.log(`Source: ${srcPath}`)
  // eslint-disable-next-line no-console
  console.log(`Destination: ${destPath}`)
  // eslint-disable-next-line no-console
  console.log(`Excluding: .git and ${gitignorePatterns.length} patterns from .gitignore`)
  // eslint-disable-next-line no-console
  console.log('')

  // 检查目标路径是否已存在
  if (fs.existsSync(destPath)) {
    // eslint-disable-next-line no-console
    console.log(`Warning: Destination "${destPath}" already exists.`)
    // eslint-disable-next-line no-console
    console.log('Files will be merged/overwritten.')
  }

  try {
    copyDirectory(srcPath, destPath, allPatterns, srcPath)
    // eslint-disable-next-line no-console
    console.log('✓ Copy completed successfully!')
  }
  catch (error) {
    console.error('Error during copy:', error.message)
    process.exit(1)
  }
}

main()
