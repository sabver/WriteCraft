// Load .env.local before any test module is imported
import * as dotenv from 'dotenv'
import * as fs from 'fs'

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local', override: true })
} else {
  dotenv.config()
}
