const AWS = require("aws-sdk");
const TASK_TABLE = process.env.TASK_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.getTask = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: TASK_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };
    try {
        body = await dynamoDb.get(params).promise();
    } catch (error) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};