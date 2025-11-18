import { hc } from 'hono/client'
import type { AppType } from '@api/index'
import { env } from '@/env'

export const client = hc<AppType>(env.VITE_API_URL, {
  "init": {
    "credentials": "include"
  },
});

