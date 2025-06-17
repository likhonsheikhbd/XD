import { parseCodeRequest, extractCodeBlocks, generateFileStructure } from '@/lib/code-parser'

describe('code-parser', () => {
  describe('parseCodeRequest', () => {
    it('detects generate request type', () => {
      const result = parseCodeRequest('Create a new React component')
      expect(result.type).toBe('generate')
    })

    it('detects explain request type', () => {
      const result = parseCodeRequest('Explain this function')
      expect(result.type).toBe('explain')
    })

    it('detects debug request type', () => {
      const result = parseCodeRequest('Fix this error in my code')
      expect(result.type).toBe('debug')
    })

    it('detects optimize request type', () => {
      const result = parseCodeRequest('Optimize this code for performance')
      expect(result.type).toBe('optimize')
    })

    it('detects modify request type', () => {
      const result = parseCodeRequest('Change this function to use async/await')
      expect(result.type).toBe('modify')
    })

    it('extracts language from content', () => {
      const result = parseCodeRequest('Create a Python function')
      expect(result.language).toBe('python')
    })

    it('extracts framework from content', () => {
      const result = parseCodeRequest('Build a React component')
      expect(result.framework).toBe('react')
    })

    it('extracts requirements', () => {
      const result = parseCodeRequest('Create a component that should be responsive and accessible')
      expect(result.requirements).toContain('Make it responsive')
      expect(result.requirements).toContain('Ensure accessibility')
    })
  })

  describe('extractCodeBlocks', () => {
    it('extracts single code block', () => {
      const content = `
Here's a function:

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

That's it!
      `

      const blocks = extractCodeBlocks(content)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].language).toBe('javascript')
      expect(blocks[0].code).toContain('function hello()')
    })

    it('extracts multiple code blocks', () => {
      const content = `
\`\`\`html
<div>Hello</div>
\`\`\`

\`\`\`css
div { color: red; }
\`\`\`
      `

      const blocks = extractCodeBlocks(content)
      expect(blocks).toHaveLength(2)
      expect(blocks[0].language).toBe('html')
      expect(blocks[1].language).toBe('css')
    })

    it('handles code blocks without language', () => {
      const content = `
\`\`\`
console.log('test');
\`\`\`
      `

      const blocks = extractCodeBlocks(content)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].language).toBe('text')
    })
  })

  describe('generateFileStructure', () => {
    it('generates files from code blocks', () => {
      const blocks = [
        { language: 'javascript', code: 'console.log("hello");' },
        { language: 'html', code: '<div>Hello</div>' },
        { language: 'css', code: 'body { margin: 0; }' },
      ]

      const files = generateFileStructure(blocks)
      expect(Object.keys(files)).toHaveLength(3)
      expect(files['file1.js']).toBe('console.log("hello");')
      expect(files['file2.html']).toBe('<div>Hello</div>')
      expect(files['file3.css']).toBe('body { margin: 0; }')
    })

    it('handles unknown languages', () => {
      const blocks = [
        { language: 'unknown', code: 'some code' },
      ]

      const files = generateFileStructure(blocks)
      expect(files['file1.txt']).toBe('some code')
    })
  })
})