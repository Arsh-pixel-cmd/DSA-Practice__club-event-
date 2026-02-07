/**
 * Execute code using Judge0 API
 * @param {string} sourceCode - The source code to execute
 * @param {number} languageId - Judge0 language ID (54=C++, 62=Java, 71=Python, 63=JavaScript)
 * @returns {Promise<Object>} Execution result with stdout, stderr, status, time, memory
 */
export const executeCodeAction = async (sourceCode, languageId) => {
    // Judge0 API endpoint - use RapidAPI or self-hosted instance
    // For RapidAPI: https://judge0-ce.p.rapidapi.com/submissions
    // For self-hosted: http://your-judge0-instance/submissions
    const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
    const USE_RAPIDAPI = import.meta.env.VITE_USE_RAPIDAPI === 'true';

    try {
        // Submit code for execution
        const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true&fields=*`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(USE_RAPIDAPI && RAPIDAPI_KEY ? {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                } : {}),
            },
            body: JSON.stringify({
                source_code: sourceCode,
                language_id: languageId,
                stdin: '', // You can add test input here if needed
            }),
        });

        if (!submitResponse.ok) {
            const errorText = await submitResponse.text();
            throw new Error(`Judge0 API error: ${submitResponse.status} - ${errorText}`);
        }

        const result = await submitResponse.json();

        // Map Judge0 status codes to our format
        // Status ID 3 = Accepted, others are various errors
        return {
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            compile_output: result.compile_output || '',
            message: result.message || '',
            time: result.time || '0.000',
            memory: result.memory || '0',
            status: {
                id: result.status?.id || 0,
                description: result.status?.description || 'Unknown',
            },
        };
    } catch (error) {
        console.error('Code execution error:', error);
        return {
            stdout: '',
            stderr: error.message,
            compile_output: '',
            message: 'Execution failed',
            time: '0.000',
            memory: '0',
            status: {
                id: 0,
                description: `Error: ${error.message}`,
            },
        };
    }
};
