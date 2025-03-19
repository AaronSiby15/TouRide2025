import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { generateUniqueCompletionCode, saveCompletionCode } from '../lib/completionCode';

interface CompletionCodeProps {
    userId: string;
    onCourseComplete: () => void;
}

export const CompletionCode: React.FC<CompletionCodeProps> = ({ userId, onCourseComplete }) => {
    const [completionCode, setCompletionCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateAndSaveCode = async () => {
            try {
                const code = await generateUniqueCompletionCode(supabase);
                const result = await saveCompletionCode(supabase, userId, code);
                
                if (result.success) {
                    setCompletionCode(code);
                    onCourseComplete();
                } else {
                    setError('Failed to save completion code');
                }
            } catch (err) {
                setError('An error occurred while generating your completion code');
            } finally {
                setLoading(false);
            }
        };

        generateAndSaveCode();
    }, [userId, onCourseComplete]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Congratulations! 🎉
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Completion Code:</p>
                <div className="bg-white border-2 border-blue-500 rounded p-3">
                    <code className="text-2xl font-mono text-blue-600 tracking-wider">
                        {completionCode}
                    </code>
                </div>
            </div>
            <div className="text-sm text-gray-600">
                <p className="mb-2">Please save this code. You can use it to:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Verify your course completion</li>
                    <li>Access additional resources</li>
                    <li>Share your achievement</li>
                </ul>
            </div>
        </div>
    );
}; 