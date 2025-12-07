// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // Import from your auth.ts file
export const { GET, POST } = handlers;
