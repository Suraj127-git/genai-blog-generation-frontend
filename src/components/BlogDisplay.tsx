import { useSelector } from 'react-redux'
import { useState } from 'react'
import type { RootState } from '../store'

export default function BlogDisplay() {
  const blog = useSelector((s: RootState) => s.blog.blog)
  const error = useSelector((s: RootState) => s.blog.error)
  const [copied, setCopied] = useState(false)

  if (error) return <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>
  if (!blog) return null

  const title = blog.title || 'Generated Blog'
  const content = blog.content || ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  // Parse markdown-like content and convert to HTML-like structure
  const parseContent = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let currentList: string[] = []
    let inList = false

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc pl-6 mb-4 space-y-1">
            {currentList.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        )
        currentList = []
        inList = false
      }
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      // Handle headers
      if (trimmed.match(/^#{1,6}\s/)) {
        flushList()
        const level = trimmed.match(/^#+/)?.[0].length || 1
        const text = trimmed.replace(/^#+\s/, '')
        const className = {
          1: 'text-3xl font-bold mb-6 text-gray-900 border-b pb-2',
          2: 'text-2xl font-semibold mb-4 text-gray-800 mt-6',
          3: 'text-xl font-medium mb-3 text-gray-800 mt-4',
          4: 'text-lg font-medium mb-2 text-gray-800 mt-3',
          5: 'text-base font-medium mb-2 text-gray-800 mt-2',
          6: 'text-sm font-medium mb-1 text-gray-800 mt-2'
        }[level] || 'text-base font-medium mb-2 text-gray-800'
        
        // Use div with appropriate heading classes instead of dynamic h tags
        elements.push(
          <div key={index} className={`font-bold ${className}`} role="heading" aria-level={level}>
            {text}
          </div>
        )
      }
      // Handle list items
      else if (trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/)) {
        const itemText = trimmed.replace(/^[-*+\d+\.]+\s/, '')
        currentList.push(itemText)
        inList = true
      }
      // Handle empty lines
      else if (trimmed === '') {
        flushList()
        if (index < lines.length - 1 && lines[index + 1].trim() !== '') {
          elements.push(<div key={index} className="mb-4" />)
        }
      }
      // Handle bold text
      else if (trimmed.includes('**')) {
        flushList()
        const parts = trimmed.split(/\*\*/)
        const formattedParts = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
        )
        elements.push(
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {formattedParts}
          </p>
        )
      }
      // Handle regular paragraphs
      else if (trimmed) {
        flushList()
        elements.push(
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {trimmed}
          </p>
        )
      }
    })

    flushList()
    return elements
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Blog
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="prose prose-lg max-w-none">
          {parseContent(content)}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Generated with AI • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}