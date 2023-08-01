const AWS = require("aws-sdk");
const TASK_TABLE = process.env.TASK_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

let body;
let statusCode = 200;
const headers = {
    "Content-Type": "application/json",
};

exports.deleteTask = async (event, context) => {
    const params = {
        TableName: TASK_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };
    await dynamoDb.delete(params).promise();
    body = `Deleted task ${event.pathParameters.id}`;

    return {
        statusCode,
        body,
        headers
    };
};