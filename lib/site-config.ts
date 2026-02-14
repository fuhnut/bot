
import { useState, useEffect } from 'react';

export interface SiteConfig {
  botName: string;
  botLogo: string;
  favicon: string;
  tagline: string;
  inviteLink: string;
}

const defaultConfig: SiteConfig = {
  botName: process.env.NEXT_PUBLIC_BOT_NAME || "Eris Bot",
  botLogo: process.env.NEXT_PUBLIC_BOT_LOGO || "",
  favicon: process.env.NEXT_PUBLIC_FAVICON || "/favicon.png",
  tagline: process.env.NEXT_PUBLIC_BOT_TAGLINE || "Systematically does it all",
  inviteLink: process.env.NEXT_PUBLIC_BOT_INVITE_LINK || "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID"
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/siteconfig.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data && typeof data === 'object') {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load site config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading };
}
