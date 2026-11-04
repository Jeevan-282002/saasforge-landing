import type { APIRoute } from 'astro';
import {
  validateLead,
  saveLead,
  isRateLimited,
  isHoneypotTriggered,
  isRecentDuplicate,
} from '../../lib/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. Verify content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request format. Content-Type must be application/json.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Parse payload safely
    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Malformed JSON payload.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Honeypot check: reject bots silently
    if (isHoneypotTriggered(body)) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Submission received.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Rate Limiting by IP
    const clientIp =
      clientAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Too many requests from your IP address. Please wait a few minutes before submitting another request.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Validation and Sanitization
    const validation = validateLead(body);
    if (!validation.valid || !validation.sanitizedData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please fix the validation errors below.',
          fieldErrors: validation.errors,
        }),
        {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Duplicate check (prevent accidental rapid clicks)
    if (isRecentDuplicate(validation.sanitizedData.email)) {
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Thank you! We have already received your early access request. Our team will review your requirements and get in touch with you shortly.",
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 7. Store lead submission
    const userAgent = request.headers.get('user-agent') || '';
    const record = await saveLead(validation.sanitizedData, clientIp, userAgent);

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Thank you for your interest in SaaSForge! We've received your early access request. Our team will review your requirements and get in touch with you shortly.",
        leadId: record.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[API /api/early-access Exception]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          'A server error occurred while processing your request. Please try again or reach out to our team.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
