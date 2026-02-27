export interface StatData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface ShippingOrder {
  id: number;
  order_no?: string;
  initials: string;
  name: string;
  location: string;
  prize: string;
  status: 'pending' | 'reviewing' | 'completed';
  rejection_reason?: string;
  carrier?: string;
  tracking_no?: string;
  ship_date?: string;
  full_name?: string;
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
