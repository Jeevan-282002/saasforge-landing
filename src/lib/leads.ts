import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type UserRole =
  | 'Founder'
  | 'Django Developer'
  | 'Software Agency'
  | 'Freelancer'
  | 'Other';

export type ProjectType =
  | 'SaaS Application'
  | 'Multi-Tenant Application'
  | 'Client Project'
  | 'Internal Business Application'
  | 'Other';

export type ProjectTimeline =
  | 'Immediately'
  | 'Within 1 Month'
  | 'Within 3 Months'
  | 'Just Exploring';

export interface LeadSubmission {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  role: UserRole;
  projectType: ProjectType;
  timeline: ProjectTimeline;
  requirements?: string;
}

export interface LeadRecord extends LeadSubmission {
  id: string;
  submittedAt: string;
  clientIp?: string;
  userAgent?: string;
  forwardedToWebhook?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitizedData?: LeadSubmission;
}

// Allowed enum choices
export const VALID_ROLES: UserRole[] = [
  'Founder',
  'Django Developer',
  'Software Agency',
  'Freelancer',
  'Other',
];

export const VALID_PROJECT_TYPES: ProjectType[] = [
  'SaaS Application',
  'Multi-Tenant Application',
  'Client Project',
  'Internal Business Application',
  'Other',
];

export const VALID_TIMELINES: ProjectTimeline[] = [
  'Immediately',
  'Within 1 Month',
  'Within 3 Months',
  'Just Exploring',
];

/**
 * Strips HTML tags and dangerous characters from user input
 */
export function sanitizeString(val: unknown, maxLength = 255): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '') // strip brackets to prevent HTML/XSS injection
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and normalizes Indian mobile phone numbers
 * Accepts 10 digits starting with 6, 7, 8, or 9
 * Supports prefixes like +91, 91, or leading 0, plus spaces and hyphens
 */
export function validateAndNormalizeIndianPhone(phoneInput: unknown): { valid: boolean; normalized: string } {
  if (typeof phoneInput !== 'string') {
    return { valid: false, normalized: '' };
  }

  // Remove spaces, hyphens, brackets, plus signs
  const digitsOnly = phoneInput.replace(/[\s\-\(\)\+]/g, '');

  let tenDigit = '';
  if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
    tenDigit = digitsOnly;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0') && /^[6-9]/.test(digitsOnly.slice(1))) {
    tenDigit = digitsOnly.slice(1);
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^[6-9]/.test(digitsOnly.slice(2))) {
    tenDigit = digitsOnly.slice(2);
  }

  if (tenDigit) {
    return { valid: true, normalized: `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}` };
  }

  return { valid: false, normalized: '' };
}

/**
 * Validates standard work/personal email format
 */
export function validateEmail(emailInput: unknown): boolean {
  if (typeof emailInput !== 'string') return false;
  const trimmed = emailInput.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // RFC 5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates incoming lead payload and returns structured sanitized output
 */
export function validateLead(raw: any): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Full Name
  const fullName = sanitizeString(raw?.fullName, 100);
  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Please enter your full name (minimum 2 characters).';
  }

  // 2. Email Address
  const rawEmail = typeof raw?.email === 'string' ? raw.email.trim().toLowerCase() : '';
  if (!rawEmail) {
    errors.email = 'Work email is required.';
  } else if (!validateEmail(rawEmail)) {
    errors.email = 'Please provide a valid work email address.';
  }

  // 3. Phone Number (Indian mobile format)
  const rawPhone = typeof raw?.phone === 'string' ? raw.phone.trim() : '';
  const phoneValidation = validateAndNormalizeIndianPhone(rawPhone);
  if (!rawPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!phoneValidation.valid) {
    errors.phone = 'Please provide a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).';
  }

  // 4. Company (Optional)
  const company = sanitizeString(raw?.company, 120);

  // 5. Role
  const rawRole = typeof raw?.role === 'string' ? raw.role.trim() as UserRole : 'Founder';
  const role: UserRole = VALID_ROLES.includes(rawRole) ? rawRole : 'Other';

  // 6. What are you planning to build?
  const rawProject = typeof raw?.projectType === 'string' ? raw.projectType.trim() as ProjectType : 'SaaS Application';
  const projectType: ProjectType = VALID_PROJECT_TYPES.includes(rawProject) ? rawProject : 'SaaS Application';

  // 7. Expected Project Timeline
  const rawTimeline = typeof raw?.timeline === 'string' ? raw.timeline.trim() as ProjectTimeline : 'Within 1 Month';
  const timeline: ProjectTimeline = VALID_TIMELINES.includes(rawTimeline) ? rawTimeline : 'Within 1 Month';

  // 8. Additional Requirements (Optional)
  const requirements = sanitizeString(raw?.requirements, 2000);

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitizedData: {
      fullName,
      email: rawEmail,
      phone: phoneValidation.normalized,
      company: company || undefined,
      role,
      projectType,
      timeline,
      requirements: requirements || undefined,
    },
  };
}

