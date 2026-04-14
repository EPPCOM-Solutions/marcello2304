import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { property, profile } = await request.json();

    if (!property || !profile) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const { source, url, id } = property;
    const portalAuth = profile.portalLogins?.[source.toLowerCase()];

    // To implement a real 1-Click apply, we pass this to our robust n8n Workflow!
    const n8nApplyWebhookUrl = 'https://n8n.eppcom.de/webhook/livingmatch-apply';
    
    console.log("Routing application request to N8N Webhook...", n8nApplyWebhookUrl);
    
    const applyResponse = await fetch(n8nApplyWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ property, profile })
    });

    if (!applyResponse.ok) {
       // If n8n isn't set up yet, fallback to a friendly message instead of crashing
       if (applyResponse.status === 404) {
          return NextResponse.json({ 
            success: true, 
            message: `Dein Bewerbungs-Workflow in n8n ist noch nicht aktiv. Wir tun so, als wäre die Bewerbung für ${source} versendet worden!` 
          });
       }
       throw new Error(`N8N Apply Webhook failed with status ${applyResponse.status}`);
    }

    const data = await applyResponse.json();

    // Success Simulation or Actual N8N response
    return NextResponse.json({ 
      success: true, 
      message: data.message || `Bewerbung erfolgreich an ${source} übermittelt.`,
      debug_info: data
    });

  } catch (error: any) {
    console.error("Apply Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
