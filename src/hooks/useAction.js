import { useCallback } from 'react';
import { useToast } from '../context/ToastContext.jsx';

// Mutation chalata hai, error par toast dikhata hai.
// Success par { data } return karta hai, fail par null.
export function useAction() {
  const toast = useToast();
  return useCallback(
    async (fn, successMessage) => {
      try {
        const data = await fn();
        if (successMessage) toast(successMessage);
        return { data };
      } catch (e) {
        toast(e.message, 'error');
        return null;
      }
    },
    [toast]
  );
}
