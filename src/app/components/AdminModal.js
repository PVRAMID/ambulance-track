// src/app/components/AdminModal.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import Image from 'next/image';
import { X, Users, Megaphone, UserPlus, Trash2, Edit, ChevronDown, ChevronUp, Save } from 'lucide-react';
import {
    getAllUsers,
    deleteUserContent,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addAdmin,
    updateUserDoc,
} from '../hooks/useFirebase';
import { GRADES, PAY_BANDS, DIVISIONS, DIVISIONS_AND_STATIONS } from '../lib/constants';

const AdminModal = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [editableSettings, setEditableSettings] = useState(null);

    // State for announcements
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [announcementContent, setAnnouncementContent] = useState('');
    const [announcementAuthor, setAnnouncementAuthor] = useState('');
    const [announcementImageUrl, setAnnouncementImageUrl] = useState('');


    // State for adding admins
    const [newAdminUid, setNewAdminUid] = useState('');

    // State for confirmations
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        const result = await getAllUsers();
        if (result.success) {
            setUsers(result.data);
        } else {
            setError('Failed to fetch users.');
        }
        setIsLoading(false);
    }, []);

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        const result = await getAnnouncements();
        if (result.success) {
            setAnnouncements(result.data);
        } else {
            setError('Failed to fetch announcements.');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (activeTab === 'users') {
                fetchUsers();
            } else if (activeTab === 'announcements') {
                fetchAnnouncements();
            }
        } else {
            // Reset state on close
            setSelectedUser(null);
            setIsEditingUser(false);
            setEditableSettings(null);
        }
    }, [isOpen, activeTab, fetchUsers, fetchAnnouncements]);
    
    useEffect(() => {
        if (user && user.displayName && !editingAnnouncement) {
            setAnnouncementAuthor(user.displayName);
        }
    }, [user, editingAnnouncement]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setSelectedUser(null);
        setIsEditingUser(false);
        setEditingAnnouncement(null);
        setAnnouncementContent('');
        setAnnouncementImageUrl('');
    };

    const handleDeleteClick = (type, id, name) => {
        setItemToDelete({ type, id, name });
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const { type, id } = itemToDelete;

        let result;
        if (type === 'user') {
            result = await deleteUserContent(id);
            if (result.success) {
                fetchUsers();
                setSelectedUser(null);
            }
        } else if (type === 'announcement') {
            result = await deleteAnnouncement(id);
            if (result.success) fetchAnnouncements();
        }

        if (!result.success) {
            alert(`Failed to delete ${type}.`);
        }
        setItemToDelete(null);
    };

    const handleEditClick = (ann) => {
        setEditingAnnouncement(ann);
        setAnnouncementContent(ann.content);
        setAnnouncementAuthor(ann.author || '');
        setAnnouncementImageUrl(ann.imageUrl || '');
    };

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        const data = { 
            content: announcementContent, 
            author: announcementAuthor,
            imageUrl: announcementImageUrl
        };
        
        const result = editingAnnouncement
            ? await updateAnnouncement(editingAnnouncement.id, data)
            : await createAnnouncement(data);

        if (result.success) {
            setEditingAnnouncement(null);
            setAnnouncementContent('');
            setAnnouncementImageUrl('');
            fetchAnnouncements();
        } else {
            alert('Failed to save announcement.');
        }
    };

    const handleAddAdminSubmit = async () => {
        if (!newAdminUid) return;
        const result = await addAdmin(newAdminUid);
        if (result.success) {
            alert('Admin added successfully.');
            setNewAdminUid('');
        } else {
            alert('Failed to add admin.');
        }
    };
    
    const handleUserSelect = (userToSelect) => {
        if (selectedUser && selectedUser.id === userToSelect.id) {
            setSelectedUser(null); // Toggle off if already selected
            setIsEditingUser(false);
        } else {
            setSelectedUser(userToSelect);
            setIsEditingUser(false); // Always start in view mode
        }
    }

    const handleEditUserSettings = () => {
        setEditableSettings({ ...selectedUser.settings });
        setIsEditingUser(true);
    };

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setEditableSettings(prev => ({...prev, [name]: value}));
    }
    
    const handleSaveUserSettings = async () => {
        if (!selectedUser) return;
        const result = await updateUserDoc(selectedUser.id, { settings: editableSettings });
        if(result.success) {
            setIsEditingUser(false);
            // Refresh user data to show updated info
            const updatedUsers = users.map(u => u.id === selectedUser.id ? {...u, settings: editableSettings } : u);
            setUsers(updatedUsers);
            setSelectedUser(prev => ({...prev, settings: editableSettings}));
            alert("User settings updated.");
        } else {
            alert("Failed to update user settings.");
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-GB', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Europe/London'
        }).format(date);
    };
    
    const renderSettingField = (label, value) => (
        <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{value || 'Not set'}</p>
        </div>
    );
    
    const renderEditableSetting = (name, label, options) => (
         <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">{label}</label>
            <select name={name} value={editableSettings?.[name] || ''} onChange={handleSettingsChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100">
                <option value="">Select...</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md md:max-w-4xl lg:max-w-6xl max-h-[90vh] flex flex-col">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
                            <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
                            <button onClick={() => handleTabChange('users')} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><Users size={16} /><span>Users</span></button>
                            <button onClick={() => handleTabChange('announcements')} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === 'announcements' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><Megaphone size={16} /><span>Announcements</span></button>
                            <button onClick={() => handleTabChange('staff')} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === 'staff' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><UserPlus size={16} /><span>Staff</span></button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 overflow-y-auto">
                        {isLoading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        
                        {activeTab === 'users' && !isLoading && (
                            <div className="space-y-2">
                                {users.map(u => (
                                    <div key={u.id}>
                                        <button onClick={() => handleUserSelect(u)} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg text-left">
                                            <div>
                                                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">{u.id}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Last Synced: {formatDate(u.lastSynced)}</p>
                                            </div>
                                            {selectedUser?.id === u.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        {selectedUser?.id === u.id && (
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg border-x border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-md">User Details</h4>
                                                    {!isEditingUser && <button onClick={handleEditUserSettings} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"><Edit size={14}/><span>Edit Settings</span></button>}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Settings:</h5>
                                                        {isEditingUser ? (
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Home Postcode</label>
                                                                    <input type="text" name="userPostcode" value={editableSettings?.userPostcode || ''} onChange={handleSettingsChange} className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"/>
                                                                </div>
                                                                 {renderEditableSetting('grade', 'Grade', GRADES)}
                                                                 {renderEditableSetting('band', 'Pay Band', Object.keys(PAY_BANDS))}
                                                                {editableSettings?.band && renderEditableSetting('step', 'Step Point', Object.keys(PAY_BANDS[editableSettings.band]))}
                                                                {renderEditableSetting('division', 'Division', DIVISIONS)}
                                                                {editableSettings?.division && renderEditableSetting('station', 'Base Station', DIVISIONS_AND_STATIONS[editableSettings.division]?.map(s => s.name) || [])}
                                                                 <div className="flex justify-end space-x-3 pt-2">
                                                                    <button onClick={() => setIsEditingUser(false)} className="px-3 py-1.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                                                                    <button onClick={handleSaveUserSettings} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"><Save size={14}/><span>Save</span></button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                                                                {renderSettingField('Postcode', selectedUser.settings?.userPostcode)}
                                                                {renderSettingField('Grade', selectedUser.settings?.grade)}
                                                                {renderSettingField('Pay Band', selectedUser.settings?.band)}
                                                                {renderSettingField('Step Point', selectedUser.settings?.step)}
                                                                {renderSettingField('Division', selectedUser.settings?.division)}
                                                                {renderSettingField('Base Station', selectedUser.settings?.station)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                         <h5 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Recent Entries:</h5>
                                                         <pre className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg text-xs max-h-60 overflow-y-auto">
                                                            {JSON.stringify(selectedUser.entries, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                                 <div className="mt-6 flex justify-end">
                                                    <button onClick={() => handleDeleteClick('user', u.id, u.id)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                                                        <Trash2 size={14}/>
                                                        <span>Remove User&apos;s Data</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                       {activeTab === 'announcements' && !isLoading && (
                            <div className="space-y-6">
                                <form onSubmit={handleAnnouncementSubmit} className="p-4 border border-gray-200 dark:border-gray-700/60 rounded-lg space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h3>
                                     <input type="text" value={announcementAuthor} onChange={(e) => setAnnouncementAuthor(e.target.value)} required placeholder="Author Name" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                                    <textarea value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} required placeholder="Announcement content..." className="w-full h-24 bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"></textarea>
                                    <input type="text" value={announcementImageUrl} onChange={(e) => setAnnouncementImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                                    <div className="flex justify-end space-x-3">
                                        {editingAnnouncement && <button type="button" onClick={() => { setEditingAnnouncement(null); setAnnouncementContent(''); setAnnouncementImageUrl(''); }} className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Cancel Edit</button>}
                                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editingAnnouncement ? 'Update' : 'Create'}</button>
                                    </div>
                                </form>
                                <div className="space-y-3">
                                    {announcements.map(ann => (
                                        <div key={ann.id} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                                            {ann.imageUrl && <Image src={ann.imageUrl} alt="Announcement" width={400} height={200} unoptimized className="rounded-md mb-2 max-h-48 w-full object-cover" />}
                                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{ann.content}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">By {ann.author} on {formatDate(ann.timestamp)}</p>
                                                <div className="space-x-1">
                                                     <button onClick={() => handleEditClick(ann)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"><Edit size={16}/></button>
                                                    <button onClick={() => handleDeleteClick('announcement', ann.id, 'this announcement')} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"><Trash2 size={16}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'staff' && !isLoading && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add New Admin</h3>
                                <div className="flex items-center space-x-2">
                                    <input type="text" value={newAdminUid} onChange={(e) => setNewAdminUid(e.target.value)} placeholder="Enter user's Google UID" className="w-full bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"/>
                                    <button onClick={handleAddAdminSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Add Admin</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {itemToDelete && (
                 <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 my-4">Are you sure you want to delete {itemToDelete.type} <strong className="font-mono">{itemToDelete.name}</strong>? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AdminModal;
