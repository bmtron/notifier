export const API_ENDPOINT_URL_DEBUG = 'https://notifierapi.bmtron.io' //'http://localhost:8008'
export const API_ENDPOINT_URL_PROD = 'http://192.168.50.71:8008'

const API_KEY = import.meta.env.VITE_API_KEY as string

if (!API_KEY) {
  throw new Error('VITE_API_KEY environment variable is not set')
}

export { API_KEY }
