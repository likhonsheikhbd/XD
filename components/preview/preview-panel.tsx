'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PreviewPanelProps {
  files: Record<string, string>
  activeFile: string
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop'

export function PreviewPanel({ files, activeFile }: PreviewPanelProps) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const viewportSizes = {
    mobile: { width: 375, height: 667, icon: Smartphone },
    tablet: { width: 768, height: 1024, icon: Tablet },
    desktop: { width: '100%', height: '100%', icon: Monitor },
  }

  // Generate preview content
  const generatePreviewContent = () => {
    const htmlFile = files['index.html'] || files[Object.keys(files).find(f => f.endsWith('.html')) || '']
    const cssFile = files['style.css'] || files['styles.css'] || files[Object.keys(files).find(f => f.endsWith('.css')) || '']
    const jsFile = files['script.js'] || files['main.js'] || files[Object.keys(files).find(f => f.endsWith('.js')) || '']

    if (!htmlFile) {
      return `
        <html>
          <head>
            <title>Preview</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                padding: 2rem;
                text-align: center;
                color: #666;
              }
              .error {
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
              }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>No HTML file found</h2>
              <p>Create an HTML file to see the preview</p>
            </div>
          </body>
        </html>
      `
    }

    // Inject CSS and JS into HTML
    let content = htmlFile

    // Add CSS
    if (cssFile) {
      const cssTag = `<style>${cssFile}</style>`
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${cssTag}\n</head>`)
      } else {
        content = `<head>${cssTag}</head>${content}`
      }
    }

    // Add JS
    if (jsFile) {
      const jsTag = `<script>${jsFile}</script>`
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${jsTag}\n</body>`)
      } else {
        content = `${content}${jsTag}`
      }
    }

    return content
  }

  // Update preview
  const updatePreview = () => {
    if (!iframeRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const content = generatePreviewContent()
      const blob = new Blob([content], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      iframeRef.current.src = url
      
      // Cleanup previous URL
      const cleanup = () => URL.revokeObjectURL(url)
      setTimeout(cleanup, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-update preview when files change
  useEffect(() => {
    const timer = setTimeout(updatePreview, 500)
    return () => clearTimeout(timer)
  }, [files])

  const handleRefresh = () => {
    updatePreview()
  }

  const handleOpenExternal = () => {
    const content = generatePreviewContent()
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const currentViewport = viewportSizes[viewportSize]
  const ViewportIcon = currentViewport.icon

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Preview</h3>
            {isLoading && (
              <Badge variant="secondary" className="text-xs">
                Loading...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewport size selector */}
            <div className="flex items-center border rounded-md">
              {Object.entries(viewportSizes).map(([size, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={size}
                    variant={viewportSize === size ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize(size as ViewportSize)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenExternal}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 bg-muted/20">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div
              className={cn(
                "bg-white border rounded-lg shadow-lg overflow-hidden",
                viewportSize === 'desktop' ? "w-full h-full" : "flex-shrink-0"
              )}
              style={{
                width: viewportSize !== 'desktop' ? currentViewport.width : undefined,
                height: viewportSize !== 'desktop' ? currentViewport.height : undefined,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="border-t bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ViewportIcon className="h-3 w-3" />
            <span>
              {viewportSize === 'desktop' 
                ? 'Desktop View' 
                : `${currentViewport.width}×${currentViewport.height}`
              }
            </span>
          </div>
          
          <div className="text-muted-foreground">
            {Object.keys(files).length} file{Object.keys(files).length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}