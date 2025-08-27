"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (description: string, title?: string) => toast({ title, description, variant: "success" }),
    [toast]
  );

  const error = useCallback(
    (description: string, title?: string) => toast({ title, description, variant: "destructive" }),
    [toast]
  );

  const warning = useCallback(
    (description: string, title?: string) => toast({ title, description, variant: "warning" }),
    [toast]
  );

  const info = useCallback(
    (description: string, title?: string) => toast({ title, description, variant: "info" }),
    [toast]
  );

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
    success,
    error,
    warning,
    info,
  };
} 