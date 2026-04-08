"use client";
import { useState, useEffect } from "react";

interface ScanGateProps {
  sessionId: string;
  children: (canScan: boolean, scansLeft: number, isPremium: boolean) => React.ReactNode;
}

export default function ScanGate({ sessionId, children }: ScanGateProps) {
  const [scansLeft, setScansLeft] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/subscription?sessionId=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setIsPremium(data.plan === "premium");
        setScansLeft(data.scansLeft);
        setLoaded(true);
      });
  }, [sessionId]);

  if (!loaded) return null;
  return <>{children(scansLeft > 0 || isPremium, scansLeft, isPremium)}</>;
}