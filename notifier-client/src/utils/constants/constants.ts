export const API_ENDPOINT_URL_DEBUG = 'http://localhost:8008'

const API_KEY = import.meta.env.VITE_API_KEY as string

if (!API_KEY) {
  throw new Error('VITE_API_KEY environment variable is not set')
}

export { API_KEY }
