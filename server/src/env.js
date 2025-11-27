require('dotenv').config()
Object.defineProperty(exports, '__esModule', { value: true })
exports.env = void 0
const zod_1 = require('zod')
const envSchema = zod_1.z.object({
  PORT: zod_1.z.coerce.number().default(3333),
  POSTGRES_URL: zod_1.z.string().url(),
  CORS_ORIGIN: zod_1.z
    .string()
    .default('https://itassetregister.mastertech.local'),
})
exports.env = envSchema.parse(process.env)
