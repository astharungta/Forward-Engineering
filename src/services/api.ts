const API_BASE_URL = 'http://localhost:5000/api';

export interface Warranty {
  id: number;
  customerName: string;
  vehicleModel: string;
  registrationNumber: string;
  planType: string;
  purchaseDate: string;
  expiryDate: string;
  amount: number;
  status: string;
}

export interface WarrantyStats {
  activeWarranties: number;
  expiringCount: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export const warrantyApi = {
  getAll: async (): Promise<Warranty[]> => {
    const response = await fetch(`${API_BASE_URL}/warranty`);
    if (!response.ok) throw new Error('Failed to fetch warranties');
    return response.json();
  },

  getById: async (id: number): Promise<Warranty> => {
    const response = await fetch(`${API_BASE_URL}/warranty/${id}`);
    if (!response.ok) throw new Error('Failed to fetch warranty');
    return response.json();
  },

  create: async (data: Omit<Warranty, 'id' | 'purchaseDate' | 'expiryDate' | 'status'>): Promise<Warranty> => {
    const response = await fetch(`${API_BASE_URL}/warranty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create warranty');
    return response.json();
  },

  getExpiring: async (): Promise<Warranty[]> => {
    const response = await fetch(`${API_BASE_URL}/warranty/expiring`);
    if (!response.ok) throw new Error('Failed to fetch expiring warranties');
    return response.json();
  },

  getStats: async (): Promise<WarrantyStats> => {
    const response = await fetch(`${API_BASE_URL}/warranty/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};
