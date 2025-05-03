import React from 'react';
import { CompletionCode } from './CompletionCode';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { CheckCircle, Trophy, ArrowLeft } from 'lucide-react';
import { courseModules } from '../lib/courseData';
import certificateImage from '../public/certificate.png';

export const CompletionPage: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

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
            const { data: progress } = await supabase
                .from('user_progress')
                .select('module_id, completed');

            const progressMap: Record<string, boolean> = {};
            progress?.forEach(p => {
                if (p.module_id) progressMap[p.module_id] = !!p.completed;
            });

            setUserProgress(progressMap);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const isCourseCompleted = () => {
        return courseModules.every(module => userProgress[module.id]);
    };

    if (!userId || loading) {
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
                <h1 className="text-3xl font-bold text-gray-900">Course Completion</h1>
            </div>

            {isCourseCompleted() ? (
                <div className="space-y-8">
                    {/* Certificate Display */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations! 🎉</h2>
                                <p className="text-lg text-gray-600">You have successfully completed the TouRide course</p>
                            </div>

                            {/* Certificate Image */}
                            <div className="max-w-2xl mx-auto mb-8">
                                <img 
                                    src="certificate.png" 
                                    alt="Certificate" 
                                    className="w-full rounded-lg shadow-md"
                                />
                            </div>

                            {/* QR Code */}
                            <div className="text-center">
                                <div className="inline-block p-4 bg-gray-100 rounded-lg">
                                    <img 
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TouRideCertificate123" 
                                        alt="Certificate QR Code" 
                                        className="w-32 h-32 mx-auto"
                                    />
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    Present this QR code to insurance/rental companies for verification
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Completion Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Completed On</p>
                                <p className="font-medium">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Certificate ID</p>
                                <p className="font-medium">{userId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                            Complete all modules to receive your completion certificate.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}; 