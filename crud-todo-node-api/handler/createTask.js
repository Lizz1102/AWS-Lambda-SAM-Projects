const AWS = require("aws-sdk");

const TASK_TABLE = process.env.TASK_TABLE;
const dynamoDb = new AWS.dynamoDB.DocumentClient();
const uuid = require("uuid");

exports.createTask = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: TASK_TABLE,
        Item: {
            id: uuid.v1(),
            task: data.task,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    if (typeof data.task !== "string") {
        console.error("Validation Failed");
        return;
    }

    try {
        body = await dynamoDb.put((params)).promise();
    } catch (err) {
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