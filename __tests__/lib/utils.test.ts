import { 
  cn, 
  formatBytes, 
  formatDate, 
  debounce, 
  throttle, 
  generateId,
  slugify,
  getFileExtension,
  getMimeType 
} from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500', 'text-green-500')
      expect(result).toBe('bg-blue-500 text-green-500')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toBe('base-class conditional-class')
    })
  })

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
      expect(formatBytes(1073741824)).toBe('1 GB')
    })

    it('handles decimal places', () => {
      expect(formatBytes(1536, 1)).toBe('1.5 KB')
      expect(formatBytes(1536, 0)).toBe('2 KB')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z')
      const result = formatDate(date)
      expect(result).toMatch(/December 25, 2023/)
    })

    it('handles string dates', () => {
      const result = formatDate('2023-12-25')
      expect(result).toMatch(/December 25, 2023/)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('delays function execution', () => {
      const fn = jest.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      expect(fn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const fn = jest.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    jest.useFakeTimers()

    it('limits function calls', () => {
      const fn = jest.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(fn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('generateId', () => {
    it('generates id of correct length', () => {
      const id = generateId(10)
      expect(id).toHaveLength(10)
    })

    it('generates unique ids', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Hello, World!')).toBe('hello-world')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })

    it('handles special characters', () => {
      expect(slugify('Hello@World#123')).toBe('helloworld123')
    })
  })

  describe('getFileExtension', () => {
    it('extracts file extension', () => {
      expect(getFileExtension('file.txt')).toBe('txt')
      expect(getFileExtension('path/to/file.js')).toBe('js')
      expect(getFileExtension('file.min.css')).toBe('css')
    })

    it('handles files without extension', () => {
      expect(getFileExtension('README')).toBe('')
    })
  })

  describe('getMimeType', () => {
    it('returns correct mime types', () => {
      expect(getMimeType('file.txt')).toBe('text/plain')
      expect(getMimeType('file.html')).toBe('text/html')
      expect(getMimeType('file.js')).toBe('application/javascript')
      expect(getMimeType('file.png')).toBe('image/png')
    })

    it('returns default for unknown extensions', () => {
      expect(getMimeType('file.unknown')).toBe('application/octet-stream')
    })
  })
})