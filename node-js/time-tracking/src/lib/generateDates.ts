interface IDateRange {
   start: string
   end: string
   year: string
}

type TPeriod = "week" | "fortnight" | "month" | "year"

const generateDates = (): Record<TPeriod, IDateRange> => {
   const now = new Date()
   const end = now.toISOString()
   const week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
   const fortnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14)
   const month = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
   const year = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

   return {
      week: {
         start: week.toISOString(),
         end: end,
         year: now.getFullYear().toString(),
      },
      fortnight: {
         start: fortnight.toISOString(),
         end: end,
         year: now.getFullYear().toString(),
      },
      month: {
         start: month.toISOString(),
         end: end,
         year: now.getFullYear().toString(),
      },
      year: {
         start: year.toISOString(),
         end: end,
         year: (now.getFullYear() - 1).toString(), // Previous year
      },
   }
}

export { generateDates, TPeriod }
