import { hc } from 'hono/client'
import type { AppType } from '@api/index'

export const client = hc<AppType>("http://localhost:3001/", {
  "init": {
    "credentials": "include",
    "cache": "no-cache"
  },
});

