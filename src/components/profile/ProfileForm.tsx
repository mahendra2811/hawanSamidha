"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProfile } from "@/store/profile";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ProfileForm() {
  const t = useTranslations("Profile");
  const profile = useProfile();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  // Fill from the persisted profile once it has hydrated.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setName(profile.name);
      setMobile(profile.mobile);
      setEmail(profile.email);
    });
    return () => cancelAnimationFrame(id);
  }, [profile.hasHydrated, profile.name, profile.mobile, profile.email]);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    profile.save({ name: name.trim(), mobile: mobile.trim(), email: email.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  return (
    <form onSubmit={onSave} className="space-y-3">
      <div>
        <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-text">
          {t("name")}
        </label>
        <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="profile-mobile" className="mb-1 block text-sm font-medium text-text">
          {t("mobile")}
        </label>
        <Input
          id="profile-mobile"
          type="tel"
          inputMode="numeric"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="profile-email" className="mb-1 block text-sm font-medium text-text">
          {t("email")}
        </label>
        <Input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" size="md" variant={saved ? "secondary" : "primary"}>
        {saved ? (
          <>
            <Check size={16} aria-hidden /> {t("saved")}
          </>
        ) : (
          t("save")
        )}
      </Button>
    </form>
  );
}
