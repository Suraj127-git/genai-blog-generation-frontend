import { useDispatch, useSelector } from 'react-redux'
import { generateBlog } from '../store/slices/blogSlice'
import type { RootState, AppDispatch } from '../store'

export default function GenerateButton() {
  const dispatch = useDispatch<AppDispatch>()
  const loading = useSelector((s: RootState) => s.blog.loading)
  const topic = useSelector((s: RootState) => s.blog.topic)
  const disabled = loading || !topic
  
  const handleGenerate = () => {
    console.log('[GenerateButton] Generate button clicked')
    console.log('[GenerateButton] Topic:', topic)
    console.log('[GenerateButton] Loading:', loading)
    
    if (!disabled) {
      console.log('[GenerateButton] Dispatching generateBlog action')
      dispatch(generateBlog())
    } else {
      console.log('[GenerateButton] Button disabled - topic empty or loading')
    }
  }
  
  return (
    <button
      className="w-full p-3 rounded bg-indigo-600 text-white disabled:opacity-50"
      disabled={disabled}
      onClick={handleGenerate}
    >
      {loading ? 'Generating...' : 'Generate Blog'}
    </button>
  )
}
