export interface EmbedAuthor {
    name?: string;
    url?: string;
    iconUrl?: string;
}

export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface EmbedFooter {
    text?: string;
    iconUrl?: string;
}

export interface EmbedButton {
    label: string;
    style: string;
    url?: string;
    emoji?: string;
    disabled?: boolean;
}

export interface Embed {
    title?: string;
    description?: string;
    url?: string;
    color?: string;
    timestamp?: boolean;
    author: EmbedAuthor;
    thumbnail?: string;
    image?: string;
    footer: EmbedFooter;
    fields: EmbedField[];
    buttons?: EmbedButton[];
}
