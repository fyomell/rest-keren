"use client";

import { useState } from "react";
import { Send, Play, Download, Copy, Check, Terminal, Code2, Server, BookOpen } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<'tester' | 'docs'>('tester');

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
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#1e293b]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="text-blue-500" size={24} />
            <div>
              <h1 className="font-bold text-white tracking-tight text-lg">TikAPI <span className="text-blue-500">Cloud</span></h1>
              <p className="text-[10px] text-slate-400 font-mono">REST API Service</p>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setActiveTab('tester')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${activeTab === 'tester' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              API Tester
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${activeTab === 'docs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Documentation
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        
        {activeTab === 'tester' ? (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LEFT: INPUT */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs font-mono text-slate-400">Request Console</span>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Endpoint</label>
                    <div className="flex font-mono text-sm shadow-inner bg-[#0f172a] rounded border border-slate-700">
                      <span className="bg-blue-600/10 text-blue-400 px-3 py-3 border-r border-slate-700 font-bold">POST</span>
                      <span className="px-3 py-3 text-slate-400 truncate w-full">/api/tiktok</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parameters (JSON)</label>
                    <div className="flex font-mono text-sm">
                       <input 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Paste TikTok URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSend}
                    disabled={loading || !url}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                  >
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Send size={18} />}
                    <span>Send Request</span>
                  </button>
                </div>
              </div>

              {/* PREVIEW */}
              {response?.data && (
                <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  <div className="px-5 py-3 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Play size={14} className="text-purple-400" /> Preview
                    </span>
                    <a href={response.data.play} target="_blank" className="text-xs text-blue-400 hover:underline">Open External ↗</a>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={response.data.author.avatar} className="w-12 h-12 rounded-full border-2 border-slate-700" />
                      <div>
                        <h3 className="font-bold text-white">{response.data.author.nickname}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{response.data.title}</p>
                      </div>
                    </div>
                    
                    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden border border-slate-800 shadow-inner mx-auto max-w-[240px]">
                      <video controls className="w-full h-full object-contain" src={response.data.play} />
                    </div>

                    <a 
                      href={response.data.play} 
                      className="mt-5 flex items-center justify-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded transition-colors"
                    >
                      <Download size={18} /> Download HD
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: JSON RESPONSE */}
            <div className="lg:col-span-7 flex flex-col bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden h-[650px] sticky top-24">
              <div className="px-5 py-3 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-orange-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Body</span>
                  {response && <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-mono">Status: 200 OK</span>}
                </div>
                {response && (
                  <button onClick={() => copyToClipboard(JSON.stringify(response, null, 2))} className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-auto bg-[#0d1117] p-5 text-xs sm:text-sm font-mono custom-scrollbar">
                {response ? (
                   <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(response, null, 2)) }} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center ring-1 ring-slate-700">
                      <Code2 size={32} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-medium text-slate-400">Ready to test</p>
                      <p className="text-xs text-slate-600">Send a request to see the response payload</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* DOCS TAB */
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Documentation</h2>
              <p className="text-slate-400">How to consume this API programmatically.</p>
            </div>

            <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
               <div className="px-5 py-4 border-b border-slate-700 bg-slate-900/50">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-mono">POST</span>
                    /api/tiktok
                  </h3>
               </div>
               <div className="p-6 space-y-6">
                 
                 <div className="space-y-3">
                   <label className="text-xs font-bold text-slate-500 uppercase">Endpoint URL</label>
                   <div className="flex items-center gap-2 bg-[#0f172a] p-3 rounded border border-slate-700">
                     <code className="text-sm text-blue-400 flex-1 font-mono">https://api-rofik.vercel.app/api/tiktok</code>
                     <button onClick={() => copyToClipboard("https://api-rofik.vercel.app/api/tiktok")} className="text-slate-500 hover:text-white"><Copy size={16}/></button>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-xs font-bold text-slate-500 uppercase">Request Body (JSON)</label>
                   <pre className="bg-[#0f172a] p-4 rounded border border-slate-700 text-sm font-mono text-green-400">
{`{
  "url": "https://vt.tiktok.com/ZS53PHfPk/"
}`}
                   </pre>
                 </div>

                 <div className="space-y-3">
                   <label className="text-xs font-bold text-slate-500 uppercase">Example: cURL</label>
                   <pre className="bg-[#0f172a] p-4 rounded border border-slate-700 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto">
{`curl -X POST https://api-rofik.vercel.app/api/tiktok \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://vt.tiktok.com/ZS53PHfPk/"}'`}
                   </pre>
                 </div>

               </div>
            </div>
          </div>
        )}
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
