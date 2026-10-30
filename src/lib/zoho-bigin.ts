/**
 * Zoho Bigin CRM Integration Helper
 * 
 * Manages OAuth 2.0 token refresh, field metadata inspection, and
 * creating Contact records in Zoho Bigin via the Bigin v2 API.
 * 
 * Strict Constraint: Does NOT use any database or local storage.
 */

export interface LeadSubmission {
	name: string;
	contact: string;
	district: string;
	bill: string;
	email?: string;
	source?: string;
}

export interface ZohoContactResult {
	success: boolean;
	contactId?: string;
	message?: string;
	error?: string;
}

interface CachedToken {
	accessToken: string;
	expiresAt: number; // timestamp in ms
}

let tokenCache: CachedToken | null = null;
let cachedFields: Set<string> | null = null;
let lastFieldFetchTime = 0;

/**
 * Returns trimmed environment variable or undefined
 */
function getEnv(key: string): string | undefined {
	const val = process.env[key];
	return val ? val.trim() : undefined;
}

/**
 * Resolves the Zoho Accounts and API endpoints based on data-centre configuration.
 * Defaults to Zoho India (.in) data centre as specified.
 */
export function getZohoConfig() {
	const clientId = getEnv("ZOHO_CLIENT_ID");
	const clientSecret = getEnv("ZOHO_CLIENT_SECRET");
	const refreshToken = getEnv("ZOHO_REFRESH_TOKEN");
	const accountsUrl = getEnv("ZOHO_ACCOUNTS_URL") || "https://accounts.zoho.in";
	const apiUrl = (getEnv("ZOHO_API_URL") || "https://www.zohoapis.in/bigin/v2").replace(/\/+$/, "");

	return {
		clientId,
		clientSecret,
		refreshToken,
		accountsUrl: accountsUrl.replace(/\/+$/, ""),
		apiUrl,
		isConfigured: Boolean(clientId && clientSecret && refreshToken),
	};
}

/**
 * Obtains a fresh or cached Zoho access token using OAuth 2.0 Refresh Token grant.
 */
