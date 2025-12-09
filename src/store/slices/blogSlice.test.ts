/// <reference types="vitest/globals" />

import reducer, { setTopic, setLanguage, setLLM, setModel } from './blogSlice'

describe('blogSlice', () => {
  it('updates fields', () => {
    console.log('[BlogSlice Test] Starting field update tests...')
    
    const initialState = reducer(undefined, { type: '@@INIT' })
    console.log('[BlogSlice Test] Initial state:', initialState)
    
    const s1 = reducer(initialState, setTopic('X'))
    console.log('[BlogSlice Test] After setTopic:', s1)
    expect(s1.topic).toBe('X')
    
    const s2 = reducer(s1, setLanguage('hindi'))
    console.log('[BlogSlice Test] After setLanguage:', s2)
    expect(s2.language).toBe('hindi')
    
    const s3 = reducer(s2, setLLM('Groq'))
    console.log('[BlogSlice Test] After setLLM:', s3)
    expect(s3.llm).toBe('Groq')
    
    const s4 = reducer(s3, setModel('m'))
    console.log('[BlogSlice Test] After setModel:', s4)
    expect(s4.model).toBe('m')
    
    console.log('[BlogSlice Test] All field update tests passed!')
  })

  it('handles initial state correctly', () => {
    console.log('[BlogSlice Test] Testing initial state...')
    const state = reducer(undefined, { type: '@@INIT' })
    
    console.log('[BlogSlice Test] Initial state values:', state)
    expect(state.topic).toBe('')
    expect(state.language).toBe('english')
    expect(state.llm).toBe('Groq')
    expect(state.model).toBe('llama-3.1-8b-instant')
    expect(state.loading).toBe(false)
    expect(state.error).toBe(null)
    expect(state.blog).toBe(null)
    
    console.log('[BlogSlice Test] Initial state test passed!')
  })
})