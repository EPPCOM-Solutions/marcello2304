export type SearchIntent = 'rent' | 'buy' | 'investment';

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number; // Purchase price or Kaltmiete
  livingSpace: number;
  rooms: number;
  imageUrl: string;
  source: 'ImmoScout24' | 'Immowelt' | 'Kleinanzeigen';
  // For investment logic
  estimatedRent?: number; // Yearly cold rent estimation if buy
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  income: number;
  householdSize: number;
  hasPets: boolean;
  applicationText: string;
}

export interface SearchSettings {
  intent: SearchIntent;
  location: string;
  maxPrice: number;
  minRooms: number;
  minSpace: number;
  radius: number;
}
