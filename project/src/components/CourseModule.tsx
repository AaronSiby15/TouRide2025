import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { courseModules, Module } from '../lib/courseData';
import { CheckCircle, AlertCircle, Clock, BookOpen, Snowflake, AlertTriangle, Car, ChevronRight, ImageIcon } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface BulletPointProps {
  children: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, icon, children }) => (
  <div className="mb-12 last:mb-0">
    <div className="flex items-center space-x-3 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="pl-8">
      {children}
    </div>
  </div>
);

const BulletPoint: React.FC<BulletPointProps> = ({ children }) => (
  <div className="flex items-start space-x-3 mb-2 last:mb-0">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
    <span className="text-gray-700">{children}</span>
  </div>
);

const SubBulletPoint: React.FC<BulletPointProps> = ({ children }) => (
  <div className="flex items-start space-x-3 mb-2 last:mb-0 ml-6">
    <div className="w-1 h-1 rounded-full bg-gray-400 mt-2"></div>
    <span className="text-gray-600">{children}</span>
  </div>
);

// Update image mapping with absolute paths from root
const moduleImages = {
  road_signs: '../road-signs.png',
  traffic_direction: '../traffic-direction.png',
  speed_limits: '../images/speed-limits.png',
  rightofway: '../images/rightofway.png',
  parkingrules: '../images/parkingrules.png',
  safedistance: '../images/safedistance.png',
  impaireddriving: '../images/impaireddriving.png',
  snowstorm: '../images/snowstorm.png',
  emergencylight: '../images/emergencylight.png',
  merge: '../images/merge.png',
  workhighway: '../images/workhighway.png',
  highway: '../images/highway.png',
  emergencyvehicle: '../images/emergencyvehicle.png',
  school: '../images/school.png',
  nightdrive: '../images/night drive.png',
  impairement: '../images/impairement.png',
  distracteddriving: '../images/distracteddriving.png',
  fatigue: '../images/fatigue.png',
  driving: '../images/driving.png',
  insurance: '../images/insurance.png',
  license: '../images/license.png',
  cyclist: '../images/cyclist.png',
  pedestrian: '../images/pedestrian.png',
  publictransportation: '../images/public-transportation.png',
  moveover: '../images/moveover.png',
  roundabout: '../images/roundabout.png',
  schoolzones: '../images/school-zones.png'
};

