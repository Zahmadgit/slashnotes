import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tasks: defineTable({
    // define your fields here
    // Note: do NOT declare special fields like `_id` or `_creationTime` here.
    // Convex automatically provides `_id` and `_creationTime` for each row.
    isCompleted: v.boolean(),
    text: v.string()
  })
})
