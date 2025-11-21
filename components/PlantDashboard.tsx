import React, { useState, useEffect, useRef } from 'react';
import { PlantInfo, ChatMessage } from '../types';
import { Chat } from '@google/genai';
import { createPlantChat, sendMessageToChat } from '../services/geminiService';

interface PlantDashboardProps {
  plantInfo: PlantInfo;
  imagePreview: string;
}

export const PlantDashboard: React.FC<PlantDashboardProps> = ({ plantInfo, imagePreview }) => {
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when component mounts
  useEffect(() => {
    const chat = createPlantChat(plantInfo);
    setChatInstance(chat);
    // Add initial greeting
    setMessages([{
      role: 'model',
      text: `Hello! I see you've found a ${plantInfo.commonName}. It looks beautiful! How can I help you care for it today?`,
      timestamp: Date.now()
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantInfo]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatInstance || isSending) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const responseText = await sendMessageToChat(chatInstance, userMsg.text);
      const modelMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Plant Details (7 columns) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Main Identity Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="relative h-64 sm:h-80 bg-gray-200">
            <img 
              src={imagePreview} 
              alt={plantInfo.commonName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
              <h2 className="text-3xl font-bold text-white">{plantInfo.commonName}</h2>
              <p className="text-emerald-200 italic text-lg">{plantInfo.scientificName}</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">{plantInfo.description}</p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-amber-800 text-sm font-medium">💡 Fun Fact</p>
              <p className="text-amber-900 italic">{plantInfo.funFact}</p>
            </div>
          </div>
        </div>

        {/* Care Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-600">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Light</h3>
              </div>
              <p className="text-gray-600 text-sm">{plantInfo.care.light}</p>
            </div>

            {/* Water */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Water</h3>
              </div>
              <p className="text-gray-600 text-sm">{plantInfo.care.water}</p>
            </div>

            {/* Soil */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                 <div className="p-2 bg-stone-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-stone-600">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Soil</h3>
              </div>
              <p className="text-gray-600 text-sm">{plantInfo.care.soil}</p>
            </div>

            {/* Toxicity */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Safety</h3>
              </div>
              <p className="text-gray-600 text-sm">{plantInfo.care.toxicity}</p>
            </div>
        </div>
      </div>

      {/* Right Column: Chat Interface (5 columns) */}
      <div className="lg:col-span-5 flex flex-col h-[600px] lg:h-auto lg:sticky lg:top-24 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-emerald-600 p-4 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Botantist AI</h3>
            <p className="text-emerald-100 text-xs">Ask about {plantInfo.commonName}</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] rounded-2xl p-3 px-4 shadow-sm ${
                 msg.role === 'user' 
                   ? 'bg-emerald-600 text-white rounded-br-none' 
                   : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
               }`}>
                 <p className="text-sm">{msg.text}</p>
               </div>
            </div>
          ))}
           {isSending && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !inputValue.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};