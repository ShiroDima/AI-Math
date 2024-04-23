import AWS from "aws-sdk";
import { NextApiRequest } from "next";

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.COGNITO_REGION,
});

export const dynamic = 'force-dynamic'

async function handler(req) {
	console.log("####################################################");
    console.log(req?.body)
	// const cognito = new AWS.CognitoIdentityServiceProvider()
	// let response =  await cognito.initiateAuth(input).promise();
	let response = {
		username: "guest",
		password: "@Gilgsmesh01",
	};

	return Response.json({ status: "OK", response });
}

export {handler as GET, handler as POST}
