// src/services/errorHandler.ts
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export function handleApiError(error: unknown, customMessage?: string) {
  console.error("❌ API Error:", error);

  let message = customMessage || "Unexpected error while communicating with the server";

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status) message += ` (Status ${status})`;
    if (data?.message) message += ` - ${data.message}`;
    if (data?.errors) message += ` - ${JSON.stringify(data.errors)}`;

    console.error("📦 Axios error response:", {
      status,
      data,
      url: error.config?.url,
      method: error.config?.method,
    });
  } else if (error instanceof Error) {
    message = customMessage || error.message;
  }

  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}
