import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { courseModules } from '../lib/courseData';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function CourseModule() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [isLastModule, setIsLastModule] = useState(false);

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
  }, [moduleId]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleQuizSubmit = async () => {
    const correctAnswers = currentModule.quiz.reduce((acc, q, index) => {
      return acc + (selectedAnswers[index] === q.correctAnswer ? 1 : 0);
    }, 0);
    
    const passThreshold = currentModule.quiz.length * 0.7;
    const passed = correctAnswers >= passThreshold;
    
    setQuizPassed(passed);
    setQuizSubmitted(true);

    if (passed) {
      try {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: (await supabase.auth.getUser()).data.user.id,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  if (!currentModule) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{currentModule.title}</h1>
      
      {!showQuiz ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700">{currentModule.content}</div>
          </div>

          <button
            onClick={() => setShowQuiz(true)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Take Quiz to Complete Module
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Quiz</h2>
          
          {currentModule.quiz.map((question, qIndex) => (
            <div key={qIndex} className="mb-8">
              <p className="text-lg font-medium text-gray-900 mb-4">{question.question}</p>
              <div className="space-y-3">
                {question.options.map((option, aIndex) => (
                  <label
                    key={aIndex}
                    className={`flex items-center p-4 rounded-lg border ${
                      selectedAnswers[qIndex] === aIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${quizSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={aIndex}
                      checked={selectedAnswers[qIndex] === aIndex}
                      onChange={() => !quizSubmitted && handleAnswerSelect(qIndex, aIndex)}
                      disabled={quizSubmitted}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              Submit Quiz
            </button>
          ) : (
            <div className={`p-4 rounded-lg ${quizPassed ? 'bg-green-100' : 'bg-red-100'} mb-6`}>
              <div className="flex items-center">
                {quizPassed ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                )}
                <p className={quizPassed ? 'text-green-700' : 'text-red-700'}>
                  {quizPassed
                    ? isLastModule 
                      ? 'Congratulations! You have completed all modules! You now have a good understanding of Canadian driving rules and regulations.'
                      : 'Congratulations! You have passed the quiz and completed this module.'
                    : 'You did not pass the quiz. Please review the material and try again.'}
                </p>
              </div>
            </div>
          )}

          {quizSubmitted && (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
}