import React from 'react';

/**
 * Rich Markdown Viewer component to convert raw markdown into beautifully styled HTML elements.
 * Supports Headings (#, ##, ###), Tables (| col |), Lists (-, *, 1.), Blockquotes (>), Bold (**), Code blocks (```), and Inline Code (`).
 * 
 * @param {Object} props
 * @param {string} props.content - Raw markdown text string
 */
export default function MarkdownViewer({ content }) {
  if (!content) return null;

  // Split lines into structured blocks
  const lines = content.split('\n');

  const renderedBlocks = [];
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLanguage = '';

  const flushTable = (keyIndex) => {
    if (tableHeader.length > 0) {
      renderedBlocks.push(
        <div key={`table_${keyIndex}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-md">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-indigo-300 border-b border-slate-800 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                {tableHeader.map((th, idx) => (
                  <th key={idx} className="px-4 py-3 font-extrabold">
                    {parseInlineMarkdown(th)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 leading-relaxed">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  const flushCodeBlock = (keyIndex) => {
    renderedBlocks.push(
      <div key={`code_${keyIndex}`} className="my-5 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
          <span>{codeLanguage || 'Code Snippet'}</span>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
          <code>{codeLines.join('\n')}</code>
        </pre>
      </div>
    );
    inCodeBlock = false;
    codeLines = [];
    codeLanguage = '';
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check Code Block Start / End
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock(index);
      } else {
        if (inTable) flushTable(index);
        inCodeBlock = true;
        codeLanguage = trimmed.replace('```', '').trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Check Table Rows (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      // Skip separator rows (|---|---|)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        return;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(index);
    }

    // Empty lines
    if (!trimmed) {
      return;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      renderedBlocks.push(
        <h1 key={index} className="text-xl sm:text-2xl font-black text-white mt-8 mb-4 border-b border-slate-800 pb-3 flex items-center space-x-2">
          <span>{parseInlineMarkdown(trimmed.replace('# ', ''))}</span>
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      renderedBlocks.push(
        <h2 key={index} className="text-lg sm:text-xl font-bold text-indigo-300 mt-7 mb-3 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block mr-1"></span>
          <span>{parseInlineMarkdown(trimmed.replace('## ', ''))}</span>
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      renderedBlocks.push(
        <h3 key={index} className="text-base font-bold text-purple-300 mt-5 mb-2">
          {parseInlineMarkdown(trimmed.replace('### ', ''))}
        </h3>
      );
    }
    // Blockquotes / Callouts
    else if (trimmed.startsWith('> ')) {
      renderedBlocks.push(
        <blockquote key={index} className="my-4 border-l-4 border-amber-500 bg-amber-950/20 p-4 rounded-r-2xl text-xs sm:text-sm text-amber-200/90 italic space-y-1">
          {parseInlineMarkdown(trimmed.replace('> ', ''))}
        </blockquote>
      );
    }
    // Bullet items (-, *, •)
    else if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      renderedBlocks.push(
        <div key={index} className="flex items-start space-x-2 my-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <span className="text-indigo-400 font-bold text-base leading-none select-none">•</span>
          <span>{parseInlineMarkdown(itemText)}</span>
        </div>
      );
    }
    // Numbered list items (1., 2.)
    else if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (match) {
        const num = match[1];
        const itemText = match[2];
        renderedBlocks.push(
          <div key={index} className="flex items-start space-x-3 my-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="px-2 py-0.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-extrabold text-[11px] shrink-0">
              {num}
            </span>
            <span className="mt-0.5">{parseInlineMarkdown(itemText)}</span>
          </div>
        );
      }
    }
    // Paragraph text
    else {
      renderedBlocks.push(
        <p key={index} className="my-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  if (inTable) flushTable('end');
  if (inCodeBlock) flushCodeBlock('end');

  return <div className="space-y-1">{renderedBlocks}</div>;
}

/**
 * Parses inline markdown elements (**bold**, `inline code`, *italic*)
 */
function parseInlineMarkdown(text) {
  if (!text) return text;

  // Split by bold (**bold**) or code (`code`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-extrabold text-white bg-indigo-950/40 px-1 py-0.5 rounded border border-indigo-800/40">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="font-mono text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
