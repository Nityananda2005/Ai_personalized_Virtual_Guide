import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, RefreshCw, Code, Eye } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
});

/**
 * Renders a Mermaid diagram dynamically with SVG output, raw code toggle, and copy features.
 * 
 * @param {Object} props
 * @param {string} props.chart - Mermaid chart definition syntax
 */
export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [renderError, setRenderError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const rawId = useId().replace(/:/g, '');
  const elementId = `mermaid_diag_${rawId}`;

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (!chart || !chart.trim()) {
        setSvgContent('');
        setRenderError('No chart data provided.');
        return;
      }

      setRenderError(null);

      try {
        // Clean chart string
        let cleanChart = chart.trim();
        if (cleanChart.startsWith('```')) {
          cleanChart = cleanChart
            .replace(/^```(?:mermaid)?\n?/, '')
            .replace(/\n?```$/, '')
            .trim();
        }

        // Render mermaid SVG
        const { svg } = await mermaid.render(elementId, cleanChart);
        
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.error('[Mermaid Render Error]:', err);
        if (isMounted) {
          setRenderError(err.message || 'Failed to render Mermaid diagram.');
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
      // Clean up dynamic element created by mermaid if any
      const tempElement = document.getElementById(elementId);
      if (tempElement) {
        tempElement.remove();
      }
    };
  }, [chart, elementId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl text-slate-100">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/30">
            Interactive Mindmap
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Toggle Mermaid Raw Code"
          >
            {showCode ? <Eye size={14} /> : <Code size={14} />}
            {showCode ? 'View Diagram' : 'View Syntax'}
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Render Area */}
      {showCode ? (
        <div className="relative">
          <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
            {chart}
          </pre>
        </div>
      ) : renderError ? (
        <div className="p-6 text-center rounded-lg bg-rose-950/40 border border-rose-800/50">
          <p className="text-rose-400 text-sm font-semibold mb-2">Diagram Generation Warning</p>
          <p className="text-slate-400 text-xs font-mono mb-4">{renderError}</p>
          <button
            onClick={() => setShowCode(true)}
            className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs rounded-md"
          >
            Inspect Mermaid Code
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full overflow-x-auto flex justify-center items-center py-6 min-h-[350px] text-slate-100"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}
