import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Settings, User, Edit, Eye, UploadCloud, Trash2, MoreVertical } from 'lucide-react';
import AddQuestionModal from './AddQuestionModal';
import SubmissionsModal from './SubmissionsModal';
import SubmissionDetailModal from './SubmissionDetailModal';

const Admin = ({ questions, leaderboard, onAddQuestion, onUpdateQuestion, onDeleteQuestion }) => {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [activeMenuId, setActiveMenuId] = React.useState(null);
    const [editingQuestion, setEditingQuestion] = React.useState(null);
    const [viewingSubmissionsId, setViewingSubmissionsId] = React.useState(null);
    const [selectedSubmission, setSelectedSubmission] = React.useState(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleActionClick = (e, id) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setIsAddModalOpen(true);
        setActiveMenuId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            onDeleteQuestion(id);
        }
        setActiveMenuId(null);
    };

    const handleToggleStatus = (question) => {
        onUpdateQuestion({
            ...question,
            status: question.status === 'Draft' ? 'Active' : 'Draft'
        });
        setActiveMenuId(null);
    };

    const handleViewSubmissions = (id) => {
        setViewingSubmissionsId(id);
        setActiveMenuId(null);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Question Management */}
                <div className="md:col-span-7">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Problem Management</h2>
                        <button
                            onClick={() => {
                                setEditingQuestion(null);
                                setIsAddModalOpen(true);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <PlusCircle size={18} /> Add New Question
                        </button>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible"> {/* overflow-visible for dropdown */}
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Problem</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Difficulty</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Points</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {questions.map(q => (
                                    <tr key={q.id} className="hover:bg-slate-800/30 transition-colors relative">
                                        <td className="px-6 py-4 font-semibold text-white">{q.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                            {q.status === 'Draft' && (
                                                <span className="ml-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-slate-700 text-slate-300">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-indigo-400">{q.points}</td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => handleActionClick(e, q.id)}
                                                className={`transition-colors p-1 rounded-md ${activeMenuId === q.id ? 'text-white bg-slate-800' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                <Settings size={18} />
                                            </button>

                                            {/* Context Menu */}
                                            {activeMenuId === q.id && (
                                                <div className="absolute right-8 top-8 z-50 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1">
                                                    <button
                                                        onClick={() => handleEdit(q)}
                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                    >
                                                        <Edit size={16} /> Edit Problem
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewSubmissions(q.id)}
                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                    >
                                                        <Eye size={16} /> View Submissions
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(q)}
                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                    >
                                                        <UploadCloud size={16} /> {q.status === 'Draft' ? 'Publish Now' : 'Unpublish'}
                                                    </button>
                                                    <div className="h-px bg-slate-800 my-1" />
                                                    <button
                                                        onClick={() => handleDelete(q.id)}
                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <Trash2 size={16} /> Delete Problem
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Global User Stats & Violations */}
                <div className="md:col-span-5">
                    <h2 className="text-2xl font-bold text-white mb-6">Participant Audit</h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="space-y-4">
                            {leaderboard.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                            <User size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{u.name}</div>
                                            <div className="text-xs text-slate-500">Score: {u.score}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold uppercase tracking-widest ${u.violations > 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                                            {u.violations} Violations
                                        </div>
                                        <button className="text-[10px] text-indigo-400 font-bold hover:underline mt-1">VIEW LOGS</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddQuestionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(data) => {
                    if (editingQuestion) {
                        onUpdateQuestion(data);
                    } else {
                        onAddQuestion(data);
                    }
                }}
                initialData={editingQuestion}
            />

            <SubmissionsModal
                isOpen={!!viewingSubmissionsId}
                onClose={() => setViewingSubmissionsId(null)}
                question={questions.find(q => q.id === viewingSubmissionsId)}
                onViewDetail={(sub) => {
                    setViewingSubmissionsId(null);
                    setSelectedSubmission({ ...sub, _questionId: viewingSubmissionsId });
                }}
            />

            <SubmissionDetailModal
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
                submission={selectedSubmission}
                onBack={() => {
                    if (selectedSubmission?._questionId) {
                        setViewingSubmissionsId(selectedSubmission._questionId);
                    }
                    setSelectedSubmission(null);
                }}
            />
        </motion.div>
    );
};

export default Admin;
