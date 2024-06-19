import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import Joi from "joi"
import { buildHttpResponse } from "./buildHttpResponse"
import { ITimeEntry } from "./getTimeEntries"
const isoDateTimeFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

const schema = Joi.array().items({
   activity_start_end: Joi.string().required(),
   year: Joi.string().required(),
   start: Joi.string().pattern(isoDateTimeFormat).required(),
   end: Joi.string().pattern(isoDateTimeFormat).required(),
   activity_type: Joi.string().valid("Chore", "Project", "Blogging", "Study").required(),
   duration: Joi.number().precision(2),
   description: Joi.string(),
})

const addTimeEntries = async (client: DynamoDBClient, items: ITimeEntry[]) => {
   const { error } = schema.validate(items)
   if (error) {
      console.error("Problem with request body:", items)
      return buildHttpResponse(400, error?.details)
   } else {
      try {
         const documentClient = DynamoDBDocumentClient.from(client)
         const putRequests = items.map((item: ITimeEntry) => ({
            PutRequest: {
               Item: item,
            },
         }))

         const params = {
            RequestItems: {
               ["TimeEntries"]: putRequests,
            },
         }

         await documentClient.send(new BatchWriteCommand(params))
         return buildHttpResponse(200, `${items?.length} items added to TimeEntries table`)
      } catch (err) {
         return buildHttpResponse(400, `Items could not be added to TimeEntries table: ${err} `)
      }
   }
}

export { addTimeEntries }