export type Category = {
  id: number;
  name: string;
  image?: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  images: string[];
  category?: Category;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};
