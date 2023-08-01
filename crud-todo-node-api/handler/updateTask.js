const AWS = require("aws-sdk");
const TASK_TABLE = process.env.TASK_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.updateTask = async (event, context) => {
    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };
    console.log("Data::", data);
    if (typeof data.task !== "string" || typeof data.checked !== "boolean") {
        console.error("Value of task or done is invalid");
        return;
    }

    const params = {
        TableName: TASK_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            "#task_text": "task",
        },
        ExpressionAttributeValues: {
            ":task": data.task,
            ":checked": data.checked,
            ":updatedAt": datetime,
        },
        UpdateExpression:
            "SET #task_text = :task, checked = :checked, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW",
    };

    try {
        body = await dynamoDb.update(params).promise();
    } catch (error) {
        statusCode = 400;
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body.Attributes);
    }

    return {
        statusCode,
        body,
        headers
    };
};