"use client";

import { useState } from "react";
import { Send, Play, Download, Copy, Check, Terminal, Code2, Server } from "lucide-react";

interface TikWMResponse {
  code: number;
  msg: string;
  processed_time: number;
  data?: {
    id: string;
    title: string;
    play: string;
    cover: string;
    author: {
      nickname: string;
      avatar: string;
    };
  };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TikWMResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#1e293b]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="text-blue-500" size={20} />
            <h1 className="font-bold text-white tracking-tight">TikAPI <span className="text-blue-500">Tester</span></h1>
          </div>
          <div className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-400">
            v1.0.0
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 lg:p-6 grid lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: INPUT & PREVIEW (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Input Section */}
          <section className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/30 flex items-center gap-2">
              <Code2 size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Request Parameters</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Method</label>
                <div className="flex font-mono text-sm">
                  <span className="bg-green-500/10 text-green-400 px-3 py-2 rounded-l border border-green-500/20 border-r-0 font-bold flex items-center">POST</span>
                  <input 
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-r px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://vt.tiktok.com/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleSend}
                disabled={loading || !url}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Send size={16} />}
                <span>Send Request</span>
              </button>
            </div>
          </section>

          {/* Preview Section */}
          {response?.data && (
            <section className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/30 flex items-center gap-2">
                <Play size={16} className="text-purple-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Media Preview</span>
              </div>
              <div className="p-4">
                <div className="flex gap-3 mb-4">
                  <img src={response.data.cover} className="w-16 h-16 rounded object-cover border border-slate-600 bg-slate-800" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{response.data.author.nickname}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{response.data.title}</p>
                  </div>
                </div>
                
                <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden border border-slate-800 shadow-inner">
                  <video controls className="w-full h-full" src={response.data.play} />
                </div>

                <a 
                  href={response.data.play} 
                  target="_blank"
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium py-2 rounded transition-colors"
                >
                  <Download size={16} /> Download MP4
                </a>
              </div>
            </section>
          )}
        </div>

        {/* KOLOM KANAN: JSON VIEWER (7 Kolom) */}
        <div className="lg:col-span-7 flex flex-col bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden h-[600px] lg:h-[calc(100vh-120px)] sticky top-20">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Body</span>
              {response && <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">200 OK</span>}
            </div>
            {response && (
              <button onClick={() => copyToClipboard(JSON.stringify(response, null, 2))} className="text-slate-500 hover:text-white transition-colors">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-auto bg-[#0d1117] p-4 text-xs sm:text-sm font-mono custom-scrollbar">
            {response ? (
               <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(response, null, 2)) }} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <Terminal size={24} />
                </div>
                <p>Waiting for response...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function syntaxHighlight(json: string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-orange-300';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-blue-400';
      } else {
        cls = 'text-green-400';
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-purple-400';
    } else if (/null/.test(match)) {
      cls = 'text-red-400';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
