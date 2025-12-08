# AI Blog Generator Frontend

Production-ready React frontend application with TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Production Optimized** with nginx serving
- **Railway.com Ready** with proper deployment configuration

## Prerequisites

- Node.js 18+ and npm 9+
- Railway account for deployment

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## Railway Deployment

### Quick Deploy

1. **Login to Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize project:**
   ```bash
   railway init
   ```

3. **Set environment variables:**
   ```bash
   railway variables set VITE_API_BASE_URL=https://your-backend.railway.app
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Manual Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t ai-blog-frontend .
   ```

2. **Run locally:**
   ```bash
   docker run -p 80:80 \
     -e VITE_API_BASE_URL=https://your-backend.railway.app \
     ai-blog-frontend
   ```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | ✅ | Backend API URL | `http://localhost:8000` |
| `NODE_ENV` | ❌ | Environment mode | `production` |
| `PORT` | ❌ | Port to serve on | `80` |

## Docker Configuration

The application uses a multi-stage Docker build:

1. **Builder stage:** Builds the React application
2. **Production stage:** Serves static files with nginx

Features:
- Multi-stage build for smaller image size
- Nginx with optimized configuration
- Security headers
- Gzip compression
- Health checks
- Non-root user for security

## Production Optimizations

- **Code splitting** with manual chunks
- **Tree shaking** for unused code removal
- **Minification** with Terser
- **Gzip compression** via nginx
- **Cache headers** for static assets
- **Security headers** configured

## Health Checks

The application includes health checks at `/health` endpoint for Railway monitoring.

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run type-check`
- Verify environment variables are set

### Deployment Issues
- Check Railway logs: `railway logs`
- Verify backend URL is accessible
- Ensure health endpoint is responding

## Support

For issues:
1. Check Railway logs
2. Verify environment variables
3. Test locally with production build
4. Check browser console for errors