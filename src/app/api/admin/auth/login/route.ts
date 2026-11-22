// src/app/api/admin/auth/login/visitordata.tsx
"use server"

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getSupabaseServiceClient } from "@/lib/supabaseServer";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || "your-secret-key-change-this"
);

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password required" },
				{ status: 400 }
			);
		}

		const supabase = getSupabaseServiceClient();

		// Get admin user
		const { data: admin, error } = await supabase
			.from("admin_users")
			.select("*")
			.eq("email", email)
			.single();

		if (error || !admin) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, admin.password_hash);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Create JWT token
		const token = await new SignJWT({
			id: admin.id,
			email: admin.email,
			role: admin.role,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("24h")
			.sign(SECRET);

		const response = NextResponse.json({
			success: true,
			user: {
				id: admin.id,
				email: admin.email,
				name: admin.name,
				role: admin.role,
			},
		});

		// Set cookie
		response.cookies.set("admin_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24, // 24 hours
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
