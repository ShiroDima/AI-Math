"use server"

import AWS from "aws-sdk";
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.COGNITO_REGION
})

export const login = async (input) => {
    console.log('This server action has fired!')
    const cognito = new AWS.CognitoIdentityServiceProvider()
    return await cognito.initiateAuth(input).promise();
}