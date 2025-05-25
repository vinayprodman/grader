import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { useFirestore, Chapter } from '../hooks/useFirestore';
import Logo from '../components/Logo';
import { RippleButton } from '../components/ui/ripple-button';

const ChaptersPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChapters, loading, error } = useFirestore();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjectName, setSubjectName] = useState('');
  
  useEffect(() => {
    const loadChapters = async () => {
      if (user && subjectId) {
        // For demo purposes, we set hardcoded subject names
        // In a real app, you would fetch this from Firestore
        const subjectNames: Record<string, string> = {
          'math': 'Mathematics',
          'science': 'Science',
          'english': 'English',
          'history': 'History'
        };
        
        setSubjectName(subjectNames[subjectId] || 'Subject');
        
        const chapterData = await getChapters(subjectId);
        setChapters(chapterData);
      }
    };
    
    loadChapters();
  }, [user, subjectId, getChapters]);
  
  // Placeholder chapters for initial display
  const placeholderChapters = [
    {
      id: 'chapter-1',
      name: 'Chapter 1',
      description: 'Introduction and fundamentals',
      subjectId: subjectId || '',
      order: 1,
      locked: false
    },
    {
      id: 'chapter-2',
      name: 'Chapter 2',
      description: 'Building on basics',
      subjectId: subjectId || '',
      order: 2,
      locked: true
    },
    {
      id: 'chapter-3',
      name: 'Chapter 3',
      description: 'Advanced concepts',
      subjectId: subjectId || '',
      order: 3,
      locked: true
    },
    {
      id: 'chapter-4',
      name: 'Chapter 4',
      description: 'Mastery and application',
      subjectId: subjectId || '',
      order: 4,
      locked: true
    }
  ];

  // If no chapters from Firestore, use placeholders
  const displayChapters = chapters.length > 0 ? chapters : placeholderChapters;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Logo size="sm" />
        <h1 className="text-xl font-bold ml-4">{subjectName}</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chapters</h2>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
              Error loading chapters. Please try again.
            </div>
          ) : (
            <div className="space-y-4">
              {displayChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    !chapter.locked ? 'card-hover animate-slide-up' : 'opacity-70'
                  }`}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {chapter.name}
                      </h3>
                      <p className="text-gray-600 mt-1">{chapter.description}</p>
                    </div>
                    
                    {chapter.locked ? (
                      <div className="text-gray-400 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Locked</span>
                      </div>
                    ) : (
                      <Link to={`/subjects/${subjectId}/chapters/${chapter.id}/tests`}>
                        <RippleButton variant="primary" className="bg-purple-400 hover:bg-purple-500">
                          View Tests
                        </RippleButton>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Chapter Unlock Instructions */}
          <div className="mt-8 bg-purple-50 border border-purple-200 p-4 rounded-md animate-fade-in">
            <h3 className="text-md font-semibold text-purple-700">How to Unlock Chapters</h3>
            <p className="text-purple-600 text-sm mt-1">
              Complete tests in the previous chapter to unlock new chapters. Each chapter builds on 
              skills from previous ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChaptersPage;
