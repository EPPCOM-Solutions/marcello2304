import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { portal, username, password } = await req.json();
    
    // Simulate real checking delay
    await new Promise(r => setTimeout(r, 1500));

    // Basic validation / mock API logic
    if (password && password.length > 5 && username && username.length > 3) {
      return NextResponse.json({ success: true, message: 'Erfolgreich' });
    } else {
      return NextResponse.json({ success: false, message: 'Fehlgeschlagen' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
