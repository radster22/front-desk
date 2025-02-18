import { NextResponse } from "next/server";
import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq, count as countFn } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Fetching request with ID:", id);

    // Fetch the request details with user email
    const fetchedRequest = await db
      .select()
      .from(requests)
      .leftJoin(users, eq(users.name, requests.name)) // Join based on the name field
      .where(eq(requests.id, Number(id)));

    if (fetchedRequest.length === 0 || !fetchedRequest[0].requests) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Extract user name from request (Ensure it's valid)
    const userName = fetchedRequest[0].requests.name;
    if (!userName) {
      return NextResponse.json({
        requests: fetchedRequest[0].requests,
        users: fetchedRequest[0].users || null,
        requestCount: 0, // If no username, assume 0 requests
      });
    }

    // Fetch total number of requests submitted by this user
    const requestCountResult = await db
      .select({ totalRequests: countFn() }) // Alias count() as 'totalRequests'
      .from(requests)
      .where(eq(requests.name, userName));

    const requestCount = requestCountResult[0]?.totalRequests || 0;

    return NextResponse.json({
      requests: fetchedRequest[0].requests, // Request details
      users: fetchedRequest[0].users || null, // User details (if available)
      requestCount, // Total requests by this user
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ error: "Failed to fetch request" }, { status: 500 });
  }
}
