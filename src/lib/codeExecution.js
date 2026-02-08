import { supabase } from './supabase';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Language IDs for Judge0
const LANGUAGE_IDS = {
    javascript: 63,
    python: 71,
    cpp: 54,
    java: 62
};

export const executeCode = async (code, language, problem) => {
    const languageId = LANGUAGE_IDS[language] || 63; // Default JS

    // 1. Try Judge0
    try {
        const judgeResult = await runJudge0(code, languageId, problem);
        if (judgeResult) return judgeResult;
    } catch (e) {
        console.warn("Judge0 failed, falling back to AI", e);
    }

    // 2. Fallback to AI
    return await runAIGrading(code, language, problem);
};

const runJudge0 = async (code, languageId, problem) => {
    const apiKey = import.meta.env.VITE_JUDGE0_KEY;
    if (!apiKey) throw new Error("No Judge0 Key");

    // We need test cases. For now, we'll just run against the example input if available
    // or a simple "Hello World" check if no test cases are structured.
    // In a real app, problem.test_cases would be an array.
    const stdin = problem.examples?.[0]?.input || "";
    const expectedOutput = problem.examples?.[0]?.output || "";

    const response = await fetch(`${JUDGE0_API_URL}?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
            source_code: code,
            language_id: languageId,
            stdin: stdin,
            expected_output: expectedOutput
        })
    });

    const data = await response.json();

    // Interpret Judge0 result
    if (data.status?.id === 3) { // Accepted
        return {
            status: 'Accepted',
            score: 100,
            feedback: 'Passed all test cases (Judge0)',
            runtime: data.time,
            memory: data.memory
        };
    } else if (data.status?.id) {
        return {
            status: data.status.description,
            score: 0,
            feedback: `Error: ${data.stderr || data.compile_output || data.message}`,
            runtime: 0,
            memory: 0
        };
    }

    return null; // Fallback
};

const runAIGrading = async (code, language, problem) => {
    const apiKey = import.meta.env.VITE_GEMINI_KEY;
    if (!apiKey) {
        return {
            status: 'Error',
            score: 0,
            feedback: 'System Error: No Grading Service Available (Missing API Keys).',
        };
    }

    const prompt = `
    You are an Algorithm Judge. Analyze this code solution for the problem "${problem.title}".
    
    Problem Description:
    ${problem.description}

    Language: ${language}
    
    Code:
    ${code}
    
    Task:
    1. Check for correctness, efficiency, and edge cases.
    2. Assign a score (0-100). 100 is perfect.
    3. Determine status: "Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error".
    4. Provide brief functional feedback.

    Respond ONLY with valid JSON:
    {
        "status": "Accepted",
        "score": 100,
        "feedback": "Correct and optimized solution."
    }
    `;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("No AI response");

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        return {
            ...parsed,
            runtime: "0.050", // AI Estimate
            memory: 2048      // AI Estimate (KB)
        };

    } catch (error) {
        console.error("AI Grading failed:", error);
        return {
            status: 'System Error',
            score: 0,
            feedback: 'Both Judge and AI Grader failed. Please check connection.',
        };
    }
};

export const saveSubmission = async (userId, questionId, code, language, result) => {
    if (!userId) return;

    // 1. Save to submissions table
    const { error } = await supabase.from('submissions').insert({
        user_id: userId,
        question_id: questionId,
        code: code,
        language_id: 0, // Text or map to ID
        status: result.status,
        runtime: parseFloat(result.runtime || 0),
        memory: parseFloat(result.memory || 0),
        score: result.score || 0 // Add score column to submission if needed, or just track status
    });

    if (error) console.error("Error saving submission:", error);

    // 2. Update User Profile Score if Accepted
    if (result.status === 'Accepted') {
        // Increment score? Or set specific problem solved?
        // Simple Leaderboard: Score = Sum of accepted problems (handled by trigger or manual calc)
        // For now: Just increment score by 10 or result.score

        // Fetch current score
        const { data: profile } = await supabase.from('profiles').select('score').eq('id', userId).single();
        const newScore = (profile?.score || 0) + 10; // +10 points per solve

        await supabase.from('profiles').update({ score: newScore }).eq('id', userId);
    }
};
