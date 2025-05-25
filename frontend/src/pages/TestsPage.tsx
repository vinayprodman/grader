import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { useFirestore, Test } from '../hooks/useFirestore';
import Logo from '../components/Logo';

const TestsPage: React.FC = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTests, loading, error } = useFirestore();
  const [tests, setTests] = useState<Test[]>([]);
  const [chapterName, setChapterName] = useState('');
  
  useEffect(() => {
    const loadTests = async () => {
      if (user && chapterId) {
        // For demo, we set a hardcoded chapter name
        // In a real app, you would fetch this from Firestore
        setChapterName(`Chapter ${chapterId.split('-')[1] || ''}`);
        
        const testData = await getTests(chapterId);
        setTests(testData);
      }
    };
    
    loadTests();
  }, [user, chapterId, getTests]);
  
  // Placeholder tests for initial display
  const placeholderTests = [
    {
      id: 'test-1',
      name: 'Test 1',
      description: 'Basic concepts quiz',
      chapterId: chapterId || '',
      subjectId: subjectId || '',
      duration: 15,
      totalQuestions: 10,
      locked: false
    },
    {
      id: 'test-2',
      name: 'Test 2',
      description: 'Intermediate assessment',
      chapterId: chapterId || '',
      subjectId: subjectId || '',
      duration: 20,
      totalQuestions: 15,
      locked: true
    },
    {
      id: 'test-3',
      name: 'Test 3',
      description: 'Advanced evaluation',
      chapterId: chapterId || '',
      subjectId: subjectId || '',
      duration: 30,
      totalQuestions: 20,
      locked: true
    }
  ];

  // If no tests from Firestore, use placeholders
  const displayTests = tests.length > 0 ? tests : placeholderTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => navigate(`/subjects/${subjectId}/chapters`)} 
          className="text-gray-600 mr-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Logo size="sm" />
        <h1 className="text-xl font-bold ml-4">{chapterName}</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tests</h2>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grader-green"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
              Error loading tests. Please try again.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayTests.map((test) => (
                <div
                  key={test.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    !test.locked ? 'card-hover animate-slide-up' : 'opacity-70'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {test.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {test.duration} min
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{test.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {test.totalQuestions} questions
                      </div>
                      
                      {test.locked ? (
                        <div className="text-gray-400 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-sm">Locked</span>
                        </div>
                      ) : (
                        <Link 
                          to={`/tests/${test.id}`} 
                          className="bg-grader-green hover:bg-grader-green/90 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                          Start Test
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Test Instructions */}
          <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-md animate-fade-in">
            <h3 className="text-md font-semibold text-amber-800">Test Instructions</h3>
            <ul className="text-amber-700 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Complete tests in order to unlock the next one</li>
              <li>You must answer all questions to submit a test</li>
              <li>A timer will show remaining time for timed tests</li>
              <li>Your results will be available immediately after completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
