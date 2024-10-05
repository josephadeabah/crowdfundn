// user.types.ts
export type Role = {
  id: number;
  name: string;
  description?: string | null;
};

export type User = {
  id: number;
  email: string;
  admin: boolean | null;
  full_name: string;
  roles: Role[];
};
