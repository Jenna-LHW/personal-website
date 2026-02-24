// netlify/functions/send-email.js
// Serverless function — runs on Netlify's backend (never exposes your API key)

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, subject, message } = body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "All fields are required." }),
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RESEND API CALL
  // Set RESEND_API_KEY as an environment variable in Netlify:
  //   Site Settings → Environment Variables → Add variable
  // ──────────────────────────────────────────────────────────────────────────
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server misconfiguration." }),
    };
  }

  const payload = {
    // ⚠️  "from" must be a domain you've verified in Resend.
    //     Until you verify a domain, use Resend's sandbox address:
    //     onboarding@resend.dev  (sends only to the account owner's email)
    from: "Portfolio Contact <onboarding@resend.dev>",

    // Where you want to receive the contact form emails
    to: ["staceyjenna.lhw@gmail.com"],

    reply_to: email, // clicking "Reply" in your inbox goes back to the sender

    subject: `[Portfolio] ${subject}`,

    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#141414">
        <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="margin:0;color:white;font-size:1.3rem">New message from your portfolio</h2>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e8e8e4;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0ed;font-size:0.82rem;color:#a0a0a0;text-transform:uppercase;letter-spacing:0.06em;width:80px">From</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0ed;font-weight:600">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0ed;font-size:0.82rem;color:#a0a0a0;text-transform:uppercase;letter-spacing:0.06em">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0ed"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0ed;font-size:0.82rem;color:#a0a0a0;text-transform:uppercase;letter-spacing:0.06em">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0ed">${subject}</td>
            </tr>
          </table>
          <div style="margin-top:24px">
            <div style="font-size:0.82rem;color:#a0a0a0;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px">Message</div>
            <div style="background:#fafafa;border-left:3px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;font-size:0.95rem;line-height:1.7;white-space:pre-wrap">${message}</div>
          </div>
        </div>
        <p style="text-align:center;font-size:0.75rem;color:#a0a0a0;margin-top:16px">Sent from jenna-personal-website.netlify.app</p>
      </div>
    `,
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || "Failed to send email." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};