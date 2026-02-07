import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CheckCircle, Save } from 'lucide-react';
import { LANGUAGES } from '../../lib/constants';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const AddQuestionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    // Default initial state
    const DEFAULT_FORM_DATA = {
        title: '',
        description: '',
        difficulty: 'Easy',
        points: 100,
        topics: [],
        examples: [{ input: '', output: '' }],
        constraints: '',
        allowedLanguages: LANGUAGES.reduce((acc, lang) => ({ ...acc, [lang.name]: true }), {}),
        timeLimit: '1.5',
        memoryLimit: '256',
        isPublic: true
    };

    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    // Load initial data when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                ...DEFAULT_FORM_DATA, // Start with defaults
                ...initialData,       // Override with actual data
                // Ensure complex objects are merged/copied correctly if missing
                topics: initialData.topics || [],
                examples: (initialData.examples && initialData.examples.length > 0) ? initialData.examples : [{ input: '', output: '' }],
                allowedLanguages: initialData.allowedLanguages || DEFAULT_FORM_DATA.allowedLanguages,
                isPublic: initialData.status !== 'Draft'
            });
        } else if (isOpen && !initialData) {
            setFormData(DEFAULT_FORM_DATA);
        }
    }, [isOpen, initialData]);

    const TOPICS_LIST = ['Array', 'String', 'Stack', 'Queue', 'Tree', 'Graph', 'DP', 'Greedy', 'Recursion', 'Backtracking'];

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTopicToggle = (topic) => {
        setFormData(prev => {
            const current = prev.topics.includes(topic)
                ? prev.topics.filter(t => t !== topic)
                : [...prev.topics, topic];
            return { ...prev, topics: current };
        });
    };

    const handleExampleChange = (index, field, value) => {
        const newExamples = [...formData.examples];
        newExamples[index][field] = value;
        setFormData(prev => ({ ...prev, examples: newExamples }));
    };

    const addExample = () => {
        setFormData(prev => ({ ...prev, examples: [...prev.examples, { input: '', output: '' }] }));
    };

    const removeExample = (index) => {
        if (formData.examples.length > 1) {
            const newExamples = formData.examples.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, examples: newExamples }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic Validation
        if (!formData.title || !formData.description) return;

        onSave({
            ...formData,
            id: initialData ? initialData.id : Date.now(), // Use existing ID if editing
            points: parseInt(formData.points),
            status: formData.isPublic ? 'Active' : 'Draft'
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                            <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Question' : 'Add New Question'}</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <form id="add-question-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                {/* Left Column: Main Content */}
                                <div className="md:col-span-8 space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Problem Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter problem title..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter problem description...\n\nYou can use formatting like:\n• Bullet points\n• **Bold text**\n• Code blocks"
                                            className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono text-sm"
                                            required
                                        />
                                        <p className="text-xs text-slate-500">Supports basic markdown formatting</p>
                                    </div>

                                    {/* Examples */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-slate-400">Examples</label>
                                            <button
                                                type="button"
                                                onClick={addExample}
                                                className="text-indigo-400 text-xs font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                                            >
                                                <Plus size={14} /> Add Example
                                            </button>
                                        </div>

                                        {formData.examples.map((ex, idx) => (
                                            <div key={idx} className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-3 group relative">
                                                {formData.examples.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExample(idx)}
                                                        className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Example {idx + 1}</div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <div>
                                                        <label className="text-xs text-slate-500 mb-1 block">Input</label>
                                                        <input
                                                            type="text"
                                                            value={ex.input}
                                                            onChange={(e) => handleExampleChange(idx, 'input', e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none font-mono"
                                                            placeholder="nums = [2,7,11,15], target = 9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-500 mb-1 block">Output</label>
                                                        <input
                                                            type="text"
                                                            value={ex.output}
                                                            onChange={(e) => handleExampleChange(idx, 'output', e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none font-mono"
                                                            placeholder="[0,1]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Constraints */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Constraints</label>
                                        <textarea
                                            name="constraints"
                                            value={formData.constraints}
                                            onChange={handleInputChange}
                                            placeholder="2 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9"
                                            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Meta & Settings */}
                                <div className="md:col-span-4 space-y-6">
                                    {/* Difficulty */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Difficulty</label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                        >
                                            {DIFFICULTY_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Points */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Points</label>
                                        <input
                                            type="number"
                                            name="points"
                                            value={formData.points}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    {/* Topics */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Topics (Multi-select)</label>
                                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto custom-scrollbar">
                                            <div className="space-y-2">
                                                {TOPICS_LIST.map(topic => (
                                                    <label key={topic} className="flex items-center space-x-3 cursor-pointer group">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.topics.includes(topic) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-700 group-hover:border-slate-600'}`}>
                                                            {formData.topics.includes(topic) && <CheckCircle size={12} className="text-white" />}
                                                        </div>
                                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{topic}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.topics.includes(topic)}
                                                            onChange={() => handleTopicToggle(topic)}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Limits */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Time Limit</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="timeLimit"
                                                    value={formData.timeLimit}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                                />
                                                <span className="absolute right-3 top-3 text-xs text-slate-500 font-bold">sec</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">Memory Limit</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="memoryLimit"
                                                    value={formData.memoryLimit}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                                />
                                                <span className="absolute right-3 top-3 text-xs text-slate-500 font-bold">MB</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visibility */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Visibility</label>
                                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                                            <label className="flex items-start space-x-3 cursor-pointer">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${formData.isPublic ? 'border-emerald-500' : 'border-slate-700'}`}>
                                                    {formData.isPublic && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-white">Public</span>
                                                    <span className="block text-xs text-slate-500">Students can see this problem</span>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    checked={formData.isPublic}
                                                    onChange={() => setFormData(p => ({ ...p, isPublic: true }))}
                                                    className="hidden"
                                                />
                                            </label>
                                            <label className="flex items-start space-x-3 cursor-pointer">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${!formData.isPublic ? 'border-slate-500' : 'border-slate-700'}`}>
                                                    {!formData.isPublic && <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />}
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-white">Draft</span>
                                                    <span className="block text-xs text-slate-500">Only visible to admins</span>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    checked={!formData.isPublic}
                                                    onChange={() => setFormData(p => ({ ...p, isPublic: false }))}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center p-6 border-t border-slate-800 bg-slate-900/50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!formData.title) return; // Basic check
                                        onSave({
                                            ...formData,
                                            id: Date.now(),
                                            points: parseInt(formData.points) || 0,
                                            status: 'Draft'
                                        });
                                        onClose();
                                    }}
                                    className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors"
                                >
                                    Save as Draft
                                </button>
                                <button
                                    type="submit"
                                    form="add-question-form"
                                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                                >
                                    <Save size={18} /> {initialData ? 'Save Changes' : 'Save & Publish'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence >
    );
};

export default AddQuestionModal;
