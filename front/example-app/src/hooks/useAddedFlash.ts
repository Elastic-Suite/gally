import { useCallback, useEffect, useRef, useState } from 'react';

// The cart badge lives in the header, which is far from — and while the ACP is
// open, behind — the button you just clicked. So every add-to-cart button
// confirms itself in place: it holds a success state for a moment and the
// surrounding card flashes green. This hook is only that timer, shared so the
// autocomplete, the product grid and the product detail page all confirm for
// the same duration instead of each inventing one.
export const ADDED_FLASH_MS = 1600;

export function useAddedFlash(duration: number = ADDED_FLASH_MS) {
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Without this, adding then navigating away leaves the timeout to fire into
  // an unmounted component.
  useEffect(() => () => clearTimeout(timer.current), []);

  // Re-adding the same product restarts the confirmation rather than letting
  // the first timeout cut it short.
  const flash = useCallback((key: string) => {
    setAddedKey(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAddedKey(null), duration);
  }, [duration]);

  return { addedKey, flash };
}
