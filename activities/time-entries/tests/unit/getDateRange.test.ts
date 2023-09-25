import { expect, describe, it } from "@jest/globals"
import { getDateRange } from "../../helpers/getDateRange"

describe("getDateRange", () => {
    const startDate = new Date("2023-09-25")

    it("generates `last seven days` date range", () => {
        const result = getDateRange("last seven days", startDate)
        const expected = "start_date=2023-09-18&end_date=2023-09-25"
        expect(result).toEqual(expected)
    })

    it("generates `last month` date range", () => {
        const result = getDateRange("last month", startDate)
        const expected = "start_date=2023-08-25&end_date=2023-09-25"
        expect(result).toEqual(expected)
    })

    it("generates `last six months` date range", () => {
        const result = getDateRange("last six months", startDate)
        const expected = "start_date=2023-03-25&end_date=2023-09-25"
        expect(result).toEqual(expected)
    })

    it("generates `last year` date range", () => {
        const result = getDateRange("last year", startDate)
        const expected = "start_date=2022-09-25&end_date=2023-09-25"
        expect(result).toEqual(expected)
    })
})
