import { toast } from "@/components/ui/use-toast";

export function handleApiError(error: any, customMessage?: string) {
  console.error("❌ API Error:", error);

  const message =
    customMessage ||
    (error instanceof Error
      ? error.message
      : "Unexpected error while communicating with the server");

  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}
