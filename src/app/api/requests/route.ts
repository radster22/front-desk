import { NextResponse } from "next/server";
import { db } from "@/db"; // Import database connection
import { requests } from "@/db/schema"; // Import requests table schema


// Fetch all requests
export async function GET() {
  try {
    const fetchedRequests = await db.select().from(requests);
    return NextResponse.json(fetchedRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

// Create a new request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { submitter, requestTitle, details, phone, requestType, priority, status } = body;

    // Insert request into the database
    const newRequest = await db
      .insert(requests)
      .values({
        name: submitter,
        requestTitle: requestTitle || "", // Set default to empty string if not provided
        details: details || "",           // Set default to empty string if not provided
        phone: phone || "",               // Set default to empty string if not provided
        type: requestType || "service",   // Default to "service" if not provided
        priority: priority || "unassigned", // Default to "unassigned" if not provided
        status: status || "new",          // Default to "new" if not provided
      })
      .$returningId();

    return NextResponse.json({ message: "Request added successfully", request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}
