import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Send, User, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchChatHistory(activeContact._id);
      
      // Setup automatic polling interval to simulate live updates (every 5 seconds)
      const pollTimer = setInterval(() => {
        pollChatHistory(activeContact._id);
      }, 5000);

      return () => clearInterval(pollTimer);
    }
  }, [activeContact]);

  useEffect(() => {
    // Scroll to the bottom when messages load/update
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const data = await api.get('/chat/contacts');
      setContacts(data);
      if (data.length > 0) {
        setActiveContact(data[0]);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (contactId) => {
    setMsgLoading(true);
    try {
      const data = await api.get(`/chat/history/${contactId}`);
      setMessages(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setMsgLoading(false);
    }
  };

  const pollChatHistory = async (contactId) => {
    try {
      const data = await api.get(`/chat/history/${contactId}`);
      // Simple length check before updating state to prevent re-renders if no changes
      if (data.length !== messages.length) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to poll logs:', err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const data = await api.post(`/chat/${activeContact._id}`, { message: newMessage.trim() });
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl min-h-[550px] max-h-[650px]">
      
      {/* Sidebar: Contacts List */}
      <div className="w-1/3 border-r border-slate-900 bg-slate-950 flex flex-col">
        <div className="p-4 border-b border-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-200">Active Contacts</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {contacts.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 text-center">No active contacts found.</p>
          ) : (
            contacts.map(c => (
              <button
                key={c._id}
                onClick={() => setActiveContact(c)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  activeContact?._id === c._id
                    ? 'bg-indigo-600/10 text-indigo-300'
                    : 'text-slate-400 hover:bg-slate-900/40'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 uppercase font-bold text-xs">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{c.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{c.role}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col bg-slate-900/10">
        {activeContact ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-slate-900 bg-slate-950 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs uppercase text-white">
                {activeContact.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">{activeContact.name}</h3>
                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">{activeContact.role}</p>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {msgLoading ? (
                <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare className="w-10 h-10 text-slate-700" />
                  <p className="text-xs text-slate-500 mt-2">Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isOwnMessage = String(m.senderId._id || m.senderId) === String(user._id);
                  return (
                    <div 
                      key={m._id || idx}
                      className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                        isOwnMessage 
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                          : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-bl-none'
                      }`}>
                        {m.message}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 uppercase">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-900 bg-slate-950 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type your message here..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="w-12 h-12 text-slate-800" />
            <p className="text-slate-400 mt-4 font-bold text-sm">No Active Conversation</p>
            <p className="text-xs text-slate-500 mt-1">Select a contact from the sidebar list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
