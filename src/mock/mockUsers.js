export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    mobile: "+1 234-567-8900",
    role: "user",
    status: "active",
    createdDate: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?u=john@example.com",
    addresses: [
      {
        id: 1,
        type: "home",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        default: true
      }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    mobile: "+1 234-567-8901",
    role: "user",
    status: "active",
    createdDate: "2024-02-20",
    avatar: "https://i.pravatar.cc/150?u=jane@example.com",
    addresses: []
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    mobile: "+1 234-567-8902",
    role: "admin",
    status: "active",
    createdDate: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=admin@example.com",
    addresses: []
  },
  {
    id: 4,
    name: "Michael Johnson",
    email: "michael@example.com",
    mobile: "+1 234-567-8903",
    role: "user",
    status: "inactive",
    createdDate: "2024-03-10",
    avatar: "https://i.pravatar.cc/150?u=michael@example.com",
    addresses: []
  },
  {
    id: 5,
    name: "Sarah Williams",
    email: "sarah@example.com",
    mobile: "+1 234-567-8904",
    role: "user",
    status: "active",
    createdDate: "2024-03-15",
    avatar: "https://i.pravatar.cc/150?u=sarah@example.com",
    addresses: []
  }
];

export const getCurrentUser = () => {
  return mockUsers[0]; // John Doe as logged-in user
};

export const getUserById = (id) => {
  return mockUsers.find(u => u.id === id);
};

export const getUserByEmail = (email) => {
  return mockUsers.find(u => u.email === email);
};
