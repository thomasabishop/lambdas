import { expect, describe, it } from "@jest/globals"
import { validateDateRange } from "../../helpers/validateDateRange"

describe("validateDateRange", () => {
    it("should return the date range passed as argument if it is valid", () => {
        const dateRange = "month"
        const result = validateDateRange(dateRange)
        expect(result).toEqual(dateRange)
    })

    it("error handling", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()
        const invalidDateRange = "two_years"
        const result = validateDateRange(invalidDateRange)
        expect(result).toEqual(undefined)
        expect(consoleSpy).toHaveBeenCalledWith("Invalid date range provided")
        consoleSpy.mockRestore()
    })
})
