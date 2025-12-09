import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export type BlogState = {
  topic: string
  language: string
  llm: string
  model: string
  loading: boolean
  error: string | null
  blog: { title?: string; content?: string } | null
}

const initialState: BlogState = {
  topic: '',
  language: 'english',
  llm: 'Groq',
  model: 'llama-3.1-8b-instant',
  loading: false,
  error: null,
  blog: null
}

export const generateBlog = createAsyncThunk(
  'blog/generate',
  async (_: void, { getState }) => {
    try {
      console.log('[BlogSlice] Starting blog generation...')
      
      const state = getState() as { blog: BlogState }
      console.log('[BlogSlice] Current state:', {
        topic: state.blog.topic,
        language: state.blog.language,
        llm: state.blog.llm,
        model: state.blog.model
      })
      
      const payload = {
        topic: state.blog.topic,
        language: state.blog.language,
        llm: state.blog.llm,
        model: state.blog.model
      }
      
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      console.log(`[BlogSlice] API base URL: ${base}`)
      console.log(`[BlogSlice] Sending payload:`, payload)
      
      const startTime = Date.now()
      const res = await axios.post(`${base}/blogs`, payload)
      const duration = Date.now() - startTime
      
      console.log(`[BlogSlice] Blog generated successfully in ${duration}ms`)
      console.log('[BlogSlice] Response data:', res.data)
      
      return res.data
    } catch (error) {
      console.error('[BlogSlice] Error generating blog:', error)
      if (axios.isAxiosError(error)) {
        console.error('[BlogSlice] Axios error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        })
      }
      throw error
    }
  }
)

const slice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setTopic(state, action) { 
      console.log(`[BlogSlice] setTopic: ${action.payload}`)
      state.topic = action.payload 
    },
    setLanguage(state, action) { 
      console.log(`[BlogSlice] setLanguage: ${action.payload}`)
      state.language = action.payload 
    },
    setLLM(state, action) { 
      console.log(`[BlogSlice] setLLM: ${action.payload}`)
      state.llm = action.payload 
    },
    setModel(state, action) { 
      console.log(`[BlogSlice] setModel: ${action.payload}`)
      state.model = action.payload 
    }
  },
  extraReducers: builder => {
    builder.addCase(generateBlog.pending, state => { 
      console.log('[BlogSlice] Blog generation pending...')
      state.loading = true; 
      state.error = null 
    })
    builder.addCase(generateBlog.fulfilled, (state, action) => {
      console.log('[BlogSlice] Blog generation fulfilled')
      state.loading = false
      const data = action.payload?.data || action.payload
      state.blog = data?.blog || data
      console.log('[BlogSlice] Blog data updated:', state.blog)
    })
    builder.addCase(generateBlog.rejected, (state, action) => {
      console.error('[BlogSlice] Blog generation rejected:', action.error)
      state.loading = false
      state.error = action.error.message || 'Request failed'
      console.error('[BlogSlice] Error set:', state.error)
    })
  }
})

export const { setTopic, setLanguage, setLLM, setModel } = slice.actions
export default slice.reducer
