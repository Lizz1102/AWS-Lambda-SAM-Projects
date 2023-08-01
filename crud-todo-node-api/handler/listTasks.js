const AWS = require("aws-sdk");

const TASK_TABLE = process.env.TASK_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.listTasks = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };
    const params = {
        TableName: TASK_TABLE,
    };
    try {
        body = await dynamoDb.scan(params).promise();
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
