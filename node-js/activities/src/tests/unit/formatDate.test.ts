import { expect, describe, it } from "@jest/globals"
import { formatDate } from "../../lib/formatDate"

describe("formatDate", () => {
    it("should correctly format string Date object as param", () => {
        const date = new Date("2021-01-01")
        const result = formatDate(date)
        expect(result).toEqual("2021-01-01")
    })

    it("should correctly format raw string date as param", () => {
        const date = "2021-01-01"
        const result = formatDate(date)
        expect(result).toEqual("2021-01-01")
    })

    it("should correctly format Unix timestamp Date object as param", () => {
        const timestamp = new Date(1609459200)
        const result = formatDate(timestamp)
        expect(result).toEqual("1970-01-19")
    })

    it("should correctly format raw Unix timestamp number as param", () => {
        const timestamp = 1609459200
        const result = formatDate(timestamp)
        expect(result).toEqual("1970-01-19")
    })

    it("should correctly format UTC timestamp Date object as param", () => {
        const UTC = new Date("2023-09-21T20:10:02+00:00")
        const result = formatDate(UTC)
        expect(result).toEqual("2023-09-21")
    })

    it("should correctly format raw UTC timestamp number as param", () => {
        const UTC = "2023-09-21T20:10:02+00:00"
        const result = formatDate(UTC)
        expect(result).toEqual("2023-09-21")
    })
})
