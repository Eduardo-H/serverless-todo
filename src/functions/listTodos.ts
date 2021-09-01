import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document.scan({
    TableName: "users_todos",
    FilterExpression: "user_id = :id",
    ExpressionAttributeValues: {
      ":id": user_id
    }
  }).promise();

  const todos = response.Items;

  if (todos.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "No todo was found"
    })
  }
}