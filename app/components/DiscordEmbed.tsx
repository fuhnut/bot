/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Embed, EmbedField } from "@/lib/interfaces";
import Markdown from "@/lib/markdown/Markdown";

export default function DiscordEmbed({ embed }: { embed: Embed }) {
    const fieldRows: EmbedField[][] = [];

    for (const field of embed.fields) {
        if (
            // If there are no rows
            fieldRows.length === 0 ||
            // Or the current field is not inline
            !field.inline ||
            // Or the previous row's field is not inline
            !fieldRows[fieldRows.length - 1][0].inline ||
            // Or the previous row's number of fields is at least 3
            fieldRows[fieldRows.length - 1].length >= 3
        ) {
            // Start a new row
            fieldRows.push([field]);
        } else {
            // Otherwise, add the field to the last row
            fieldRows[fieldRows.length - 1].push(field);
        }
    }

    const fieldGridCols: string[] = [];

    for (const row of fieldRows) {
        const step = 12 / row.length;
        for (let i = 1; i < 13; i += step) {
            fieldGridCols.push(`${i}/${i + step}`);
        }
    }

    // Ensure author Url is actually valid before using it
    const authorUrl = embed.author.url && embed.author.url.startsWith('http') ? embed.author.url : undefined;
    // Ensure title Url is actually valid before using it
    const titleUrl = embed.url && embed.url.startsWith('http') ? embed.url : undefined;

    return (
        <article
            className="bg-[#2f3136] border-l-4 border-solid relative grid w-fit max-w-[520px] box-border rounded leading-[1.375rem] normal-case"
            style={{ borderLeftColor: embed.color || "#202225" }}
        >
            <div className="overflow-hidden p-[.5rem_1rem_1rem_.75rem] inline-grid grid-cols-[auto] grid-rows-[auto]">
                {/* Author */}
                {embed.author.name || embed.author.iconUrl ? (
                    <div className="min-w-0 flex items-center col-[1/1] mt-2">
                        {/* Author Icon */}
                        {embed.author.iconUrl ? (
                            <img
                                className="h-6 w-6 rounded-full mr-2 object-contain"
                                src={embed.author.iconUrl}
                                alt=""
                            />
                        ) : null}

                        {/* Author Name */}
                        {authorUrl ? (
                            <a
                                href={authorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                role="button"
                                className="text-white text-sm font-semibold hover:underline"
                            >
                                {embed.author.name}
                            </a>
                        ) : (
                            <span className="text-white text-sm font-semibold cursor-text">
                                {embed.author.name}
                            </span>
                        )}
                    </div>
                ) : null}

                {/* Title */}
                {embed.title ? (
                    titleUrl ? (
                        <a
                            href={titleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            role="button"
                            className="min-w-0 text-white inline-block font-semibold col-[1/1] mt-2 hover:underline text-[#00b0f4]"
                        >
                            <Markdown type="header">{embed.title}</Markdown>
                        </a>
                    ) : (
                        <div className="min-w-0 text-white inline-block font-semibold col-[1/1] mt-2 cursor-text">
                            <Markdown type="header">{embed.title}</Markdown>
                        </div>
                    )
                ) : null}

                {/* Description */}
                {embed.description ? (
                    <div className="min-w-0 text-sm font-normal whitespace-pre-line col-[1/1] mt-2 text-[#dcddde]">
                        <Markdown>{embed.description}</Markdown>
                    </div>
                ) : null}

                {/* Fields */}
                {embed.fields.length ? (
                    <div className="min-w-0 grid grid-cols-12 gap-2 mt-2">
                        {embed.fields.map((field, index) => (
                            <div
                                key={index}
                                className="min-w-0 text-sm leading-[1.125rem] font-normal"
                                style={{ gridColumn: fieldGridCols[index] || '1/13' }}
                            >
                                {/* Field Name */}
                                <div className="min-w-0 text-[#dcddde] font-semibold mb-0.5">
                                    <Markdown type="header">
                                        {field.name}
                                    </Markdown>
                                </div>

                                {/* Field Value */}
                                <div className="min-w-0 font-normal whitespace-pre-line text-[#dcddde]">
                                    <Markdown>{field.value}</Markdown>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* Image */}
                {embed.image ? (
                    <div
                        className={`min-w-0 block mt-4 max-w-[400px] max-h-[300px] justify-self-start rounded cursor-pointer overflow-hidden ${embed.thumbnail ? "col-[1/3]" : "col-[1/1]"
                            }`}
                    >
                        <img
                            className="object-contain max-h-full max-w-full rounded"
                            src={embed.image}
                            alt={embed.image}
                        />
                    </div>
                ) : null}

                {/* Thumbnail */}
                {embed.thumbnail ? (
                    <div className="min-w-0 row-[1/8] col-[2/2] mt-2 ml-4 shrink-0 justify-self-end block max-w-20 max-h-20 rounded-[3px] cursor-pointer overflow-hidden">
                        <img
                            className="object-contain max-h-full max-w-full rounded"
                            src={embed.thumbnail}
                            alt={embed.thumbnail}
                        />
                    </div>
                ) : null}

                {/* Footer */}
                {embed.footer.text || embed.footer.iconUrl || embed.timestamp ? (
                    <div
                        className={`min-w-0 flex items-center mt-2 row-auto ${embed.thumbnail ? "col-[1/3]" : "col-[1/1]"
                            }`}
                    >
                        {/* Footer Icon */}
                        {embed.footer.iconUrl ? (
                            <img
                                className="h-5 w-5 rounded-full mr-2 object-contain"
                                src={embed.footer.iconUrl}
                                alt=""
                            />
                        ) : null}

                        {/* Footer Text */}
                        <div className="min-w-0 text-xs font-medium text-[#dcddde]">
                            {embed.footer.text}
                            {embed.footer.text && embed.timestamp ? (
                                <span className="inline-block mx-1">
                                    &bull;
                                </span>
                            ) : null}
                            {embed.timestamp ? "Today at 12:00 PM" : null}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Buttons Section */}
            {embed.buttons && embed.buttons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 px-1">
                    {embed.buttons.map((btn, i) => {
                        const styles: Record<string, string> = {
                            primary: "bg-[#5865F2] hover:bg-[#4752C4]",
                            secondary: "bg-[#4E5058] hover:bg-[#6D6F78]",
                            success: "bg-[#248046] hover:bg-[#1A6334]",
                            danger: "bg-[#DA373C] hover:bg-[#A12828]",
                            link: "bg-[#4E5058] hover:bg-[#6D6F78]"
                        };
                        const styleClasses = styles[btn.style] || "bg-[#4E5058]";

                        return (
                            <button
                                key={i}
                                disabled={btn.disabled}
                                className={`${styleClasses} text-white px-4 py-1.5 rounded-[3px] text-sm font-medium transition-colors flex items-center gap-1.5 min-h-[32px] disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {btn.emoji && <span>{btn.emoji}</span>}
                                {btn.label}
                                {btn.style === 'link' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </article>
    );
}
