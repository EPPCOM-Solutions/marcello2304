import { NextResponse } from 'next/server';
import { Property, UserProfile } from '../../../types/property';

export async function POST(request: Request) {
  try {
    const { properties, profile } = await request.json() as { properties: Property[], profile: UserProfile };

    if (!properties || !profile) {
      return NextResponse.json({ error: 'Missing properties or profile' }, { status: 400 });
    }

    // AI Evaluation logic (simulated for MVP)
    // Normally, this would pass the context to an LLM or n8n workflow
    const evaluatedProperties = properties.map(property => {
      let score = 50; // Base score

      // 1. Check Income constraint (Rent should ideally be < 30% of net income)
      if (property.price > 0 && profile.income > 0) {
        const ratio = property.price / profile.income;
        if (ratio < 0.3) score += 30;
        else if (ratio < 0.4) score += 10;
        else if (ratio > 0.5) score -= 20; // Probably too expensive
      }

      // 2. Space / Persons check (ideally min 20sqm per person)
      if (property.livingSpace) {
        if (property.livingSpace / profile.householdSize >= 20) {
          score += 20;
        } else {
          score -= 10;
        }
      }

      // Random small jitter to simulate complex AI factors
      score += Math.floor(Math.random() * 10) - 5;

      // Bound score between 0 and 100
      score = Math.max(0, Math.min(100, score));

      return {
        ...property,
        priorityScore: score
      };
    });

    // Sort by priority before returning
    evaluatedProperties.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

    return NextResponse.json({ properties: evaluatedProperties });
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
