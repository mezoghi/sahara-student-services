'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  TrashIcon,
  StarIcon,
  ClockIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

type MessageStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'STARRED' | 'DELETED';
type MessagePriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface Sender {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  status: MessageStatus;
  priority: MessagePriority;
  sender: Sender;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  labels: string[];
  hasAttachments: boolean;
}

type SortConfig = {
  key: keyof Message | 'sender.name';
  direction: 'asc' | 'desc';
};

export default function AdminMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'ALL'>('UNREAD');
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority | 'ALL'>('ALL');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc',
  });
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<MessageStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fetch messages when filters, sort, or page changes
  useEffect(() => {
    if (!authLoading && user) {
      fetchMessages();
    }
  }, [statusFilter, priorityFilter, searchTerm, sortConfig, currentPage, pageSize, user, authLoading]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      };
      
      // In a real app, you would fetch from your API
      // const response = await api.get('/admin/messages', { params });
      // setMessages(response.data.messages);
      // setTotalPages(response.data.pagination?.totalPages || 1);
      
      // Mock data for now
      const mockMessages: Message[] = Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i + 1}`,
        subject: `Inquiry about ${i % 2 === 0 ? 'admission' : 'scholarship'} process`,
        content: `Hello, I would like to inquire about the ${i % 2 === 0 ? 'admission' : 'scholarship'} process. ` +
                 `Could you please provide more details on how to apply and the required documents?`,
        status: ['UNREAD', 'READ', 'ARCHIVED'][i % 3] as MessageStatus,
        priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3] as MessagePriority,
        sender: {
          id: `user-${i}`,
          name: i % 2 === 0 ? 'John Doe' : 'Jane Smith',
          email: i % 2 === 0 ? 'john.doe@example.com' : 'jane.smith@example.com',
          avatar: i % 3 === 0 ? undefined : `https://i.pravatar.cc/150?img=${i % 50}`,
        },
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 12).toISOString(),
        isStarred: i % 4 === 0,
        labels: i % 2 === 0 ? ['Admission'] : ['Scholarship'],
        hasAttachments: i % 5 === 0,
      }));
      
      setMessages(mockMessages);
      setTotalPages(2);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    setStatusFilter(status as MessageStatus | 'ALL');
    setCurrentPage(1);
  };

  // Handle priority filter change
  const handlePriorityChange = (priority: string) => {
    setPriorityFilter(priority as MessagePriority | 'ALL');
    setCurrentPage(1);
  };

  // Toggle message selection
  const toggleMessageSelection = (id: string) => {
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    );
  };

  // Toggle select all messages
  const toggleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(msg => msg.id));
    }
  };

  // Handle bulk action
  const handleBulkAction = async () => {
    if (!bulkAction || selectedMessages.length === 0) return;
    
    try {
      // In a real app, you would call your API
      // await api.patch('/admin/messages/bulk-update', {
      //   messageIds: selectedMessages,
      //   status: bulkAction
      // });
      
      // For now, just update the local state
      setMessages(messages.map(msg => 
        selectedMessages.includes(msg.id) 
          ? { ...msg, status: bulkAction as MessageStatus }
          : msg
      ));
      
      setSelectedMessages([]);
      setBulkAction('');
    } catch (error) {
      console.error('Failed to update messages:', error);
    }
  };

  // Toggle message star status
  const toggleStarMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // In a real app, you would call your API
      // await api.patch(`/admin/messages/${id}/star`);
      
      // For now, just update the local state
      setMessages(messages.map(msg => 
        msg.id === id 
          ? { ...msg, isStarred: !msg.isStarred }
          : msg
      ));
    } catch (error) {
      console.error('Failed to star message:', error);
    }
  };

  // Handle message click
  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (message.status === 'UNREAD') {
      // In a real app, you would call your API
      // await api.patch(`/admin/messages/${message.id}/read`);
      
      // For now, just update the local state
      setMessages(messages.map(msg => 
        msg.id === message.id 
          ? { ...msg, status: 'READ' as MessageStatus }
          : msg
      ));
    }
  };

  // Handle reply submit
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyContent.trim()) return;
    
    try {
      setIsSending(true);
      
      // In a real app, you would call your API
      // await api.post(`/admin/messages/${selectedMessage.id}/reply`, {
      //   content: replyContent,
      // });
      
      // For now, just log and reset
      console.log('Reply sent:', replyContent);
      setReplyContent('');
      setIsReplying(false);
      
      // Show success message
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: MessagePriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: MessageStatus) => {
    switch (status) {
      case 'UNREAD':
        return 'bg-blue-100 text-blue-800';
      case 'READ':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      case 'STARRED':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex h-full bg-gray-50">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Messages</h2>
              <button
                onClick={fetchMessages}
                className="text-gray-500 hover:text-gray-700"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  className="flex-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="ALL">All Messages</option>
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="STARRED">Starred</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                
                <select
                  className="flex-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  value={priorityFilter}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedMessages.length > 0 && (
              <div className="mt-3 bg-blue-50 p-2 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedMessages.length} selected
                  </span>
                  <div className="flex space-x-2">
                    <select
                      className="block w-full pl-2 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value as MessageStatus)}
                    >
                      <option value="">Actions</option>
                      <option value="READ">Mark as Read</option>
                      <option value="UNREAD">Mark as Unread</option>
                      <option value="ARCHIVED">Archive</option>
                      <option value="DELETED">Delete</option>
                    </select>
                    <button
                      onClick={handleBulkAction}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={!bulkAction}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <EnvelopeIcon className="h-12 w-12 mb-2" />
                <p>No messages found</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <li 
                    key={message.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''} ${message.status === 'UNREAD' ? 'font-semibold' : ''}`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleMessageSelection(message.id);
                          }}
                        />
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <button
                          onClick={(e) => toggleStarMessage(message.id, e)}
                          className={`${message.isStarred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                        >
                          <StarIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1 ml-2">
                        <div className="flex justify-between">
                          <p className={`text-sm ${message.status === 'UNREAD' ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.sender.name}
                          </p>
                          <div className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {message.subject}
                        </p>
                        <div className="flex mt-1 space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(message.priority)}`}>
                            {message.priority}
                          </span>
                          {message.labels.map((label) => (
                            <span key={label} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                      {message.hasAttachments && (
                        <div className="flex-shrink-0 ml-2">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, messages.length)}
                    </span>{' '}
                    of <span className="font-medium">{messages.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronUpIcon className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDownIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message View */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedMessage ? (
            <>
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{selectedMessage.subject}</h2>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{selectedMessage.sender.name}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      <span className="mx-1">•</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeClass(selectedMessage.priority)}`}>
                        {selectedMessage.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleStarMessage(selectedMessage.id, {} as React.MouseEvent)}
                      className={`p-1 rounded-full ${selectedMessage.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                      title={selectedMessage.isStarred ? 'Remove star' : 'Add star'}
                    >
                      <StarIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        // In a real app, you would call your API
                        // await api.patch(`/admin/messages/${selectedMessage.id}/archive`);
                        
                        // For now, just update the local state
                        setMessages(messages.map(msg => 
                          msg.id === selectedMessage.id 
                            ? { ...msg, status: 'ARCHIVED' as MessageStatus }
                            : msg
                        ));
                        setSelectedMessage({ ...selectedMessage, status: 'ARCHIVED' });
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500 rounded-full"
                      title="Archive"
                    >
                      <ArchiveBoxIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        // In a real app, you would call your API
                        // await api.delete(`/admin/messages/${selectedMessage.id}`);
                        
                        // For now, just update the local state
                        setMessages(messages.filter(msg => msg.id !== selectedMessage.id));
                        setSelectedMessage(null);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose max-w-none">
                  <p>{selectedMessage.content}</p>
                </div>
                
                {selectedMessage.hasAttachments && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Attachments</h3>
                    <div className="flex space-x-2">
                      <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="ml-2 text-sm font-medium text-gray-700">document.pdf</span>
                        <span className="ml-2 text-xs text-gray-500">2.4 MB</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Reply Form */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <form onSubmit={handleReplySubmit}>
                    <div className="space-y-4">
                      <div>
                            <label htmlFor="reply" className="block text-sm font-medium text-gray-700">
                              Reply to {selectedMessage.sender.name}
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="reply"
                                name="reply"
                                rows={4}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Type your reply here..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                disabled={isSending}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            {isReplying ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setIsReplying(false)}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                  disabled={isSending}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                  disabled={!replyContent.trim() || isSending}
                                >
                                  {isSending ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <PaperAirplaneIcon className="-ml-1 mr-2 h-4 w-4" />
                                      Send
                                    </>
                                  )}
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsReplying(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              >
                                <PaperAirplaneIcon className="-ml-1 mr-2 h-4 w-4" />
                                Reply
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No message selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Select a message to read it here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      );
    }
