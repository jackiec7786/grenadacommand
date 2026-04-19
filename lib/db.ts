import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'

let _sql: NeonQueryFunction<false, true> | null = null

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  if (!_sql) {
    _sql = neon(process.env.POSTGRES_URL!, { fullResults: true })
  }
  return _sql(strings, ...values)
}

export { sql }
