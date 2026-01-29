import express, { Request, Response } from "express";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const app = express();
app.use(express.json());

const bedrockClient = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

app.post("/api/quiz", async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body as {
      message: string;
      sessionId?: string;
    };

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_AGENT_ID as string,
      agentAliasId: process.env.BEDROCK_ALIAS_ID as string,
      sessionId: sessionId ?? Date.now().toString(),
      inputText: message,
    });

    const response = await bedrockClient.send(command);

    if (!response.completion) {
      return res
        .status(500)
        .json({ error: "No response from Bedrock agent" });
    }

    let reply = "";

    for await (const event of response.completion) {
      if (event.chunk?.bytes) {
        reply += Buffer.from(event.chunk.bytes).toString("utf-8");
      }
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Bedrock error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate quiz response" });
  }
});

export default app;
