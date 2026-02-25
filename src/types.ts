export interface StatData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface ShippingOrder {
  id: number;
  initials: string;
  name: string;
  location: string;
  prize: string;
  status: 'pending' | 'reviewing' | 'completed';
  fullName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

export interface Feedback {
  id: number;
  user: string;
  rating: number;
  comment: string;
  phone?: string;
  date?: string;
}

export interface ProductStat {
  id: number;
  name: string;
  rewarded: number;
  progress: number;
  icon: string;
}
