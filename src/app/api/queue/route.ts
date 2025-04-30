import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

// Define the types for request body
interface QueueRequest {
  messages: (string | Record<string, any>)[];
}

// Extend CloudflareEnv to include QUEUE_BINDING
declare global {
  interface CloudflareEnv {
    QUEUE_BINDING?: Queue;
  }
}

/**
 * POST handler for enqueueing messages to a Cloudflare Queue
 *
 * Request body format:
 * {
 *   messages: string[] | object[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = (await request.json()) as QueueRequest;
    const { messages } = body;

    // Validate inputs
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Provide messages array." },
        { status: 400 }
      );
    }

    // Get queue from Cloudflare binding
    const ctx = getRequestContext();
    const queue = ctx.env.QUEUE_BINDING;

    if (!queue) {
      return NextResponse.json(
        { error: "Queue not found or not properly bound" },
        { status: 404 }
      );
    }

    // Prepare message batch
    const messageBatch = messages.map((message) => ({
      body: typeof message === "string" ? message : JSON.stringify(message),
    }));

    // Send messages to the queue
    await queue.sendBatch(messageBatch);

    // Return result
    return NextResponse.json({
      success: true,
      messagesSent: messageBatch.length,
    });
  } catch (error: unknown) {
    console.error("Error enqueueing messages:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to enqueue messages", details: errorMessage },
      { status: 500 }
    );
  }
}
