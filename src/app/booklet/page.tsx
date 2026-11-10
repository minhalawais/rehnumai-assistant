"use client";

import { useEffect, useState } from "react";
import { BookletHome } from "@/components/booklet-home";
import { IntakeEntryModal } from "@/components/intake-entry-modal";
import { hasPublicIntakeSubmitted } from "@/lib/public-intake-storage";

export default function BookletPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setModalOpen(!hasPublicIntakeSubmitted());
      setReady(true);
    });
  }, []);

  return (
    <>
      <BookletHome />
      {ready && modalOpen && (
        <IntakeEntryModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
