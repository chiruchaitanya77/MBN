// src/app/api/admin/auth/logout/visitordata.tsx
// Create this in a separate file
import {NextResponse} from "next/server";


export async function POST() {
	const response = NextResponse.json({ success: true });

	response.cookies.delete("admin_token");

	return response;
}
