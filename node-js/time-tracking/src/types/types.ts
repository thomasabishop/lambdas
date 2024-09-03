interface ITimeEntry {
   duration: number
   activity_start_end: string
   year: string
   activity_type: string
   start: string
   description: string
   end: string
}

interface IDailyCount {
   date: string
   count: number
}

export { ITimeEntry, IDailyCount }
