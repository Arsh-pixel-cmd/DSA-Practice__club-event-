/**
 * MOCK SERVER ACTION: executeCode
 * This represents your Next.js Server Action proxying to Judge0
 */
export const executeCodeAction = async (sourceCode, languageId) => {
    // In production, this would be: 
    // const res = await fetch('/api/execute', { method: 'POST', body: JSON.stringify({ sourceCode, languageId }) });
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        stdout: "Test Case 1: Passed\nTest Case 2: Passed\n>> Output: Hello World",
        time: "0.045",
        memory: "2048",
        status: { id: 3, description: "Accepted" }
    };
};
