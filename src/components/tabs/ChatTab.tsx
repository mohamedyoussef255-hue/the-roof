import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { ChatMessage, User } from '../../types';

interface ChatTabProps {
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  t: Record<string, string>;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  currentUser,
  messages,
  onSendMessage,
  t,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPhrases = [
    'أنا طالع في السكة 🚗',
    'التكييف شغال يا شباب؟ ❄️',
    'مين جاهز لماتش فيفا؟ 🎮',
    'مساء الفل على أحلى شلة ❤️',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col h-[520px] shadow-sm animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[var(--brand-color)]/10 text-[var(--brand-color)] flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              {t.chat_title}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t.chat_desc}
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-black border border-emerald-500/30">
          {t.live_badge}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll py-2">
        {messages.map((m) => {
          const isMe = m.sender === currentUser.name;

          if (m.isSystem) {
            return (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/25 text-center space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-[var(--brand-color)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إشعار رسمي من إدارة الرووف</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {m.text}
                </p>
                <span className="text-[9px] text-slate-400 block">{m.time}</span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                {isMe ? 'أنت' : m.sender}
              </div>
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                  isMe
                    ? 'bg-[var(--brand-color)] text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">
                {m.time}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-1.5 overflow-x-auto py-2 custom-scroll border-t border-slate-100 dark:border-slate-800/60">
        {quickPhrases.map((phrase, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(phrase)}
            className="shrink-0 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-xl font-bold transition"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.chat_placeholder}
          className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-color)]"
        />
        <button
          type="submit"
          className="bg-[var(--brand-color)] hover:opacity-90 text-white p-2.5 rounded-2xl active:scale-95 transition shadow-md shadow-[var(--brand-glow)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
