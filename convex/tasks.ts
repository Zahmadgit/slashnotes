import { query } from './_generated/server'

const getTasks = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query('tasks').collect()
    return tasks.map((task) => ({ ...task, assigner: 'tom' }))
  }
})

export default getTasks
