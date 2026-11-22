
// src/app/api/admin/auth/me/visitordata.tsx
import { jwtVerify } from "jose";
import {NextRequest, NextResponse} from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("admin_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const { payload } = await jwtVerify(token, SECRET);

		return NextResponse.json({
			user: {
				id: payload.id,
				email: payload.email,
				role: payload.role,
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Invalid token" },
			{ status: 401 }
		);
	}
}

export async function verifyAuth(request: NextRequest) {
	try {
		const token = request.cookies.get("admin_token")?.value;

		if (!token) return null;

		const { payload } = await jwtVerify(token, SECRET);

		return payload; // contains id, email, role, etc.
	} catch {
		return null;
	}
}
