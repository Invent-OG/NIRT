import type { APIRoute } from "astro";
import { createBiginContact, getZohoConfig } from "../../lib/zoho-bigin";

export const prerender = false;

// Simple in-memory rate limiter for serverless environment
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const windowMs = 10 * 60 * 1000; // 10 minutes
	const maxRequests = 10;

	// Periodic cleanup of expired entries
	if (rateLimitMap.size > 200) {
		for (const [key, entry] of rateLimitMap.entries()) {
			if (entry.expiresAt < now) {
				rateLimitMap.delete(key);
			}
		}
	}

	const existing = rateLimitMap.get(ip);
	if (!existing || existing.expiresAt < now) {
		rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
		return false;
	}

	if (existing.count >= maxRequests) {
		return true;
	}

	existing.count += 1;
	return false;
}

/**
 * Standardized JSON response helper
 */
function jsonResponse(data: { success: boolean; message?: string; error?: string }, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store, no-cache, must-revalidate",
		},
	});
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	try {
		// 1. Rate limiting by IP
		const ip = clientAddress || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
		if (isRateLimited(ip)) {
			return jsonResponse(
				{
					success: false,
					error: "Too many submission attempts. Please wait a few minutes before trying again.",
				},
				429
			);
		}

		// 2. Parse request payload (supports JSON or Form-Data)
		let body: Record<string, any> = {};
		const contentType = request.headers.get("content-type") || "";

		if (contentType.includes("application/json")) {
			try {
				body = await request.json();
			} catch {
				return jsonResponse({ success: false, error: "Invalid JSON payload" }, 400);
			}
		} else if (contentType.includes("form") || contentType.includes("multipart")) {
			const formData = await request.formData();
			body = Object.fromEntries(formData.entries());
		} else {
			try {
				body = await request.json();
			} catch {
				return jsonResponse({ success: false, error: "Unsupported Content-Type" }, 400);
			}
		}

		// 3. Honeypot check for spam bots
		const honeypot = body.company_hp || body.website || body.fax;
		if (honeypot && String(honeypot).trim().length > 0) {
			// Silently drop bot submission
			return jsonResponse({
				success: true,
				message: "Thank you for your enquiry.",
			});
		}

		// 4. Extract and sanitize inputs
		const name = String(body.name || "").trim().slice(0, 100);
		const rawMobile = String(body.contact || body.phone || body.mobile || "").trim();
		const district = String(body.district || "").trim().slice(0, 80);
		const bill = String(body.bill || body.monthly_bill || "").trim().slice(0, 80);
		const email = body.email ? String(body.email).trim().toLowerCase().slice(0, 120) : undefined;
		const source = String(body.source || "website").trim().slice(0, 50);

		// 5. Server-side validation
		if (!name || name.length < 2) {
			return jsonResponse({ success: false, error: "Please enter your full name." }, 400);
		}

		// Clean mobile number (strip +91, 0 prefix, spaces, dashes)
		const cleanedMobile = rawMobile.replace(/^(\+91|91|0)/, "").replace(/[\s\-]/g, "");
		const indianMobileRegex = /^[6-9]\d{9}$/;
		if (!indianMobileRegex.test(cleanedMobile)) {
			return jsonResponse(
				{
					success: false,
					error: "Please enter a valid 10-digit Indian mobile number.",
				},
				400
			);
		}

		if (!district) {
			return jsonResponse({ success: false, error: "Please select your district." }, 400);
		}

		if (!bill) {
			return jsonResponse(
				{
					success: false,
					error: "Please select your average monthly electricity bill.",
				},
				400
			);
		}

		if (email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return jsonResponse({ success: false, error: "Please enter a valid email address." }, 400);
			}
		}

		// 6. Check Zoho Bigin environment configuration
		const config = getZohoConfig();
		if (!config.isConfigured) {
			console.error("[Zoho Bigin] Credentials missing in environment variables.");
			return jsonResponse(
				{
					success: false,
					error: "CRM integration is currently being initialized. Please call +91 96550 46464 directly for an instant solar estimate.",
				},
				503
			);
		}

		// 7. Create Contact in Zoho Bigin CRM
		const result = await createBiginContact({
			name,
			contact: cleanedMobile,
			district,
			bill,
			email,
			source,
		});

		if (!result.success) {
			console.error("[Zoho Bigin] Failed to create Contact:", result.error);
			return jsonResponse(
				{
					success: false,
					error: "We could not submit your request to our system right now. Please try again or reach out at +91 96550 46464.",
				},
				502
			);
		}

		// 8. Return success
		return jsonResponse({
			success: true,
			message: "Thank you! Your solar assessment enquiry has been registered with NIRT.",
		});
	} catch (error: any) {
		console.error("[API Estimate Error]", error?.message || error);
		return jsonResponse(
			{
				success: false,
				error: "An unexpected error occurred while processing your request. Please try again or call +91 96550 46464.",
			},
			500
		);
	}
};

export const ALL: APIRoute = async () => {
	return jsonResponse({ success: false, error: "Method not allowed. Use POST." }, 405);
};

