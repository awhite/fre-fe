import dotenv from 'dotenv'

import App from './App.svelte'
import "./global.css"

dotenv.config()

const app = new App({
  target: document.body
})

export default app
