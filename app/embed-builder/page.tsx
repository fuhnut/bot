"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteConfig } from "@/lib/site-config";
import { formatTime } from "@/lib/utils";
import {
  Upload, Copy, Check, Hash, Hammer, FileText, User, Image,
  LayoutList, MousePointer2, Palette, MessageSquare, Layout,
  UserCircle, Trash2, XCircle, MoreHorizontal, Info, Plus, X, Eye
} from "lucide-react";

const Icons = {
  Upload, Copy, Check, Hash, Hammer, FileText, User, Image,
  LayoutList, MousePointer2, Palette, MessageSquare, Layout,
  UserCircle, Trash2, XCircle, MoreHorizontal, Info, Plus, X, Eye
};

import DiscordEmbed from "@/app/components/DiscordEmbed";
import { Embed } from "@/lib/interfaces";
import BotTag from "@/app/components/BotTag";

interface ButtonData {
  label: string;
  style: string;
  url: string;
  emoji: string;
  row: number;
  disabled: boolean;
}

interface FieldData {
  name: string;
  value: string;
  inline: boolean;
}

interface EmbedData {
  content: string;
  color: string;
  url: string;
  title: string;
  description: string;
  authorName: string;
  authorIcon: string;
  authorUrl: string;
  thumbnailUrl: string;
  imageUrl: string;
  footerText: string;
  footerIcon: string;
  timestamp: boolean;
  deleteAfter: string;
  buttons: ButtonData[];
  fields: FieldData[];
}

