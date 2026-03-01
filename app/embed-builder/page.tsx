"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSiteConfig } from "@/lib/site-config"
import * as CustomIcons from "../components/CustomIcons"

interface FieldData {
  name: string
  value: string
  inline: boolean
}

interface ButtonData {
  label: string
  style: string
  url: string
  emoji: string
  row: number
  disabled: boolean
}

interface ContainerItemData {
  type: string
  content?: string
  label?: string
  style?: string
  url?: string
  emoji?: string
  row?: number
  disabled?: boolean
  id?: string
  urls?: string
  spacing?: string
  accessory?: string
}

interface ContainerData {
  enabled: boolean
  accentColor: string
  items: ContainerItemData[]
}

interface EmbedData {
  content: string
  color: string
  url: string
  title: string
  description: string
  authorName: string
  authorIcon: string
  authorUrl: string
  thumbnailUrl: string
  imageUrl: string
  footerText: string
  footerIcon: string
  timestamp: boolean
  deleteAfter: string
  buttons: ButtonData[]
  fields: FieldData[]
  container: ContainerData
}

export default function EmbedBuilder() {
  const { config } = useSiteConfig()
  const [hasMounted, setHasMounted] = useState(false)
  const [builderMode, setBuilderMode] = useState<"v1" | "v2">("v1")
  const [activeTab, setActiveTab] = useState("Embed")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState("")
  const [buttonsEnabled, setButtonsEnabled] = useState(true)

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
    container: { enabled: false, accentColor: "#5865F2", items: [] },
  })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const formatText = (text: string) => {
    if (!text) return text;
    return text
      .replace(/\{user\}/g, "@User")
      .replace(/\{user\.mention\}/g, "<@User>")
      .replace(/\{user\.id\}/g, "123456789")
      .replace(/\{server\}/g, "Example Server")
      .replace(/\{channel\}/g, "#general")
      .replace(/\{roles\}/g, "@role1, @role2")
  }

  const resetEmbed = () => {
    setEmbedData({
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
      fields: [],
      buttons: [],
      container: { enabled: false, accentColor: "#5865F2", items: [] }
    })
  }

  const generatedCommand = useMemo(() => {
    const parts: string[] = []

    if (embedData.content) {
      parts.push(`$v{content: ${embedData.content.replace(/\n/g, "\\n")}}`)
    }

    if (builderMode === "v1") {
      parts.push("$v{embed}")
    }

    if (builderMode === "v1") {
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
        parts.push("$v{buttons}\n")
        if (!buttonsEnabled) parts.push("$v{buttons_disabled}\n")
        embedData.buttons.forEach((button) => {
          const buttonParts: string[] = []
          if (button.label) buttonParts.push(`label=${button.label.replace(/\n/g, "\\n")}`)
          if (button.style) buttonParts.push(`style=${button.style}`)
          if (button.style === 'link' && button.url) buttonParts.push(`url=${button.url}`)
          if (button.emoji) buttonParts.push(`emoji=${button.emoji}`)
          if (button.row !== undefined) buttonParts.push(`row=${button.row}`)
          if (button.disabled) buttonParts.push(`disabled=${button.disabled}`)

          if (buttonParts.length > 0) {
            parts.push(`$v{button: ${buttonParts.join(" && ")}}\n`)
          }
        })
      }
    }

    if (builderMode === "v2" && embedData.container && embedData.container.items && embedData.container.items.length > 0) {
      if (!buttonsEnabled) parts.push("$v{buttons_disabled}\n")
      const cParts: string[] = []
      cParts.push(`$v{container:\n`)
      if (embedData.container.accentColor) {
        cParts.push(`    accent_color: ${embedData.container.accentColor}\n`)
      }
      embedData.container.items.forEach(item => {
        let itemParts = [`type=${item.type}`]
        if (item.type === 'text_display' && item.content) {
          itemParts.push(`content=${item.content.replace(/\n/g, "\\n")}`)
        } else if (item.type === 'button') {
          if (item.label) itemParts.push(`label=${item.label.replace(/\n/g, "\\n")}`)
          if (item.style) itemParts.push(`style=${item.style}`)
          if (item.style === 'link' && item.url) itemParts.push(`url=${item.url}`)
          if (item.emoji) itemParts.push(`emoji=${item.emoji}`)
          if (item.row !== undefined) itemParts.push(`row=${item.row}`)
          if (item.disabled) itemParts.push(`disabled=${item.disabled}`)
          if (item.id) itemParts.push(`id=${item.id}`)
        } else if (item.type === 'separator') {
          if (item.spacing) itemParts.push(`spacing=${item.spacing}`)
        } else if (item.type === 'media_gallery') {
          if (item.urls) itemParts.push(`urls=${item.urls}`)
        } else if (item.type === 'section') {
          if (item.content) itemParts.push(`content=${item.content.replace(/\n/g, "\\n")}`)
          if (item.accessory) itemParts.push(`accessory=${item.accessory}`)
        }
        cParts.push(`    item: ${itemParts.join(" && ")}\n`)
      })
      cParts.push(`}`)
      parts.push(cParts.join(""))
    }

    return parts.join("").trim()
  }, [embedData, buttonsEnabled, builderMode])

  const parseImport = () => {
    let script = importText
    // Remove "$v" wrapper markers globally to simplify extraction if copy/pasted raw
    script = script.replace(/\$v\{/g, "{")

    const contentMatch = script.match(/\{content:\s*([^}]+)\}/)
    const colorMatch = script.match(/\{color:\s*([^}]+)\}/)
    const titleMatch = script.match(/\{title:\s*([^}]+)\}/)
    const descMatch = script.match(/\{description:\s*([^}]+)\}/)
    const authorMatch = script.match(/\{author:\s*name:\s*([^&]+)&&\s*icon:\s*([^}]+)\}/)
    const thumbMatch = script.match(/\{thumbnail:\s*([^}]+)\}/)
    const imageMatch = script.match(/\{image:\s*([^}]+)\}/)
    const footerMatch = script.match(/\{footer:\s*text:\s*([^&]+)&&\s*icon:\s*([^}]+)\}/)

    const fields: FieldData[] = []
    const fieldPattern = /\{field:\s*name:\s*([^&]+)&&\s*value:\s*([^&]+)&&\s*inline:\s*(true|false)\}/g
    let fieldMatch
    while ((fieldMatch = fieldPattern.exec(script)) !== null) {
      fields.push({
        name: fieldMatch[1].trim().replace(/\\n/g, '\n'),
        value: fieldMatch[2].trim().replace(/\\n/g, '\n'),
        inline: fieldMatch[3] === 'true'
      })
    }

    const buttons: ButtonData[] = []
    if (script.includes("{buttons}")) {
      const buttonPattern = /\{button:\s*([^}]+)\}/g
      let buttonMatch
      while ((buttonMatch = buttonPattern.exec(script)) !== null) {
        const buttonStr = buttonMatch[1]
        const button: ButtonData = { label: "", style: "secondary", url: "", emoji: "", row: 0, disabled: false }
        const properties = buttonStr.split("&&")
        properties.forEach((prop) => {
          const splitProp = prop.split("=")
          if (splitProp.length >= 2) {
            const key = splitProp[0].trim()
            const value = splitProp.slice(1).join("=").trim()
            if (key === "label") button.label = value.replace(/\\n/g, '\n')
            else if (key === "style") button.style = value
            else if (key === "url") button.url = value
            else if (key === "emoji") button.emoji = value
            else if (key === "row") button.row = parseInt(value) || 0
            else if (key === "disabled") button.disabled = value === "true"
          }
        })
        if (button.label) buttons.push(button)
      }
    }

    let parsedContainer: ContainerData | undefined = undefined;
    const containerStart = script.indexOf("{container:");
    if (containerStart !== -1) {
      let openBraces = 0;
      let containerEnd = -1;
      for (let i = containerStart; i < script.length; i++) {
        if (script[i] === "{") openBraces++;
        if (script[i] === "}") {
          openBraces--;
          if (openBraces === 0) {
            containerEnd = i;
            break;
          }
        }
      }
      if (containerEnd !== -1) {
        const containerBody = script.slice(containerStart + 11, containerEnd).trim();
        parsedContainer = { enabled: true, accentColor: "", items: [] };

        const accentMatch = containerBody.match(/accent_color:\s*([^\n]+)/);
        if (accentMatch) parsedContainer.accentColor = accentMatch[1].trim();

        const itemLines = containerBody.split("\n").filter(line => line.includes("item:"));
        itemLines.forEach(line => {
          const itemContent = line.split("item:")[1].trim();
          const props = itemContent.split("&&").map(p => p.trim());
          const itemData: any = {};
          props.forEach(prop => {
            const [key, ...valParts] = prop.split("=");
            if (key && valParts) {
              const val = valParts.join("=").trim().replace(/\\n/g, '\n');
              itemData[key.trim()] = val;
            }
          });
          if (itemData.type) {
            if (itemData.row) itemData.row = parseInt(itemData.row);
            if (itemData.disabled) itemData.disabled = itemData.disabled === "true";
            parsedContainer!.items.push(itemData as ContainerItemData);
          }
        });
      }
    }

    if (parsedContainer && parsedContainer.items.length > 0) {
      setBuilderMode("v2");
    } else {
      setBuilderMode("v1");
    }

    setButtonsEnabled(!script.includes("{buttons_disabled}"))
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
      container: parsedContainer || { enabled: false, accentColor: "", items: [] },
    })
    setShowImportModal(false)
    setImportText("")
  }

  const copyCommand = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedCommand)
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea")
        textArea.value = generatedCommand
        textArea.style.position = "fixed"
        textArea.style.left = "-9999px"
        textArea.style.top = "0"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback copy failed', err)
        }
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (!hasMounted) return <div className="min-h-screen bg-black" />

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans selection:bg-white/10">
      {/* Top Nav Placeholder removed */}


      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <CustomIcons.MessageSquareIcon className="w-6 h-6 text-white/80" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter lowercase leading-none mb-1">Embed Creator</h1>
              <p className="text-[14px] text-white/20 font-medium lowercase">Visual embed builder</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              Import
            </button>
            <button
              onClick={resetEmbed}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              <CustomIcons.RotateCcwIcon className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-4 mb-6 pt-4 border-t border-white/5">
          <button onClick={() => { setBuilderMode("v1"); setActiveTab("Embed"); setEmbedData({ ...embedData, container: { ...embedData.container, enabled: false } }) }} className={`px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${builderMode === "v1" ? "bg-[#5865F2] text-white shadow-[0_0_30px_rgba(88,101,242,0.3)]" : "bg-[#111] text-white/30 hover:text-white"}`}>Legacy Embeds</button>
          <button onClick={() => { setBuilderMode("v2"); setEmbedData({ ...embedData, container: { ...embedData.container, enabled: true } }) }} className={`px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${builderMode === "v2" ? "bg-[#5865F2] text-white shadow-[0_0_30px_rgba(88,101,242,0.3)]" : "bg-[#111] text-white/30 hover:text-white"}`}>Components V2 Builder</button>
        </div>

        {/* Desktop Tabs */}
        {builderMode === "v1" && (
          <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
            {["Embed", "Buttons", "Fields", "Media"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                  ${activeTab === tab ? "bg-white text-black shadow-lg" : "text-white/20 hover:text-white/40 hover:bg-white/5"}
                `}
              >
                {tab === "Embed" && <CustomIcons.EmbedIcon className="w-4 h-4" />}
                {tab === "Buttons" && <CustomIcons.MessageSquareIcon className="w-4 h-4" />}
                {tab === "Fields" && <CustomIcons.MenuIcon className="w-4 h-4" />}
                {tab === "Media" && <CustomIcons.HashIcon className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Editor */}
          <div className="space-y-6">
            {builderMode === "v1" && (
              <EditorSection title="Message Content" icon={<CustomIcons.MessageSquareIcon className="w-3.5 h-3.5" />}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Message (optional)</label>
                    <textarea
                      value={embedData.content}
                      onChange={(e) => setEmbedData({ ...embedData, content: e.target.value })}
                      placeholder="Enter message content..."
                      className="w-full h-24 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </EditorSection>
            )}

            {builderMode === "v1" && activeTab === "Embed" && (
              <div className="space-y-6">
                <EditorSection title="Structure" icon={<CustomIcons.EmbedIcon className="w-3.5 h-3.5" />}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Title</label>
                        <input
                          type="text"
                          value={embedData.title}
                          onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
                          placeholder="Embed title..."
                          className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Accent Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={embedData.color}
                            onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                            className="w-10 h-10 bg-[#0a0a0a] border border-white/5 rounded-lg p-1 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={embedData.color}
                            onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                            className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-2 text-[12px] font-mono text-white/40 focus:border-white/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Description</label>
                      <textarea
                        value={embedData.description}
                        onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
                        placeholder="Content description..."
                        className="w-full h-32 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Support URL</label>
                      <input
                        type="text"
                        value={embedData.url}
                        onChange={(e) => setEmbedData({ ...embedData, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 px-1 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group/toggle">
                        <input
                          type="checkbox"
                          checked={embedData.timestamp}
                          onChange={(e) => setEmbedData({ ...embedData, timestamp: e.target.checked })}
                          className="w-4 h-4 rounded border-white/10 bg-black checked:bg-white checked:border-white transition-all"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/toggle:text-white/40 transition-colors">Include Timestamp</span>
                      </label>
                    </div>
                  </div>
                </EditorSection>

                <EditorSection title="Author" icon={<CustomIcons.UserIcon className="w-3.5 h-3.5" />}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Name</label>
                        <input
                          type="text"
                          value={embedData.authorName}
                          onChange={(e) => setEmbedData({ ...embedData, authorName: e.target.value })}
                          placeholder="Author name..."
                          className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Icon URL</label>
                        <input
                          type="text"
                          value={embedData.authorIcon}
                          onChange={(e) => setEmbedData({ ...embedData, authorIcon: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Author Link</label>
                      <input
                        type="text"
                        value={embedData.authorUrl}
                        onChange={(e) => setEmbedData({ ...embedData, authorUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                </EditorSection>

                <EditorSection title="Footer" icon={<CustomIcons.HashIcon className="w-3.5 h-3.5" />}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Text</label>
                      <input
                        type="text"
                        value={embedData.footerText}
                        onChange={(e) => setEmbedData({ ...embedData, footerText: e.target.value })}
                        placeholder="Footer text..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Icon URL</label>
                      <input
                        type="text"
                        value={embedData.footerIcon}
                        onChange={(e) => setEmbedData({ ...embedData, footerIcon: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                </EditorSection>
              </div>
            )}

            {builderMode === "v2" && (
              <EditorSection title="V2 Component Sandbox" icon={<CustomIcons.ComponentIcon className="w-3.5 h-3.5" />}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={embedData.container.accentColor}
                        onChange={(e) => setEmbedData({ ...embedData, container: { ...embedData.container, accentColor: e.target.value } })}
                        className="w-10 h-10 bg-[#0a0a0a] border border-white/5 rounded-lg p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={embedData.container.accentColor}
                        onChange={(e) => setEmbedData({ ...embedData, container: { ...embedData.container, accentColor: e.target.value } })}
                        className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-2 text-[12px] font-mono text-white/40 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1 block border-b border-white/5 pb-2">Container Items (Drag to Reorder)</label>
                    <div className="flex flex-col gap-4">
                      {embedData.container.items.map((item, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => setDraggedIndex(index)}
                          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIndex === null || draggedIndex === index) return;
                            const newItems = [...embedData.container.items];
                            const draggedItem = newItems.splice(draggedIndex, 1)[0];
                            newItems.splice(index, 0, draggedItem);
                            setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } });
                            setDraggedIndex(null);
                          }}
                          className={`p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl relative space-y-4 group/item cursor-grab active:cursor-grabbing hover:border-white/20 transition-all ${draggedIndex === index ? 'opacity-50 scale-[0.98]' : 'opacity-100'}`}
                        >
                          <div className="absolute top-4 right-12 text-white/10 group-hover/item:text-white/40 cursor-grab">
                            <CustomIcons.MenuIcon className="w-4 h-4" />
                          </div>
                          <button
                            onClick={() => setEmbedData({ ...embedData, container: { ...embedData.container, items: embedData.container.items.filter((_, i) => i !== index) } })}
                            className="absolute top-4 right-4 text-white/5 group-hover/item:text-red-400 transition-colors"
                          >
                            <CustomIcons.XIcon className="w-4 h-4" />
                          </button>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Component Type</label>
                            <select
                              value={item.type}
                              onChange={(e) => {
                                const newItems = [...embedData.container.items]
                                newItems[index].type = e.target.value
                                setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                              }}
                              className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 appearance-none text-white/60 cursor-pointer"
                            >
                              <option value="text_display">Text Display</option>
                              <option value="section">Section</option>
                              <option value="button">Button</option>
                              <option value="separator">Separator</option>
                              <option value="media_gallery">Media Gallery</option>
                            </select>
                          </div>

                          {item.type === 'text_display' && (
                            <div className="space-y-2 pt-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Content</label>
                              <textarea
                                value={item.content || ""}
                                onChange={(e) => {
                                  const newItems = [...embedData.container.items]
                                  newItems[index].content = e.target.value
                                  setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                }}
                                placeholder="Text display content..."
                                className="w-full h-24 bg-black border border-white/5 rounded-xl p-4 text-[12px] outline-none focus:border-white/10 resize-none text-white/80"
                              />
                            </div>
                          )}

                          {item.type === 'separator' && (
                            <div className="space-y-2 pt-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Spacing Size</label>
                              <select
                                value={item.spacing || "small"}
                                onChange={(e) => {
                                  const newItems = [...embedData.container.items]
                                  newItems[index].spacing = e.target.value
                                  setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                }}
                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 appearance-none text-white/60"
                              >
                                <option value="small">Small</option>
                                <option value="large">Large</option>
                              </select>
                            </div>
                          )}

                          {item.type === 'media_gallery' && (
                            <div className="space-y-2 pt-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Gallery URLs (Comma Separated)</label>
                              <textarea
                                value={item.urls || ""}
                                onChange={(e) => {
                                  const newItems = [...embedData.container.items]
                                  newItems[index].urls = e.target.value
                                  setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                }}
                                placeholder="https://img1.png, https://img2.jpg"
                                className="w-full h-20 bg-black border border-white/5 rounded-xl p-4 text-[12px] outline-none focus:border-white/10 resize-none text-white/80"
                              />
                            </div>
                          )}

                          {item.type === 'section' && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Section Text Display</label>
                                <textarea
                                  value={item.content || ""}
                                  onChange={(e) => {
                                    const newItems = [...embedData.container.items]
                                    newItems[index].content = e.target.value
                                    setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                  }}
                                  placeholder="Text for section..."
                                  className="w-full h-20 bg-black border border-white/5 rounded-xl p-4 text-[12px] outline-none focus:border-white/10 resize-none text-white/80"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Thumbnail Accessory (Image URL)</label>
                                <input
                                  type="text"
                                  value={item.accessory || ""}
                                  onChange={(e) => {
                                    const newItems = [...embedData.container.items]
                                    newItems[index].accessory = e.target.value
                                    setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                  }}
                                  placeholder="https://..."
                                  className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 text-white/80"
                                />
                              </div>
                            </div>
                          )}

                          {item.type === 'button' && (
                            <>
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Label</label>
                                  <input
                                    type="text"
                                    value={item.label || ""}
                                    onChange={(e) => {
                                      const newItems = [...embedData.container.items]
                                      newItems[index].label = e.target.value
                                      setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                    }}
                                    placeholder="Button label..."
                                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Style</label>
                                  <select
                                    value={item.style || "secondary"}
                                    onChange={(e) => {
                                      const newItems = [...embedData.container.items]
                                      newItems[index].style = e.target.value
                                      setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                    }}
                                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 appearance-none text-white/60"
                                  >
                                    <option value="link">Link</option>
                                    <option value="primary">Primary (Blurple)</option>
                                    <option value="secondary">Secondary (Gray)</option>
                                    <option value="success">Success (Green)</option>
                                    <option value="danger">Danger (Red)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">URL (if link)</label>
                                  <input
                                    type="text"
                                    value={item.url || ""}
                                    onChange={(e) => {
                                      const newItems = [...embedData.container.items]
                                      newItems[index].url = e.target.value
                                      setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                    }}
                                    placeholder="https://..."
                                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 font-mono"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Emoji</label>
                                  <input
                                    type="text"
                                    value={item.emoji || ""}
                                    onChange={(e) => {
                                      const newItems = [...embedData.container.items]
                                      newItems[index].emoji = e.target.value
                                      setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                    }}
                                    placeholder="🔥"
                                    className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2 flex flex-col justify-center">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Disabled</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={!!item.disabled}
                                      onChange={(e) => {
                                        const newItems = [...embedData.container.items]
                                        newItems[index].disabled = e.target.checked
                                        setEmbedData({ ...embedData, container: { ...embedData.container, items: newItems } })
                                      }}
                                      className="w-4 h-4 rounded border-white/10 bg-black checked:bg-white checked:border-white transition-all cursor-pointer"
                                    />
                                    <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Disable Button</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <button
                          onClick={() => setEmbedData({ ...embedData, container: { ...embedData.container, items: [...embedData.container.items, { type: "text_display", content: "New Text Display" }] } })}
                          className="py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                        >
                          <CustomIcons.PlusIcon className="w-4 h-4" /> Add Text Display
                        </button>
                        <button
                          onClick={() => setEmbedData({ ...embedData, container: { ...embedData.container, items: [...embedData.container.items, { type: "button", label: "Button", style: "secondary" }] } })}
                          className="py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                        >
                          <CustomIcons.PlusIcon className="w-4 h-4" /> Add Button
                        </button>
                        <button
                          onClick={() => setEmbedData({ ...embedData, container: { ...embedData.container, items: [...embedData.container.items, { type: "section", content: "Section body text", accessory: "" }] } })}
                          className="py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                        >
                          <CustomIcons.PlusIcon className="w-4 h-4" /> Add Section
                        </button>
                        <button
                          onClick={() => setEmbedData({ ...embedData, container: { ...embedData.container, items: [...embedData.container.items, { type: "separator", spacing: "small" }] } })}
                          className="py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                        >
                          <CustomIcons.PlusIcon className="w-4 h-4" /> Add Separator
                        </button>
                        <button
                          onClick={() => setEmbedData({ ...embedData, container: { ...embedData.container, items: [...embedData.container.items, { type: "media_gallery", urls: "" }] } })}
                          className="py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                        >
                          <CustomIcons.PlusIcon className="w-4 h-4" /> Add Media Gallery
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </EditorSection>
            )}

            {activeTab === "Buttons" && (
              <EditorSection title="Buttons" icon={<CustomIcons.MessageSquareIcon className="w-3.5 h-3.5" />}>
                <div className="space-y-4">
                  {embedData.buttons.map((btn, index) => (
                    <div key={index} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl relative space-y-4 group/btn">
                      <button
                        onClick={() => setEmbedData({ ...embedData, buttons: embedData.buttons.filter((_, i) => i !== index) })}
                        className="absolute top-4 right-4 text-white/5 group-hover/btn:text-red-400 transition-colors"
                      >
                        <CustomIcons.XIcon className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Label</label>
                          <input
                            type="text"
                            value={btn.label}
                            onChange={(e) => {
                              const newButtons = [...embedData.buttons]
                              newButtons[index].label = e.target.value
                              setEmbedData({ ...embedData, buttons: newButtons })
                            }}
                            placeholder="Button label..."
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Style</label>
                          <select
                            value={btn.style}
                            onChange={(e) => {
                              const newButtons = [...embedData.buttons]
                              newButtons[index].style = e.target.value
                              setEmbedData({ ...embedData, buttons: newButtons })
                            }}
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 appearance-none text-white/60"
                          >
                            <option value="link">Link (Default)</option>
                            <option value="primary">Primary (Blurple)</option>
                            <option value="secondary">Secondary (Gray)</option>
                            <option value="success">Success (Green)</option>
                            <option value="danger">Danger (Red)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Emoji</label>
                          <input
                            type="text"
                            value={btn.emoji}
                            onChange={(e) => {
                              const newButtons = [...embedData.buttons]
                              newButtons[index].emoji = e.target.value
                              setEmbedData({ ...embedData, buttons: newButtons })
                            }}
                            placeholder="🔥"
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Row (0-4)</label>
                          <input
                            type="number"
                            min="0"
                            max="4"
                            value={btn.row}
                            onChange={(e) => {
                              const newButtons = [...embedData.buttons]
                              newButtons[index].row = parseInt(e.target.value) || 0
                              setEmbedData({ ...embedData, buttons: newButtons })
                            }}
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20">
                            {btn.style === 'link' ? 'URL' : 'Action ID'}
                          </label>
                          <input
                            type="text"
                            value={btn.url}
                            onChange={(e) => {
                              const newButtons = [...embedData.buttons]
                              newButtons[index].url = e.target.value
                              setEmbedData({ ...embedData, buttons: newButtons })
                            }}
                            placeholder={btn.style === 'link' ? "https://..." : "button_id..."}
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-6 pt-6">
                          <label className="flex items-center gap-2 cursor-pointer group/toggle">
                            <input
                              type="checkbox"
                              checked={btn.disabled}
                              onChange={(e) => {
                                const newButtons = [...embedData.buttons]
                                newButtons[index].disabled = e.target.checked
                                setEmbedData({ ...embedData, buttons: newButtons })
                              }}
                              className="w-4 h-4 rounded border-white/10 bg-black checked:bg-white checked:border-white transition-all"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/toggle:text-white/40 transition-colors">Disabled</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group/toggle px-1">
                      <input
                        type="checkbox"
                        checked={buttonsEnabled}
                        onChange={(e) => setButtonsEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-black checked:bg-white checked:border-white transition-all"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/toggle:text-white/40 transition-colors">Enable Buttons</span>
                    </label>
                    {embedData.buttons.length < 5 && (
                      <button
                        onClick={() => setEmbedData({ ...embedData, buttons: [...embedData.buttons, { label: "Button", style: "secondary", url: "", emoji: "", row: 0, disabled: false }] })}
                        className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                      >
                        <CustomIcons.PlusIcon className="w-4 h-4" /> Add Button
                      </button>
                    )}
                  </div>
                </div>
              </EditorSection>
            )}

            {activeTab === "Fields" && (
              <EditorSection title="Fields" icon={<CustomIcons.MenuIcon className="w-3.5 h-3.5" />}>
                <div className="space-y-4">
                  {embedData.fields.map((field, index) => (
                    <div key={index} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl relative space-y-4 group/field">
                      <button
                        onClick={() => setEmbedData({ ...embedData, fields: embedData.fields.filter((_, i) => i !== index) })}
                        className="absolute top-4 right-4 text-white/5 group-hover/field:text-red-400 transition-colors"
                      >
                        <CustomIcons.XIcon className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-[1fr,100px] gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Name</label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => {
                              const newFields = [...embedData.fields]
                              newFields[index].name = e.target.value
                              setEmbedData({ ...embedData, fields: newFields })
                            }}
                            placeholder="Field name..."
                            className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-[12px] outline-none focus:border-white/10 text-white/80"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-1.5 pt-4">
                          <label className="text-[8px] font-black uppercase tracking-widest text-white/20">Inline</label>
                          <input
                            type="checkbox"
                            checked={field.inline}
                            onChange={(e) => {
                              const newFields = [...embedData.fields]
                              newFields[index].inline = e.target.checked
                              setEmbedData({ ...embedData, fields: newFields })
                            }}
                            className="w-4 h-4 rounded border-white/10 bg-black checked:bg-white checked:border-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Value</label>
                        <textarea
                          value={field.value}
                          onChange={(e) => {
                            const newFields = [...embedData.fields]
                            newFields[index].value = e.target.value
                            setEmbedData({ ...embedData, fields: newFields })
                          }}
                          placeholder="Field value..."
                          className="w-full h-24 bg-black border border-white/5 rounded-xl p-4 text-[12px] outline-none focus:border-white/10 resize-none text-white/60"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setEmbedData({ ...embedData, fields: [...embedData.fields, { name: "", value: "", inline: true }] })}
                    className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all font-black uppercase tracking-widest text-[11px]"
                  >
                    <CustomIcons.PlusIcon className="w-4 h-4" /> Add Field
                  </button>
                </div>
              </EditorSection>
            )}

            {activeTab === "Media" && (
              <EditorSection title="Media" icon={<CustomIcons.HashIcon className="w-3.5 h-3.5" />}>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Thumbnail URL</label>
                      <input
                        type="text"
                        value={embedData.thumbnailUrl}
                        onChange={(e) => setEmbedData({ ...embedData, thumbnailUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Image URL</label>
                      <input
                        type="text"
                        value={embedData.imageUrl}
                        onChange={(e) => setEmbedData({ ...embedData, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-[13px] font-medium text-white/80 focus:border-white/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </EditorSection>
            )}
          </div>

          {/* Right Column: Preview & Output */}
          <div className="space-y-8 lg:sticky lg:top-12">
            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 px-1">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Live Preview</h2>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                {/* Discord Message Mockup */}
                <div className="flex gap-4 relative z-10">
                  <div className="relative w-11 h-11 flex-shrink-0">
                    <img
                      src={config?.botLogo}
                      className="w-full h-full rounded-full ring-2 ring-white/5 shadow-xl grayscale"
                      alt="bot avatar"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#0a0a0a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[15px] hover:underline cursor-pointer lowercase">{config?.botName}</span>
                      <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">APP</span>
                      <span className="text-[11px] text-white/10 ml-1">Today at 8:16 PM</span>
                    </div>

                    {embedData.content && (
                      <div className="text-[14px] text-white/90 leading-tight mb-2 whitespace-pre-wrap">{formatText(embedData.content)}</div>
                    )}

                    {/* Check if we are using V2 Container or V1 Embed */}
                    {builderMode === "v2" ? (
                      <div className="flex flex-col gap-2 w-full max-w-[520px]">
                        <div
                          className="bg-[#2b2d31] rounded-xl overflow-hidden shadow-sm"
                          style={embedData.container.accentColor ? { borderLeft: `4px solid ${embedData.container.accentColor}` } : {}}
                        >
                          <div className="p-4 flex flex-col gap-3">
                            {embedData.container.items.length === 0 && (
                              <div className="text-[13px] text-white/40 italic">Empty layout context. Add V2 blocks...</div>
                            )}
                            {(() => {
                              const groupedItems: any[] = []
                              let currentButtonGroup: any[] = []

                              embedData.container.items.forEach((item) => {
                                if (item.type === 'button') {
                                  currentButtonGroup.push(item)
                                  if (currentButtonGroup.length === 5) {
                                    groupedItems.push({ type: 'button_group', buttons: currentButtonGroup })
                                    currentButtonGroup = []
                                  }
                                } else {
                                  if (currentButtonGroup.length > 0) {
                                    groupedItems.push({ type: 'button_group', buttons: currentButtonGroup })
                                    currentButtonGroup = []
                                  }
                                  groupedItems.push(item)
                                }
                              })
                              if (currentButtonGroup.length > 0) {
                                groupedItems.push({ type: 'button_group', buttons: currentButtonGroup })
                              }

                              return groupedItems.map((item, i) => {
                                if (item.type === 'text_display') {
                                  return (
                                    <div key={i} className="text-[14px] text-white/90 whitespace-pre-wrap leading-relaxed break-words">
                                      {formatText(item.content || "")}
                                    </div>
                                  )
                                } else if (item.type === 'separator') {
                                  const myClass = item.spacing === 'large' ? 'my-4' : 'my-2'
                                  return (
                                    <div key={i} className={`h-[1px] w-full bg-white/10 ${myClass}`} />
                                  )
                                } else if (item.type === 'section') {
                                  return (
                                    <div key={i} className="flex gap-4 p-3 bg-[#1e1f22]/50 rounded-lg border border-white/5 relative items-start">
                                      <div className="text-[14px] text-white/90 whitespace-pre-wrap leading-relaxed flex-1 break-words">
                                        {formatText(item.content || "")}
                                      </div>
                                      {item.accessory && (
                                        <img src={item.accessory} className="w-16 h-16 rounded shadow-sm object-cover flex-shrink-0 bg-black/20" alt="Section accessory" />
                                      )}
                                    </div>
                                  )
                                } else if (item.type === 'media_gallery') {
                                  const urls = (item.urls || "").split(",").map((u: string) => u.trim()).filter(Boolean)
                                  if (urls.length === 0) return null
                                  return (
                                    <div key={i} className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden mt-1">
                                      {urls.slice(0, 4).map((u: string, ui: number) => (
                                        <img key={ui} src={u} className="w-full h-32 object-cover bg-black/20" alt="Gallery Media" />
                                      ))}
                                    </div>
                                  )
                                } else if (item.type === 'button_group') {
                                  return (
                                    <div key={i} className="flex flex-wrap gap-2 mt-1">
                                      {item.buttons.map((btn: any, bi: number) => {
                                        let bgColor = "bg-[#4e5058]" // Secondary
                                        if (btn.style === "primary") bgColor = "bg-[#5865f2]"
                                        if (btn.style === "success") bgColor = "bg-[#23a559]"
                                        if (btn.style === "danger") bgColor = "bg-[#da373c]"
                                        if (btn.style === "link") bgColor = "bg-[#4f545c]"

                                        return (
                                          <div
                                            key={bi}
                                            className={`flex max-w-full w-fit items-center gap-1.5 px-4 py-1.5 rounded-[4px] text-[14px] font-medium text-white transition-opacity
                                              ${bgColor} ${btn.disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-110 cursor-pointer"}
                                            `}
                                          >
                                            {btn.emoji && <span className="flex-shrink-0">{btn.emoji}</span>}
                                            <span className="truncate">{formatText(btn.label || "Button")}</span>
                                            {btn.style === "link" && <CustomIcons.ExternalLinkIcon className="flex-shrink-0 w-4 h-4 ml-0.5 opacity-60" />}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )
                                }
                                return null;
                              })
                            })()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {(embedData.authorName || embedData.title || embedData.description || embedData.fields.length > 0 || embedData.imageUrl || embedData.footerText) && (
                          <div
                            className="max-w-[520px] bg-[#2b2d31] rounded-lg border-l-[4px] border border-white/5 overflow-hidden shadow-2xl transition-all"
                            style={{ borderLeftColor: embedData.color }}
                          >
                            <div className="p-4 space-y-3">
                              {embedData.authorName && (
                                <div className="flex items-center gap-2">
                                  {embedData.authorIcon && <img src={embedData.authorIcon} className="w-5 h-5 rounded-full" />}
                                  <span className="text-[13px] font-bold hover:underline cursor-pointer text-white/90">{formatText(embedData.authorName)}</span>
                                </div>
                              )}
                              {embedData.title && (
                                <div className="text-[16px] font-bold text-white hover:underline cursor-pointer leading-tight">{formatText(embedData.title)}</div>
                              )}
                              {embedData.description && (
                                <div className="text-[14px] text-white/60 leading-relaxed whitespace-pre-wrap">{formatText(embedData.description)}</div>
                              )}

                              {embedData.fields.length > 0 && (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
                                  {embedData.fields.map((f, i) => (
                                    <div key={i} className={f.inline ? "col-span-1" : "col-span-2"}>
                                      <div className="text-[13px] font-bold text-white/90 mb-0.5">{formatText(f.name)}</div>
                                      <div className="text-[13px] text-white/60 leading-tight">{formatText(f.value)}</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {embedData.imageUrl && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-white/5">
                                  <img src={embedData.imageUrl} className="w-full object-cover max-h-[300px]" />
                                </div>
                              )}
                              {embedData.footerText && (
                                <div className="flex items-center gap-2 pt-1 border-t border-white/5 mt-2">
                                  {embedData.footerIcon && <img src={embedData.footerIcon} className="w-4 h-4 rounded-full" />}
                                  <span className="text-[11px] text-white/20 font-medium">
                                    {formatText(embedData.footerText)}
                                    {embedData.timestamp && ` • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Buttons Render */}
                        {embedData.buttons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {embedData.buttons.map((btn, i) => {
                              let bgColor = "bg-[#4e5058]" // Secondary
                              if (btn.style === "primary") bgColor = "bg-[#5865f2]"
                              if (btn.style === "success") bgColor = "bg-[#23a559]"
                              if (btn.style === "danger") bgColor = "bg-[#da373c]"
                              if (btn.style === "link") bgColor = "bg-[#4f545c]"

                              return (
                                <div
                                  key={i}
                                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] text-[14px] font-medium text-white transition-opacity
                                    ${bgColor} ${btn.disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-110 cursor-pointer"}
                                  `}
                                >
                                  {btn.emoji && <span>{btn.emoji}</span>}
                                  {formatText(btn.label || "Button")}
                                  {btn.style === "link" && <CustomIcons.ExternalLinkIcon className="w-4 h-4 ml-0.5 opacity-60" />}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Command */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Generated Command</h2>
              </div>
              <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl relative overflow-hidden group">
                <div className="relative flex flex-col gap-6 z-10">
                  <div className="relative">
                    <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 font-mono text-[12px] text-white/40 break-all leading-relaxed whitespace-pre-wrap min-h-[140px] max-h-[300px] overflow-y-auto overflow-x-hidden selection:bg-white/20">
                      {generatedCommand ? (
                        <span className="text-white/80">{generatedCommand}</span>
                      ) : (
                        "Builder ready. Start configuring your embed to generate a command."
                      )}
                    </div>
                    <button
                      onClick={copyCommand}
                      className="absolute top-4 right-4 p-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl transition-all shadow-xl active:scale-95"
                    >
                      {copied ? <CustomIcons.CheckIcon className="w-4 h-4" /> : <CustomIcons.CopyIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImportModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 shadow-3xl"
            >
              <h2 className="text-3xl font-black lowercase tracking-tighter mb-2">Import Script</h2>
              <p className="text-[13px] text-white/20 font-medium mb-8">Paste your existing command or script here to load the configuration.</p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste code here..."
                className="w-full h-60 bg-black border border-white/5 rounded-2xl p-6 text-[12px] font-mono text-[#5865F2] outline-none focus:border-white/10 mb-8"
              />

              <div className="flex gap-4">
                <button
                  onClick={parseImport}
                  className="flex-1 py-4 bg-white text-black rounded-2xl font-black text-[13px] uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Load Configuration
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EditorSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-7 py-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-7 h-7 bg-white/[0.05] rounded-lg flex items-center justify-center text-white/40">
            {icon}
          </div>
          <h3 className="text-[13px] font-black uppercase tracking-widest text-white/80">{title}</h3>
        </div>
        <CustomIcons.ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-7 pb-8 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
