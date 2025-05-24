import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadChapter, loadChapterQuizzes } from '../../utils/dataLoader';
import { Chapter, Quiz } from '../../types/education';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { notify } from '../../utils/notifications';
import Loading from '../common/Loading';

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
      if (!grade || !subjectId || !chapterId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        const [chapterData, quizzesData] = await Promise.all([
          loadChapter(grade, subjectId, chapterId),
          loadChapterQuizzes(grade, subjectId, chapterId)
        ]);

        if (!chapterData) {
          setError('Chapter not found');
          return;
        }

        setChapter(chapterData);
        setQuizzes(quizzesData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load chapter data');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [grade, subjectId, chapterId]);

  const handleBackClick = () => navigate(-1);
  const handleQuizStart = (quiz: Quiz) => {
    setPendingQuiz(quiz);
    setModalOpen(true);
  };

  const confirmStartQuiz = () => {
    if (pendingQuiz) {
      setModalOpen(false);
      navigate(`/quiz/${grade}/${subjectId}/${chapterId}/${pendingQuiz.id}`);
    }
  };

  const cancelStartQuiz = () => {
    setPendingQuiz(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-semibold text-gray-700">Loading chapter content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Chapter Not Found'}
          </h2>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="container mx-auto">
        <button
          onClick={handleBackClick}
          className="mb-6 inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Subject
        </button>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{chapter.title}</h1>
          <p className="text-gray-600 mb-8">{chapter.description}</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                  {quiz.isLocked ? (
                    <Lock className="text-gray-400" size={20} />
                  ) : (
                    <Play className="text-green-500" size={20} />
                  )}
                </div>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <button
                  onClick={() => !quiz.isLocked && handleQuizStart(quiz)}
                  disabled={quiz.isLocked}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    quiz.isLocked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {quiz.isLocked ? 'Locked' : 'Start Quiz'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && pendingQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Start Quiz</h3>
            <p className="text-gray-600 mb-6">
              Are you ready to start "{pendingQuiz.title}"? Once you begin, you must complete the quiz.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelStartQuiz}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartQuiz}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
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