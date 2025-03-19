import React from 'react';
import { CompletionCode } from './CompletionCode';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { CheckCircle, Trophy, ArrowLeft } from 'lucide-react';

export const CompletionPage: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [progress, setProgress] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                fetchUserProgress(user.id);
            }
        };
        getUser();
    }, []);

    const fetchUserProgress = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            setProgress(data);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const handleCourseComplete = async () => {
        try {
            const { error } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    course_completed: true,
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;
            fetchUserProgress(userId!);
        } catch (error) {
            console.error('Error updating course completion:', error);
        }
    };

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Course Progress</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Course Completion Status</h2>
                                <p className="text-sm text-gray-500">
                                    {progress?.course_completed 
                                        ? 'Congratulations! You have completed the course.'
                                        : 'Continue learning to complete the course.'}
                                </p>
                            </div>
                        </div>
                        {progress?.course_completed && (
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                                Completed
                            </div>
                        )}
                    </div>

                    {progress?.course_completed ? (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Completion Certificate</h3>
                                <CompletionCode 
                                    userId={userId}
                                    onCourseComplete={handleCourseComplete}
                                />
                            </div>
                            
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Completed On</p>
                                        <p className="font-medium">
                                            {new Date(progress.completed_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Certificate ID</p>
                                        <p className="font-medium">{progress.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">
                                Complete all modules to receive your completion certificate.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 