// In-Memory Rate Limiter (Sliding Window per IP)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Honeypot spam detection
export function isHoneypotTriggered(raw: any): boolean {
  if (!raw) return false;
  const honeypot = raw.website_url_hp || raw.honeypot || raw.company_url_hp;
  return typeof honeypot === 'string' && honeypot.trim().length > 0;
}

// Duplicate submission buffer (5 minutes per email)
const recentSubmissions = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function isRecentDuplicate(email: string): boolean {
  const now = Date.now();
  const lastTime = recentSubmissions.get(email.toLowerCase());
  if (lastTime && now - lastTime < DUPLICATE_WINDOW_MS) {
    return true;
  }
  recentSubmissions.set(email.toLowerCase(), now);
  return false;
}

/**
 * Persists lead to local storage and asynchronously dispatches to configured webhook
 */
export async function saveLead(
  lead: LeadSubmission,
  clientIp?: string,
  userAgent?: string
): Promise<LeadRecord> {
  const record: LeadRecord = {
    id: `lead_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    submittedAt: new Date().toISOString(),
    clientIp,
    userAgent,
    ...lead,
  };

  // 1. Ensure storage directory exists
  const storageDir = process.env.LEADS_STORAGE_DIR || path.resolve(process.cwd(), 'data');
  try {
    await fs.promises.mkdir(storageDir, { recursive: true });
    
    // Append to leads.jsonl (append-only log for reliability)
    const jsonlPath = path.join(storageDir, 'leads.jsonl');
    await fs.promises.appendFile(jsonlPath, JSON.stringify(record) + '\n', 'utf8');

    // Also update readable leads.json summary
    const jsonSummaryPath = path.join(storageDir, 'leads.json');
    let existingList: LeadRecord[] = [];
    try {
      const fileData = await fs.promises.readFile(jsonSummaryPath, 'utf8');
      existingList = JSON.parse(fileData);
      if (!Array.isArray(existingList)) existingList = [];
    } catch {
      existingList = [];
    }
    existingList.unshift(record); // newest first
    // keep at most latest 500 leads in the readable summary
    if (existingList.length > 500) existingList = existingList.slice(0, 500);
    await fs.promises.writeFile(jsonSummaryPath, JSON.stringify(existingList, null, 2), 'utf8');
  } catch (err) {
    console.error('[Lead Storage Warning] Could not write to local disk:', err);
    // Continue so webhook or user response is not broken
  }

  // 2. Dispatch to optional external webhook (Google Sheets / CRM / Zapier / Slack)
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SaaSForge-LeadEngine/1.0',
        },
        body: JSON.stringify({
          id: record.id,
          submittedAt: record.submittedAt,
          fullName: record.fullName,
          email: record.email,
          phone: record.phone,
          company: record.company || '',
          role: record.role,
          projectType: record.projectType,
          timeline: record.timeline,
          requirements: record.requirements || '',
          source: 'SaaSForge Early Access Modal',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      record.forwardedToWebhook = resp.ok;
    } catch (webhookErr) {
      console.warn('[Webhook Sync Notice] External webhook sync deferred or timed out:', webhookErr);
      record.forwardedToWebhook = false;
    }
  }

  return record;
}

