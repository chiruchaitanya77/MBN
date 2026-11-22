// scripts/createAdmin.ts
// Run this with: npx tsx scripts/createAdmin.ts

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(query, resolve);
	});
}

async function createAdmin() {
	try {
		console.log("\n=== MBN Construction Admin User Creator ===\n");

		// Get Supabase credentials
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseServiceKey) {
			console.error("❌ Error: Missing Supabase credentials in .env.local");
			console.log("Required variables:");
			console.log("  - NEXT_PUBLIC_SUPABASE_URL");
			console.log("  - SUPABASE_SERVICE_ROLE_KEY");
			process.exit(1);
		}

		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Get admin details
		const name = await question("Enter admin name: ");
		const email = await question("Enter admin email: ");
		const password = await question("Enter admin password: ");

		if (!name || !email || !password) {
			console.error("❌ Error: All fields are required");
			process.exit(1);
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			console.error("❌ Error: Invalid email format");
			process.exit(1);
		}

		// Validate password
		if (password.length < 8) {
			console.error("❌ Error: Password must be at least 8 characters");
			process.exit(1);
		}

		console.log("\n⏳ Creating admin user...");

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// Insert admin user
		const { data, error } = await supabase
			.from("admin_users")
			.insert({
				name,
				email,
				password_hash: passwordHash,
				role: "admin",
			})
			.select()
			.single();

		if (error) {
			if (error.code === "23505") {
				console.error("❌ Error: An admin with this email already exists");
			} else {
				console.error("❌ Error creating admin:", error.message);
			}
			process.exit(1);
		}

		console.log("\n✅ Admin user created successfully!");
		console.log("\nAdmin Details:");
		console.log(`  ID: ${data.id}`);
		console.log(`  Name: ${data.name}`);
		console.log(`  Email: ${data.email}`);
		console.log(`  Role: ${data.role}`);
		console.log("\nYou can now login at: http://localhost:3000/admin/login\n");

		process.exit(0);
	} catch (error) {
		console.error("❌ Unexpected error:", error);
		process.exit(1);
	} finally {
		rl.close();
	}
}

createAdmin();
