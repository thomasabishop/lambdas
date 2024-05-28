import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Pool } from "mysql2/promise"
import Joi from "joi"
import { buildHttpResponse } from "./buildHttpResponse"

const sqlDatetimeFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

const schema = Joi.array().items({
   activity_type: Joi.string().valid("Project", "Blogging", "Study").required(),
   start: Joi.string().pattern(sqlDatetimeFormat).required(),
   end: Joi.string().pattern(sqlDatetimeFormat).required(),
   duration: Joi.number().precision(2), // Joi converts to number, enforces decimal value
   description: Joi.string(),
})

const addEntries = async (
   event: APIGatewayProxyEvent,
   pool?: Pool,
): Promise<APIGatewayProxyResult> => {
   try {
      const body = event.body ? JSON.parse(event?.body) : {}
      const { error } = schema.validate(body)
      if (error) {
         console.error("Problem with request body:", body)
         return buildHttpResponse(400, error?.details)
      } else {
         return buildHttpResponse(200, body)
      }
   } catch (err) {
      console.error("Error adding entries to database: ", err)
      return buildHttpResponse(500, "Error adding entries to database.")
   }
}

export { addEntries }