export default function CourseModule() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [isLastModule, setIsLastModule] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const module = courseModules.find(m => m.id === moduleId);
    if (!module) {
      navigate('/dashboard');
      return;
    }
    setCurrentModule(module);
    setIsLastModule(moduleId === courseModules[courseModules.length - 1].id);
    setShowQuiz(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setShowContent(true);
  }, [moduleId, navigate]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number): void => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleQuizSubmit = async (): Promise<void> => {
    if (!currentModule) return;

    const correctAnswers = currentModule.quiz.reduce((acc: number, q, index) => {
      return acc + (selectedAnswers[index] === q.correctAnswer ? 1 : 0);
    }, 0);

    const passThreshold = currentModule.quiz.length * 0.7;
    const passed = correctAnswers >= passThreshold;

    setQuizPassed(passed);
    setQuizSubmitted(true);

    if (passed) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    let currentSection: string | null = null;
    let sectionContent: React.ReactNode[] = [];

    const result = lines.map((line, index) => {
      if (line.match(/^\d\./)) { // Main section headers
        const prevSection = currentSection;
        const prevContent = [...sectionContent];
        currentSection = line.split('. ')[1];
        sectionContent = [];

        const icon = {
          'Winter Driving': <Snowflake className="h-6 w-6 text-blue-500" />,
          'Emergency Procedures': <AlertTriangle className="h-6 w-6 text-orange-500" />,
          'Impaired Driving': <Car className="h-6 w-6 text-red-500" />
        }[currentSection] || <div className="h-6 w-6" />;

        if (prevSection) {
          return (
            <ContentSection key={`section-${index}`} title={prevSection} icon={icon}>
              {prevContent}
            </ContentSection>
          );
        }
        return null;
      } else if (line.startsWith('[IMAGE:')) { // Handle images
        const imageName = line.match(/\[IMAGE: (.*?)\]/)?.[1];
        if (imageName && moduleImages[imageName as keyof typeof moduleImages]) {
          const imagePath = moduleImages[imageName as keyof typeof moduleImages];
          console.log('Attempting to load image:', imagePath); // Debug log
          sectionContent.push(
            <div key={`image-${index}`} className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              <div className="p-6 bg-white">
                <img
                  src={imagePath}
                  alt={imageName.replace(/_/g, ' ')}
                  className="w-full h-auto object-contain max-h-[400px]"
                  onLoad={() => console.log('Image loaded successfully:', imagePath)} // Debug log
                  onError={(e) => {
                    console.error(`Error loading image: ${imageName}, path: ${imagePath}`);
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                  }}
                  style={{ backgroundColor: '#f8fafc' }}
                />
              </div>
            </div>
          );
        }
        return null;
      } else if (line.startsWith('- ')) { // Main bullet points
        sectionContent.push(<BulletPoint key={`bullet-${index}`}>{line.substring(2)}</BulletPoint>);
        return null;
      } else if (line.startsWith('  • ')) { // Sub bullet points
        sectionContent.push(<SubBulletPoint key={`sub-${index}`}>{line.substring(4)}</SubBulletPoint>);
        return null;
      } else if (line.trim() && !line.startsWith('-')) { // Regular text
        sectionContent.push(
          <p key={`text-${index}`} className="text-gray-700 mb-4 last:mb-0">
            {line}
          </p>
        );
        return null;
      }
      return null;
    });

    // Add the last section if it exists
    if (currentSection) {
      const icon = {
        'Winter Driving': <Snowflake className="h-6 w-6 text-blue-500" />,
        'Emergency Procedures': <AlertTriangle className="h-6 w-6 text-orange-500" />,
        'Impaired Driving': <Car className="h-6 w-6 text-red-500" />
      }[currentSection] || <div className="h-6 w-6" />;

      result.push(
        <ContentSection key="last-section" title={currentSection} icon={icon}>
          {sectionContent}
        </ContentSection>
      );
    }

    return result.filter(Boolean);
  };

  if (!currentModule) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Module Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden mb-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="px-8 py-10 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 text-white/95">{currentModule.title}</h1>
                <p className="text-blue-100 text-lg font-medium">Master essential procedures for safe driving</p>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
                <Clock className="h-6 w-6 mr-2 text-blue-200" />
                <span className="text-lg font-medium">{currentModule.duration} minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Content or Quiz */}
        <div className="space-y-8">
          {!showQuiz ? (
            <div className="space-y-8">
              {showContent && (
                <>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 bg-blue-100/50 backdrop-blur-sm rounded-xl">
                      <BookOpen className="h-7 w-7 text-blue-600" />
                    </div>
                    <span className="font-semibold text-xl text-gray-800">Learning Material</span>
                  </div>
                  <div className="prose max-w-none space-y-8">
                    {renderContent(currentModule.content)}
                  </div>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="mt-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <span className="text-lg">Take Quiz to Complete Module</span>
                    <CheckCircle className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Quiz</h2>

              {currentModule.quiz.map((question, qIndex) => (
                <div key={qIndex} className="bg-gray-50 rounded-lg p-6">
                  <p className="text-lg font-medium text-gray-900 mb-4">
                    {qIndex + 1}. {question.question}
                  </p>
                  <div className="space-y-3">
                    {question.options.map((option, aIndex) => (
                      <label
                        key={aIndex}
                        className={`flex items-center p-4 rounded-lg border transition-all ${selectedAnswers[qIndex] === aIndex
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                          : 'border-gray-200 hover:bg-gray-50'
                          } ${quizSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={selectedAnswers[qIndex] === aIndex}
                          onChange={() => handleAnswerSelect(qIndex, aIndex)}
                          disabled={quizSubmitted}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length !== currentModule.quiz.length}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className={`p-6 rounded-lg ${quizPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center">
                    {quizPassed ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                    )}
                    <p className={`font-medium ${quizPassed ? 'text-green-700' : 'text-red-700'}`}>
                      {quizPassed
                        ? isLastModule
                          ? 'Congratulations! You have completed all modules! You now have a good understanding of Canadian driving rules and regulations.'
                          : 'Congratulations! You have passed the quiz and completed this module.'
                        : 'You did not pass the quiz. Please review the material and try again.'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-6 w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}