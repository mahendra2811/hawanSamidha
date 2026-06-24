"use client";

import { useEffect, useState } from "react";
import { Download, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallButton() {
  const t = useTranslations("Install");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const id = requestAnimationFrame(() => {
      if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    });
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      cancelAnimationFrame(id);
    };
  }, []);

  if (installed) {
    return (
      <p className="inline-flex items-center gap-2 text-success">
        <Check size={18} aria-hidden /> {t("installed")}
      </p>
    );
  }

  if (!deferred) {
    return <p className="text-sm text-text-muted">{t("unavailable")}</p>;
  }

  return (
    <Button
      size="lg"
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
    >
      <Download size={18} aria-hidden /> {t("installButton")}
    </Button>
  );
}
