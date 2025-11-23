const HELPER_BASE = process.env.HELPER_BASE || "/opt/";
const Response = require(HELPER_BASE + 'response');
const Redirect = require(HELPER_BASE + 'redirect');

const { BedrockRuntimeClient, ConverseStreamCommand } = require("@aws-sdk/client-bedrock-runtime");
const client = new BedrockRuntimeClient({ region: "ap-northeast-1" });

exports.handler = awslambda.streamifyResponse(async (event, responseStream, context) => {
    responseStream.on('close', () => {
        console.log('Client disconnected.');
    });

    const command = new ConverseStreamCommand({
        modelId: "jp.anthropic.claude-sonnet-4-5-20250929-v1:0",
        messages: [{
            role: "user",
            content: [{
                text: "自分の名前をツンデレ風に答えて"
            }]
        }]
    });

    const response = await client.send(command);
    console.log(response);

    responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });

    for await (const chunk of response.stream) {
        console.log(chunk);
        responseStream.write(JSON.stringify(chunk) + '\n');
    }

    responseStream.end();
});