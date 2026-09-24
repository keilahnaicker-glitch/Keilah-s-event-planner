import React, { useState, useRef, useEffect } from 'react';
import { EventData } from '../types/event';
import { askPlanoraAI } from '../services/aiGenerator';
import { Sparkles, Send, Bot, User, RefreshCw, MessageSquare } from 'lucide-react';

interface AskPlanoraViewProps {
  event: EventData;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AskPlanoraView: React.FC<AskPlanoraViewProps> = ({ event }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Hello! I'm your dedicated event coordinator for **${event.eventName || event.eventType}**. I have all your current details loaded—**${event.guestCount} guests**, a budget of **${event.currency} ${event.budget.toLocaleString()}**, and your **${event.theme || event.vibe}** concept. 

What can I help you coordinate or optimize right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What am I forgetting for this celebration?',
    `How can I make this ${event.eventType.toLowerCase()} more special?`,
    `How can I safely save ${event.currency} ${(Math.round(event.budget * 0.15)).toLocaleString()} without cutting quality?`,
    'Do I have enough tables and seats arranged?',
    'What problems or bottlenecks can you see in my plan?',
    'What should happen right before the speeches?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await askPlanoraAI(userMsg.text, event, history);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-[75vh] max-h-[800px] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-purple-950 text-white p-4 flex items-center justify-between border-b border-purple-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-purple-950 fill-purple-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-white">Ask Planora AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[11px] text-purple-200">
              Synchronized to {event.eventName || event.eventType} ({event.guestCount} guests)
            </span>
          </div>
        </div>

        <div className="text-xs text-stone-400 font-mono hidden sm:block">
          {event.currency} {event.budget.toLocaleString()} • {event.date}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                m.role === 'user'
                  ? 'bg-purple-900 text-white'
                  : 'bg-amber-400 text-purple-950 shadow-xs'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl rounded-2xl p-4 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-900 text-white rounded-tr-xs'
                  : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed font-sans">{m.text}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.role === 'user' ? 'text-purple-300' : 'text-stone-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 px-4 text-stone-500 text-xs italic flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Planora is coordinating your answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] uppercase font-bold text-stone-400 whitespace-nowrap">Suggested:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 text-[11px] whitespace-nowrap transition shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Planora anything about your schedule, budget, seating, or surprises..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-2.5 bg-purple-900 hover:bg-purple-950 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
