const base64Encode = (input: string): string => Buffer.from(input, "utf-8").toString("base64")

export { base64Encode }
