export type Doctor = {
  id: number;
  uuid: string;
  name: string;
  email?: string;
  avatar?: string | null;
  image?: string;
  specialty?: string;
  rating?: number;
  bio?: string;
  availability?: string[];
  callTypes?: Array<"phone" | "video" | "text">;
}