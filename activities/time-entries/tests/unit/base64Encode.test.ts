import { base64Encode } from "../../helpers/base64Encode"
import { expect, describe, it } from "@jest/globals"

describe("base64encode", () => {
    it("encodes a string to base64", () => {
        const input = "doodedoo:api_token"
        const result = base64Encode(input)
        expect(result).toEqual("ZG9vZGVkb286YXBpX3Rva2Vu")
    })
})
