'use client';

import { useEffect, useRef } from 'react';

export interface UseChatKeysOptions {
  onEscCancel: () => void;
  onToggleToolDetails: () => void;
}

/**
 * Keyboard shortcuts shared across all chat instances.
 * Ctrl/Cmd+O: toggle tool detail panel
 * Escape: cancel in-flight response
 *
 * Uses refs internally so the effect never needs to re-register.
 */
export function useChatKeys({ onEscCancel, onToggleToolDetails }: UseChatKeysOptions) {
  const escRef = useRef(onEscCancel);
  const toggleRef = useRef(onToggleToolDetails);
  escRef.current = onEscCancel;
  toggleRef.current = onToggleToolDetails;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        toggleRef.current();
        return;
      }
      if (e.key === 'Escape') {
        escRef.current();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