export default function EmbedBuilder() {
  const [isDark, setIsDark] = useState(true);
  const { config: siteConfig } = useSiteConfig();
  const [botInfo, setBotInfo] = useState({ name: siteConfig.botName, avatar: siteConfig.botLogo });
  const [copied, setCopied] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importScript, setImportScript] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    if (trimmed === 'None' || trimmed === 'null' || trimmed === 'undefined') return false;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  };

  const [embedData, setEmbedData] = useState<EmbedData>({
    content: "",
    color: "#5865F2",
    url: "",
    title: "",
    description: "",
    authorName: "",
    authorIcon: "",
    authorUrl: "",
    thumbnailUrl: "",
    imageUrl: "",
    footerText: "",
    footerIcon: "",
    timestamp: false,
    deleteAfter: "",
    buttons: [],
    fields: [],
  });
  const [buttonsEnabled, setButtonsEnabled] = useState(true);
  const [generatedScript, setGeneratedScript] = useState("");

  useEffect(() => {
    setBotInfo({
      name: siteConfig.botName,
      avatar: siteConfig.botLogo,
    });
  }, [siteConfig.botName, siteConfig.botLogo]);

  const generateScript = useCallback(() => {
    const parts: string[] = []

    if (embedData.content) {
      parts.push(`$v{content: ${embedData.content.replace(/\n/g, "\\n")}}`)
    }

    parts.push("$v{embed}")

    if (embedData.color) parts.push(`$v{color: ${embedData.color}}`)
    if (embedData.title) parts.push(`$v{title: ${embedData.title.replace(/\n/g, "\\n")}}`)
    if (embedData.description) parts.push(`$v{description: ${embedData.description.replace(/\n/g, "\\n")}}`)
    if (embedData.timestamp) parts.push("$v{timestamp}")
    if (embedData.authorName) parts.push(`$v{author: name: ${embedData.authorName.replace(/\n/g, "\\n")} && icon: ${embedData.authorIcon || ""}}`)
    if (embedData.thumbnailUrl) parts.push(`$v{thumbnail: ${embedData.thumbnailUrl}}`)
    if (embedData.imageUrl) parts.push(`$v{image: ${embedData.imageUrl}}`)
    if (embedData.footerText) parts.push(`$v{footer: text: ${embedData.footerText.replace(/\n/g, "\\n")} && icon: ${embedData.footerIcon || ""}}`)

    if (embedData.fields && embedData.fields.length > 0) {
      embedData.fields.forEach((field) => {
        if (field.name || field.value) {
          parts.push(`$v{field: name: ${field.name.replace(/\n/g, "\\n")} && value: ${field.value.replace(/\n/g, "\\n")} && inline: ${field.inline}}`)
        }
      })
    }

    if (embedData.buttons && embedData.buttons.length > 0) {
      parts.push("$v{buttons}")
      if (!buttonsEnabled) parts.push("$v{buttons_disabled}")
      embedData.buttons.forEach((button) => {
        const buttonParts: string[] = []
        if (button.label) buttonParts.push(`label=${button.label.replace(/\n/g, "\\n")}`)
        if (button.style) buttonParts.push(`style=${button.style}`)
        if (button.style === 'link' && button.url) buttonParts.push(`url=${button.url}`)
        if (button.emoji) buttonParts.push(`emoji=${button.emoji}`)
        if (button.row !== undefined) buttonParts.push(`row=${button.row}`)
        if (button.disabled) buttonParts.push(`disabled=${button.disabled}`)

        if (buttonParts.length > 0) {
          parts.push(`$v{button: ${buttonParts.join(" && ")}}`)
        }
      })
    }

    const script = parts.join("")
    setGeneratedScript(script)
  }, [embedData, buttonsEnabled])

  useEffect(() => {
    generateScript()
  }, [generateScript])

  const characterCount = useMemo(() => {
    let totalChars = 0;
    if (embedData.content) totalChars += embedData.content.length;
    if (embedData.title) totalChars += embedData.title.length;
    if (embedData.description) totalChars += embedData.description.length;
    if (embedData.authorName) totalChars += embedData.authorName.length;
    if (embedData.footerText) totalChars += embedData.footerText.length;
    embedData.fields.forEach(field => {
      totalChars += (field.name || '').length;
      totalChars += (field.value || '').length;
    });
    return totalChars;
  }, [embedData]);

  const isOverLimit = useMemo(() => characterCount > 6000, [characterCount]);

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addField = () => {
    setEmbedData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: "", value: "", inline: true }]
    }));
  };

  const removeField = (index: number) => {
    setEmbedData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const updateField = (index: number, key: keyof FieldData, value: string | boolean) => {
    setEmbedData(prev => {
      const newFields = [...prev.fields];
      newFields[index] = { ...newFields[index], [key]: value as any };
      return { ...prev, fields: newFields };
    });
  };

  const addButton = () => {
    setEmbedData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { label: "Button", style: "secondary", url: "", emoji: "", row: 0, disabled: false }]
    }));
  };

  const removeButton = (index: number) => {
    setEmbedData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const updateButton = (index: number, key: keyof ButtonData, value: any) => {
    setEmbedData(prev => {
      const newButtons = [...prev.buttons];
      newButtons[index] = { ...newButtons[index], [key]: value };
      return { ...prev, buttons: newButtons };
    });
  };

  const parseImportedScript = (script: string) => {
    const contentMatch = script.match(/\{content:\s*([^}]+)\}/);
    const colorMatch = script.match(/\{color:\s*([^}]+)\}/);
    const titleMatch = script.match(/\{title:\s*([^}]+)\}/);
    const descMatch = script.match(/\{description:\s*([^}]+)\}/);
    const authorMatch = script.match(/\{author:\s*name:\s*([^&]+)&&\s*icon:\s*([^}]+)\}/);
    const thumbMatch = script.match(/\{thumbnail:\s*([^}]+)\}/);
    const imageMatch = script.match(/\{image:\s*([^}]+)\}/);
    const footerMatch = script.match(/\{footer:\s*text:\s*([^&]+)&&\s*icon:\s*([^}]+)\}/);

    const fields: FieldData[] = [];
    const fieldPattern = /\{field:\s*name:\s*([^&]+)&&\s*value:\s*([^&]+)&&\s*inline:\s*(true|false)\}/g;
    let fieldMatch;
    while ((fieldMatch = fieldPattern.exec(script)) !== null) {
      fields.push({
        name: fieldMatch[1].trim().replace(/\\n/g, '\n'),
        value: fieldMatch[2].trim().replace(/\\n/g, '\n'),
        inline: fieldMatch[3] === 'true'
      });
    }

    const buttons: ButtonData[] = [];
    if (script.includes("{buttons}")) {
      const buttonPattern = /\{button:\s*([^}]+)\}/g;
      let buttonMatch;
      while ((buttonMatch = buttonPattern.exec(script)) !== null) {
        const buttonStr = buttonMatch[1];
        const button: ButtonData = { label: "", style: "secondary", url: "", emoji: "", row: 0, disabled: false };
        const properties = buttonStr.split("&&");
        properties.forEach((prop) => {
          const [key, value] = prop.split("=").map((s) => s.trim());
          if (key === "label") button.label = value.replace(/\\n/g, '\n');
          else if (key === "style") button.style = value;
          else if (key === "url") button.url = value;
          else if (key === "emoji") button.emoji = value;
          else if (key === "row") button.row = parseInt(value) || 0;
          else if (key === "disabled") button.disabled = value === "true";
        });
        if (button.label) buttons.push(button);
      }
    }

    setButtonsEnabled(!script.includes("{buttons_disabled}"));
    setEmbedData({
      content: contentMatch ? contentMatch[1].trim().replace(/\\n/g, '\n') : "",
      color: colorMatch ? colorMatch[1].trim() : "#5865F2",
      url: "",
      title: titleMatch ? titleMatch[1].trim().replace(/\\n/g, '\n') : "",
      description: descMatch ? descMatch[1].trim().replace(/\\n/g, '\n') : "",
      authorName: authorMatch ? authorMatch[1].trim().replace(/\\n/g, '\n') : "",
      authorIcon: authorMatch ? authorMatch[2].trim() : "",
      authorUrl: "",
      thumbnailUrl: thumbMatch ? thumbMatch[1].trim() : "",
      imageUrl: imageMatch ? imageMatch[1].trim() : "",
      footerText: footerMatch ? footerMatch[1].trim().replace(/\\n/g, '\n') : "",
      footerIcon: footerMatch ? footerMatch[2].trim() : "",
      timestamp: script.includes("{timestamp}"),
      deleteAfter: "",
      buttons: buttons,
      fields: fields,
    });
    setShowImportModal(false);
    setImportScript("");
  };

  const hasEmbed = useMemo(() => Boolean(
    embedData.title ||
    embedData.description ||
    embedData.authorName ||
    embedData.thumbnailUrl ||
    embedData.imageUrl ||
    embedData.footerText
  ), [embedData.title, embedData.description, embedData.authorName, embedData.thumbnailUrl, embedData.imageUrl, embedData.footerText]);

  const mapButtonStyle = (style: string) => {
    switch (style?.toLowerCase()) {
      case 'primary':
      case 'blurple':
        return 'primary';
      case 'success':
      case 'green':
        return 'success';
      case 'danger':
      case 'red':
      case 'error':
        return 'danger';
      case 'link':
        return 'link';
      default:
        return 'secondary';
    }
  };

  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "content", label: "Content", icon: Icons.FileText },
    { id: "author", label: "Author", icon: Icons.User },
    { id: "media", label: "Media", icon: Icons.Image },
    { id: "fields", label: "Fields", icon: Icons.LayoutList },
    { id: "buttons", label: "Buttons", icon: Icons.MousePointer2 },
    { id: "styling", label: "Styling", icon: Icons.Palette },
  ];

  const WindowControls = () => (
    <div className="flex gap-1.5 mb-2">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#5865F2]/30">
      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-2xl">
            <Icons.Hammer className="w-8 h-8 text-white/80" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Embed Builder</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8 items-start">
          {/* Left Side - Preview & Usage */}
          <div className="space-y-6 sticky top-6">
            <div className="bg-[#111111] rounded-[2rem] border border-white/10 p-5 shadow-2xl ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#5865F2]/10 rounded-lg">
                    <Icons.Eye className="w-3.5 h-3.5 text-[#5865F2]" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-white/50">Live Preview</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Live</span>
                </div>
              </div>

              {/* Discord Preview Window */}
              <div className="bg-[#313338] rounded-2xl p-5 min-h-[350px] shadow-inner relative overflow-hidden ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-5 px-1 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-white/5" />
                      <div className="w-2 h-2 rounded-full bg-white/5" />
                      <div className="w-2 h-2 rounded-full bg-white/5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-white/20 text-[9px] uppercase font-black tracking-widest ml-3 bg-white/5 px-2.5 py-1 rounded-full">
                      <Icons.Hash className="w-2.5 h-2.5" /> preview
                    </div>
                  </div>
                  <Icons.MoreHorizontal className="w-4 h-4 text-white/10" />
                </div>

                <div className="flex gap-3">
                  <img src={botInfo.avatar} className="w-9 h-9 rounded-full shrink-0 shadow-xl" alt="avatar" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-[14px] text-white hover:underline cursor-pointer">{botInfo.name}</span>
                      <BotTag />
                      <span className="text-[10px] text-white/20 ml-1 font-medium">{formatTime(new Date())}</span>
                    </div>
                    {embedData.content ? (
                      <div className="text-[#dbdee1] text-[0.875rem] leading-[1.3] mb-2 whitespace-pre-wrap">{embedData.content}</div>
                    ) : (
                      <div className="text-white/5 text-[13px] italic mb-2 select-none">Enter message content on the right...</div>
                    )}
                    <AnimatePresence mode="popLayout">
                      {hasEmbed && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="max-w-full"
                        >
                          <DiscordEmbed embed={{
                            title: embedData.title,
                            description: embedData.description,
                            url: embedData.url,
                            color: embedData.color,
                            timestamp: embedData.timestamp,
                            author: {
                              name: embedData.authorName,
                              url: embedData.authorUrl,
                              iconUrl: embedData.authorIcon
                            },
                            thumbnail: embedData.thumbnailUrl,
                            image: embedData.imageUrl,
                            footer: {
                              text: embedData.footerText,
                              iconUrl: embedData.footerIcon
                            },
                            fields: embedData.fields,
                            buttons: buttonsEnabled ? embedData.buttons : []
                          }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Card */}
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Icons.Info className="w-16 h-16 rotate-12" />
              </div>
              <div className="flex items-center gap-2 text-white/30">
                <Icons.Info className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Guide</span>
              </div>
              <ol className="space-y-3 relative z-10">
                {[
                  "Configure settings in labels on right",
                  "Watch your changes sync instantly here",
                  "Copy the generated code when ready",
                  `Use ,ce 'code' in Discord with ${botInfo.name}`
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-[11px] text-white/30 leading-tight">
                    <span className="text-[#5865F2] font-black">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Side - Tabbed Settings */}
          <div className="space-y-6">
            <div className="bg-[#111111] border border-white/5 rounded-xl p-1.5 flex gap-1 overflow-x-auto no-scrollbar shadow-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-black transition-all text-[10px] uppercase tracking-wider whitespace-nowrap ${activeTab === tab.id
                    ? "bg-[#5865F2] text-white shadow-[0_4px_12px_rgba(88,101,242,0.4)]"
                    : "text-white/30 hover:text-white/50"
                    }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 min-h-[450px] shadow-2xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {activeTab === "content" && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5 text-white/30">
                          <Icons.MessageSquare className="w-4 h-4" />
                          <h2 className="font-black uppercase tracking-[0.2em] text-[9px]">Message Content</h2>
                        </div>
                        <textarea
                          placeholder="Your message content here..."
                          className="w-full h-28 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 text-xs focus:border-[#5865F2]/50 outline-none transition-all resize-none font-medium text-white/90"
                          value={embedData.content}
                          onChange={(e) => setEmbedData({ ...embedData, content: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "styling" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Title</label>
                          <input
                            type="text"
                            placeholder="Embed Title"
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                            value={embedData.title}
                            onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Accent Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-white/5 cursor-pointer p-1"
                              value={embedData.color}
                              onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                            />
                            <input
                              type="text"
                              className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs font-mono uppercase focus:border-[#5865F2]/50 outline-none transition-all"
                              value={embedData.color}
                              onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Description</label>
                        <textarea
                          placeholder="Embed Description"
                          className="w-full h-28 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 text-xs focus:border-[#5865F2]/50 outline-none transition-all resize-none"
                          value={embedData.description}
                          onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Support URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                          value={embedData.url}
                          onChange={(e) => setEmbedData({ ...embedData, url: e.target.value })}
                        />
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-md accent-[#5865F2]"
                            checked={embedData.timestamp}
                            onChange={(e) => setEmbedData({ ...embedData, timestamp: e.target.checked })}
                          />
                          <span className="font-black uppercase tracking-widest text-[10px] text-white/40">Include Timestamp</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-md accent-[#5865F2]"
                            checked={buttonsEnabled}
                            onChange={(e) => setButtonsEnabled(e.target.checked)}
                          />
                          <span className="font-black uppercase tracking-widest text-[10px] text-white/40">Enable Buttons</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {activeTab === "author" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Author Name</label>
                          <input
                            type="text"
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                            value={embedData.authorName}
                            onChange={(e) => setEmbedData({ ...embedData, authorName: e.target.value })}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2.5">
                            <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Author Icon URL</label>
                            <input
                              type="text"
                              className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                              value={embedData.authorIcon}
                              onChange={(e) => setEmbedData({ ...embedData, authorIcon: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2.5">
                            <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Author Link</label>
                            <input
                              type="text"
                              className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                              value={embedData.authorUrl}
                              onChange={(e) => setEmbedData({ ...embedData, authorUrl: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "media" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Thumbnail URL</label>
                          <input
                            type="text"
                            placeholder="Small image top-right"
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                            value={embedData.thumbnailUrl}
                            onChange={(e) => setEmbedData({ ...embedData, thumbnailUrl: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Large Image URL</label>
                          <input
                            type="text"
                            placeholder="Bottom focus image"
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                            value={embedData.imageUrl}
                            onChange={(e) => setEmbedData({ ...embedData, imageUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "footer" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Footer Text</label>
                          <input
                            type="text"
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                            value={embedData.footerText}
                            onChange={(e) => setEmbedData({ ...embedData, footerText: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="font-black uppercase tracking-[0.2em] text-[9px] text-white/30 ml-1">Footer Icon URL</label>
                          <input
                            type="text"
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-3.5 text-xs focus:border-[#5865F2]/50 outline-none transition-all"
                            value={embedData.footerIcon}
                            onChange={(e) => setEmbedData({ ...embedData, footerIcon: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "fields" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="space-y-4">
                        {embedData.fields.map((field, index) => (
                          <div key={index} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative group/field">
                            <button
                              onClick={() => removeField(index)}
                              className="absolute top-4 right-4 text-white/10 hover:text-red-400 transition-colors"
                            >
                              <Icons.X className="w-4 h-4" />
                            </button>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <label className="font-black uppercase tracking-[0.2em] text-[8px] text-white/20">Name</label>
                                <input
                                  type="text"
                                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-xs focus:border-[#5865F2]/30 outline-none"
                                  value={field.name}
                                  onChange={(e) => updateField(index, "name", e.target.value)}
                                />
                              </div>
                              <div className="flex items-end pb-1.5">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded-md accent-[#5865F2]"
                                    checked={field.inline}
                                    onChange={(e) => updateField(index, "inline", e.target.checked)}
                                  />
                                  <span className="font-black uppercase tracking-widest text-[8px] text-white/20">Inline</span>
                                </label>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="font-black uppercase tracking-[0.2em] text-[8px] text-white/20">Value</label>
                              <textarea
                                className="w-full h-20 bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-xs focus:border-[#5865F2]/30 outline-none resize-none"
                                value={field.value}
                                onChange={(e) => updateField(index, "value", e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addField}
                          className="w-full py-3.5 border border-dashed border-white/10 rounded-2xl text-white/30 hover:text-white/60 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add Field
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "buttons" && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="space-y-4">
                        {embedData.buttons.map((btn, index) => (
                          <div key={index} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative group/btn">
                            <button
                              onClick={() => removeButton(index)}
                              className="absolute top-4 right-4 text-white/10 hover:text-red-400 transition-colors"
                            >
                              <Icons.X className="w-4 h-4" />
                            </button>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="font-black uppercase tracking-[0.2em] text-[8px] text-white/20">Label</label>
                                <input
                                  type="text"
                                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-xs"
                                  value={btn.label}
                                  onChange={(e) => updateButton(index, "label", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="font-black uppercase tracking-[0.2em] text-[8px] text-white/20">Style</label>
                                <select
                                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-xs text-white/80"
                                  value={btn.style}
                                  onChange={(e) => updateButton(index, "style", e.target.value)}
                                >
                                  <option value="primary">Blurple</option>
                                  <option value="secondary">Grey</option>
                                  <option value="success">Green</option>
                                  <option value="danger">Red</option>
                                  <option value="link">Link</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                        {embedData.buttons.length < 5 && (
                          <button
                            onClick={addButton}
                            className="w-full py-3.5 border border-dashed border-white/10 rounded-2xl text-white/30 hover:text-white/60 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" /> Add Button
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Code Window */}
            <div className="bg-[#111111] rounded-3xl border border-white/10 p-5 shadow-2xl relative group">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                  <WindowControls />
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-[0.2em] ml-2">script.tsx</span>
                </div>
                <button
                  onClick={copyScript}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${copied ? "bg-green-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5 font-mono text-[10px] text-[#5865F2] break-all whitespace-pre-wrap max-h-[100px] overflow-y-auto custom-scrollbar">
                {generatedScript || "{embed_code}"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Import Script Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setShowImportModal(true)}
          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all backdrop-blur-xl shadow-2xl"
        >
          <Upload className="w-6 h-6" />
        </button>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111111] border border-white/5 rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <h2 className="text-3xl font-black mb-4">Import Script</h2>
              <p className="text-white/40 text-sm mb-8">Paste your bot script below to load an existing configuration.</p>
              <textarea
                value={importScript}
                onChange={(e) => setImportScript(e.target.value)}
                className="w-full h-80 bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-8 text-sm outline-none font-mono focus:border-[#5865F2]/50"
                placeholder="Paste code here..."
              />
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => parseImportedScript(importScript)}
                  className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-[#5865F2] hover:text-white transition-all"
                >
                  Import Configuration
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-10 py-4 bg-white/5 text-white/40 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
