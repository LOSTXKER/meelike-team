// Mock data for Employers (V2 Marketplace)

export interface Employer {
  id: string;
  userId: string;
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export const mockEmployers: Employer[] = [
  {
    id: 'emp-1',
    userId: 'user-emp-1',
    name: 'John Marketing',
    email: 'john@example.com',
    companyName: 'Digital Agency Co.',
    phone: '0812345678',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'emp-2',
    userId: 'user-emp-2',
    name: 'Sarah Business',
    email: 'sarah@example.com',
    companyName: 'Social Boost Inc.',
    phone: '0898765432',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'emp-3',
    userId: 'user-emp-3',
    name: 'Mike Influencer',
    email: 'mike@example.com',
    phone: '0856789012',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    createdAt: new Date('2024-03-01'),
  },
];

export const mockEmployer = mockEmployers[0];
