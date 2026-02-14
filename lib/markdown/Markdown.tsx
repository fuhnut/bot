import React from 'react';

interface MarkdownProps {
    children?: string;
    type?: 'header' | 'text';
}

export default function Markdown({ children, type = 'text' }: MarkdownProps) {
    if (!children) return null;

    // Simple parser for basic Discord markdown
    // This is a naive implementation and might need further refinements for complex nesting

    const parse = (text: string): React.ReactNode[] => {
        const parts: React.ReactNode[] = [];
        let remaining = text;

        // Pattern for bold (**text**)
        const boldPattern = /(\*\*.*?\*\*)/g;
        // Pattern for italic (*text* or _text_)
        const italicPattern = /(\*.*?\*|_.*?_)/g;
        // Pattern for underline (__text__)
        const underlinePattern = /(__.*?__)/g;
        // Pattern for strikethrough (~~text~~)
        const strikePattern = /(~~.*?~~)/g;
        // Pattern for code (`text`)
        const codePattern = /(`.*?`)/g;
        // Pattern for links ([text](url))
        const linkPattern = /(\[.*?\]\(.*?\))/g;

        // Helper to process text node recursively
        // For simplicity, we just split by bold first, then map over results
        // A proper parser would tokenize the string.

        // Let's implement a simple recursive splitter for now.
        // Order of precedence: Code > Link > Bold > Underline > Strike > Italic

        // Actually, splitting by regex capturing groups is easier but flawed for nesting.
        // Given the constraints, I will implement a flat parser for now.

        // For now, let's support Bold, Italic, Code, Link.

        const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\)|__.*?__|@[a-zA-Z0-9_]+)/g);

        return tokens.map((token, i) => {
            if (token.startsWith('**') && token.endsWith('**')) {
                return <strong key={i} className="font-bold">{parse(token.slice(2, -2))}</strong>;
            }
            if (token.startsWith('`') && token.endsWith('`')) {
                return <code key={i} className="bg-[#202225] p-0.5 rounded text-sm font-mono">{token.slice(1, -1)}</code>;
            }
            if (token.startsWith('__') && token.endsWith('__')) {
                return <u key={i} className="underline">{parse(token.slice(2, -2))}</u>;
            }
            if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
                const match = token.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                    return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-[#00b0f4] hover:underline cursor-pointer">{match[1]}</a>;
                }
            }
            if (token.startsWith('@')) {
                return <span key={i} className="bg-[#5865F2]/30 text-[#dee0fc] px-1 rounded-sm cursor-pointer hover:bg-[#5865F2]/50 transition-colors font-medium">@{token.slice(1)}</span>;
            }

            // Handle italic and strike within text
            // (Since split above might leave them in plain text chunks)
            const subTokens = token.split(/(\*.*?\*|~~.*?~~)/g);
            if (subTokens.length > 1) {
                return subTokens.map((sub, j) => {
                    if (sub.startsWith('*') && sub.endsWith('*')) {
                        return <em key={`${i}-${j}`} className="italic">{sub.slice(1, -1)}</em>;
                    }
                    if (sub.startsWith('~~') && sub.endsWith('~~')) {
                        return <s key={`${i}-${j}`} className="line-through">{sub.slice(2, -2)}</s>;
                    }
                    return sub;
                });
            }

            return token;
        });
    };

    return <>{parse(children)}</>;
}