export async function getZohoAccessToken(): Promise<string> {
	const config = getZohoConfig();

	if (!config.clientId || !config.clientSecret || !config.refreshToken) {
		throw new Error(
			"Zoho Bigin configuration is incomplete. Missing ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, or ZOHO_REFRESH_TOKEN."
		);
	}

	// Reuse valid cached access token (with a 2-minute safety buffer)
	if (tokenCache && tokenCache.expiresAt > Date.now() + 120_000) {
		return tokenCache.accessToken;
	}

	const tokenUrl = `${config.accountsUrl}/oauth/v2/token`;
	const params = new URLSearchParams({
		refresh_token: config.refreshToken,
		client_id: config.clientId,
		client_secret: config.clientSecret,
		grant_type: "refresh_token",
	});

	const response = await fetch(tokenUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params.toString(),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Zoho Accounts returned HTTP ${response.status}: ${errorText.slice(0, 150)}`);
	}

	const data = (await response.json()) as {
		access_token?: string;
		expires_in?: number;
		expires_in_sec?: number;
		error?: string;
	};

	if (data.error || !data.access_token) {
		throw new Error(`Zoho OAuth token refresh failed: ${data.error || "No access_token returned"}`);
	}

	const expiresIn = data.expires_in || data.expires_in_sec || 3600;
	tokenCache = {
		accessToken: data.access_token,
		expiresAt: Date.now() + expiresIn * 1000,
	};

	return tokenCache.accessToken;
}

/**
 * Splits a full name string into First_Name and Last_Name.
 * Note: Last_Name is strictly mandatory in Zoho Bigin Contacts.
 */
export function splitName(fullName: string): { firstName: string; lastName: string } {
	const trimmed = fullName.trim().replace(/\s+/g, " ");
	const parts = trimmed.split(" ");

	if (parts.length === 1) {
		return {
			firstName: "",
			lastName: parts[0] || "Customer",
		};
	}

	const lastName = parts.pop() || "Customer";
	const firstName = parts.join(" ");

	return { firstName, lastName };
}

/**
 * Inspects field metadata from Bigin to discover existing custom field API names.
 * Caches results for 1 hour. Gracefully falls back if settings scope is unavailable.
 */
async function getContactFieldApiNames(accessToken: string, apiUrl: string): Promise<Set<string>> {
	const oneHour = 60 * 60 * 1000;
	if (cachedFields && Date.now() - lastFieldFetchTime < oneHour) {
		return cachedFields;
	}

	try {
		const res = await fetch(`${apiUrl}/settings/fields?module=Contacts`, {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
			},
		});

		if (res.ok) {
			const json = (await res.json()) as { fields?: Array<{ api_name?: string }> };
			if (Array.isArray(json.fields)) {
				const set = new Set<string>();
				for (const field of json.fields) {
					if (field.api_name) {
						set.add(field.api_name);
					}
				}
				cachedFields = set;
				lastFieldFetchTime = Date.now();
				return set;
			}
		}
	} catch {
		// Ignore metadata fetch errors (e.g. token lacks settings scope); standard fields are always used.
	}

	return new Set<string>();
}

/**
 * Creates a Contact record in Zoho Bigin with the submitted lead information.
 */
export async function createBiginContact(lead: LeadSubmission): Promise<ZohoContactResult> {
	const config = getZohoConfig();
	const accessToken = await getZohoAccessToken();
	const { firstName, lastName } = splitName(lead.name);

	// Standard fields supported by all Zoho Bigin Contacts instances
	const contactData: Record<string, any> = {
		First_Name: firstName,
		Last_Name: lastName,
		Mobile: lead.contact,
		Lead_Source: "Website",
		Mailing_City: lead.district,
		Description: [
			"Solar Rooftop Assessment Enquiry",
			`Full Name: ${lead.name}`,
			`Mobile: ${lead.contact}`,
			`District: ${lead.district}`,
			`Monthly Electricity Bill: ${lead.bill}`,
			lead.email ? `Email: ${lead.email}` : null,
			`Lead Source: ${lead.source || "Website"}`,
			`Submission Timestamp: ${new Date().toISOString()}`,
		]
			.filter(Boolean)
			.join("\n"),
	};

	if (lead.email) {
		contactData.Email = lead.email;
	}

	// Verify if custom fields exist in user's Bigin account to avoid rejection
	const knownFields = await getContactFieldApiNames(accessToken, config.apiUrl);

	// Check common custom field API names if they actually exist in Bigin schema
	if (knownFields.has("District")) {
		contactData.District = lead.district;
	}
	if (knownFields.has("Monthly_Electricity_Bill")) {
		contactData.Monthly_Electricity_Bill = lead.bill;
	} else if (knownFields.has("Monthly_Bill")) {
		contactData.Monthly_Bill = lead.bill;
	}

	const endpoint = `${config.apiUrl}/Contacts`;

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Zoho-oauthtoken ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ data: [contactData] }),
	});

	const responseText = await response.text();
	let json: any;
	try {
		json = JSON.parse(responseText);
	} catch {
		return {
			success: false,
			error: `Zoho Bigin returned invalid response (HTTP ${response.status})`,
		};
	}

	if (!response.ok) {
		const message = json?.message || json?.error || `HTTP ${response.status}`;
		return {
			success: false,
			error: `Zoho Bigin API Error: ${message}`,
		};
	}

	// Zoho v2 response format: { data: [ { code: "SUCCESS", status: "success", details: { id: "..." } } ] }
	const record = json?.data?.[0];

	if (record && (record.status === "success" || record.code === "SUCCESS")) {
		return {
			success: true,
			contactId: record.details?.id,
			message: record.message || "Contact successfully created in Zoho Bigin",
		};
	}

	const recordError = record?.message || json?.message || "Failed to create Contact in Zoho Bigin";
	const recordCode = record?.code || json?.code || "BIGIN_REJECTED";

	return {
		success: false,
		error: `${recordCode}: ${recordError}`,
	};
}

