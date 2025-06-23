// src/app/components/TicketSystemModal.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { X, ChevronLeft, Send, Paperclip, AlertTriangle } from 'lucide-react';

const TicketSystemModal = ({ isOpen, onClose, tickets, userId, onNewTicket, onReply, getMessages, onMarkAsRead, user }) => {
    const [view, setView] = useState('list'); // 'list', 'detail', 'new'
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState('');
    
    // Form state
    const [subject, setSubject] = useState('');
    const [initialMessage, setInitialMessage] = useState('');
    const [userName, setUserName] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedTicket) {
            const unsubscribe = getMessages(selectedTicket.id, setMessages);
            onMarkAsRead(selectedTicket.id);
            return () => unsubscribe();
        }
    }, [selectedTicket, getMessages, onMarkAsRead]);

    useEffect(() => {
        if (view === 'detail') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, view]);

    const handleSelectTicket = (ticket) => {
        setSelectedTicket(ticket);
        setView('detail');
    };

    const handleBackToList = () => {
        setSelectedTicket(null);
        setMessages([]);
        setView('list');
    };

    const handleNewTicketSubmit = (e) => {
        e.preventDefault();
        onNewTicket({ subject, initialMessage, userName });
        setSubject('');
        setInitialMessage('');
        setUserName('');
        setView('list');
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onReply(selectedTicket.id, replyText);
        setReplyText('');
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300';
            case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return timestamp.toDate().toLocaleString();
    };

    const renderListView = () => (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Your Tickets</h3>
                <button
                    onClick={() => setView('new')}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create New Ticket
                </button>
            </div>
             <div className="space-y-2">
                {tickets.length > 0 ? tickets.map(ticket => (
                    <div key={ticket.id} onClick={() => handleSelectTicket(ticket)} className="p-3 bg-gray-50 dark:bg-gray-700/60 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{ticket.subject}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {formatDate(ticket.updatedAt)}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {!ticket.isReadByUser && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" title="New reply"></span>}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>You have no support tickets.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderDetailView = () => (
        <div className="h-full flex flex-col">
            <button onClick={handleBackToList} className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-2 flex-shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to all tickets
            </button>
            <div className="mb-4 flex-shrink-0">
                 <h3 className="text-lg font-bold">{selectedTicket.subject}</h3>
                 <p className="text-xs text-gray-500">Opened by: {selectedTicket.userName} on {formatDate(selectedTicket.createdAt)}</p>
            </div>
            <div className="flex-grow space-y-4 overflow-y-auto bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-xl max-w-sm ${msg.senderId === userId ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(msg.timestamp)}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleReplySubmit} className="mt-4 flex items-center space-x-2 flex-shrink-0">
                <textarea 
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows="2"
                    className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"
                />
                <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Send className="w-5 h-5"/></button>
            </form>
        </div>
    );

    const renderNewTicketView = () => (
         <form onSubmit={handleNewTicketSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold">New Support Ticket</h3>
                 <button type="button" onClick={() => setView('list')} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
            </div>

            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>This is an anonymous platform. You are not required to provide your name or any personally identifiable information.</span>
            </div>
            
             <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Name (Optional)</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Problem with mileage calculation" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
            </div>
            
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Describe your issue</label>
                <textarea value={initialMessage} onChange={(e) => setInitialMessage(e.target.value)} required rows="6" placeholder="Please provide as much detail as possible..." className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"></textarea>
            </div>
            
            <button type="submit" className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Submit Ticket</button>
        </form>
    );


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Support Center</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto -mr-3 pr-3">
                    {view === 'list' && renderListView()}
                    {view === 'detail' && renderDetailView()}
                    {view === 'new' && renderNewTicketView()}
                </div>
                
                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <p>Ticket data is retained for 30 days for support purposes and can be deleted upon request.</p>
                </div>
            </div>
        </Modal>
    );
};

export default TicketSystemModal;