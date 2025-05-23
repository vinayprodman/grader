import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadChapter, loadChapterQuizzes } from '../../utils/dataLoader.tsx';
import { Chapter, Quiz } from '../../types/education';
import { ArrowLeft, Play, Lock } from 'lucide-react';

const ChapterDetail: React.FC = () => {
  const { grade, subjectId, chapterId } = useParams<{ grade: string; subjectId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingQuiz, setPendingQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        if (!grade || !subjectId || !chapterId) {
          throw new Error('Missing required parameters');
        }

        console.log('Loading chapter with params:', { grade, subjectId, chapterId });
        
        const chapterData = await loadChapter(grade, subjectId, chapterId);
        console.log('Chapter data loaded:', chapterData);
        setChapter(chapterData);

        const quizzesData = await loadChapterQuizzes(grade, subjectId, chapterId);
        console.log('Quizzes loaded:', quizzesData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error loading chapter:', error);
        setError(error instanceof Error ? error.message : 'Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [grade, subjectId, chapterId, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleQuizStart = (quiz: Quiz) => {
    setPendingQuiz(quiz);
    setModalOpen(true);
  };

  const confirmStartQuiz = () => {
    if (pendingQuiz && grade && subjectId && chapterId) {
      setModalOpen(false);
      navigate(`/quiz/${grade}/${subjectId}/${chapterId}/${pendingQuiz.id}`);
      setPendingQuiz(null);
    }
  };

  const cancelStartQuiz = () => {
    setModalOpen(false);
    setPendingQuiz(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-semibold text-gray-700">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Quizzes</h2>
          <p className="text-xl text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackClick}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chapter Not Found</h2>
          <p className="text-gray-600 mb-6">The requested chapter could not be found.</p>
          <button
            onClick={handleBackClick}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white text-center flex-1">{chapter?.title}</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => {
              const isUnlocked = index < 3;
              return (
                <div
                  key={quiz.id}
                  className={`group relative bg-white rounded-3xl p-6 transition-all duration-300 border border-gray-200 shadow-lg ${isUnlocked ? 'hover:-translate-y-0.5 hover:shadow-xl cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                  onClick={() => isUnlocked && handleQuizStart(quiz)}
                >
                  <h3 className="text-xl font-semibold text-gray-800 leading-tight mb-4 group-hover:text-purple-700 transition-colors">
                    {quiz.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isUnlocked ? 'bg-purple-600 text-white group-hover:bg-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                      {isUnlocked ? <Play className="w-6 h-6 fill-current" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <div className="text-base font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                      {quiz.questions?.length ? `${quiz.questions.length} Questions` : 'N/A Questions'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20 text-center">
                <div className="text-6xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Quizzes Available</h3>
                <p className="text-xl text-gray-600">No quizzes available for this chapter yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center animate-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-6">
              <Play className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Quiz</h3>
            <p className="text-lg text-gray-600 mb-8">
              {pendingQuiz ? `Are you sure you want to start "${pendingQuiz.title}"?` : ''}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={cancelStartQuiz}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartQuiz}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterDetail; 