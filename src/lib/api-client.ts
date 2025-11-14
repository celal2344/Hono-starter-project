import { type AppType } from "@api/index"
import { hc } from 'hono/client'

export const client = hc<AppType>("http://localhost:3001/", {
  "init": {
    "credentials": "include",
    "cache": "no-cache"
  },
});

