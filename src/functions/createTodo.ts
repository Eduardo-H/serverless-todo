import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { document } from "../utils/dynamodbClient";
import * as dayjs from "dayjs";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  try {
    await document.put({
      TableName: "users_todos",
      Item: {
        id: uuid(),
        user_id,
        done: false,
        title,
        deadline: dayjs(deadline).format('DD/MM/YYYY')
      }
    }).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to create todo",
        error: `Error: ${err}`
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo successfully created"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}