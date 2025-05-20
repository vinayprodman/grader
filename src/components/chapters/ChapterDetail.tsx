import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadChapter, loadChapterQuizzes } from '../../utils/dataLoader.tsx';
import { Chapter, Quiz } from '../../types/education';
import Loading from '../common/Loading';
import BackButton from '../common/BackButton';
import '../../styles/ChapterDetail.css';
import PopModal from '../common/PopModal';

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
        
        // Add artificial delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const chapterData = await loadChapter(grade, subjectId, chapterId);
        console.log('Chapter data loaded:', chapterData);
        setChapter(chapterData);

        // Load quizzes for the chapter
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

  if (loading) {
    return <Loading text="Loading chapter content..." fullScreen />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Chapter</h2>
        <p>{error}</p>
        <BackButton to={-1} label="Go Back" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="error-container">
        <h2>Chapter Not Found</h2>
        <p>The requested chapter could not be found.</p>
        <BackButton to={-1} label="Go Back" />
      </div>
    );
  }

  return (
    <div className="chapter-detail">
      <div className="nav-header">
        <BackButton to={-1} label="Back" />
        <h1 className="nav-title">{chapter.title}</h1>
      </div>

      <div className="chapter-content">
        <p className="chapter-description">{chapter.description}</p>

        <div className="quiz-section">
          <h2>Available Quizzes</h2>
          <div className="quiz-list-grid">
            {quizzes.map((quiz, index) => {
              const isUnlocked = index < 3;
              return (
                <div
                  key={`${chapterId}-quiz-${quiz.id}`}
                  className={`quiz-card${isUnlocked ? ' unlocked' : ' locked'}`}
                  onClick={() => {
                    if (isUnlocked) {
                      setPendingQuiz(quiz);
                      setModalOpen(true);
                    }
                  }}
                  style={{ cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
                >
                  <div className="quiz-card-header">
                    <span className="quiz-icon">
                      {isUnlocked ? (
                        <span role="img" aria-label="start">▶️</span>
                      ) : (
                        <span role="img" aria-label="locked">🔒</span>
                      )}
                    </span>
                    <h3 className="quiz-title">{quiz.title}</h3>
                  </div>
                  <p className="quiz-description">{quiz.description}</p>
                  {!isUnlocked && (
                    <div className="quiz-locked-msg">Complete previous quiz to unlock</div>
                  )}
                </div>
              );
            })}
            <PopModal
              isOpen={modalOpen}
              title="Start Quiz"
              message={pendingQuiz ? `Are you sure you want to start the quiz "${pendingQuiz.title}"?` : ''}
              confirmText="Start Quiz"
              cancelText="Cancel"
              onConfirm={() => {
                if (pendingQuiz) {
                  setModalOpen(false);
                  navigate(`/quiz/${grade}/${subjectId}/${chapterId}/${pendingQuiz.id}`);
                  setPendingQuiz(null);
                }
              }}
              onCancel={() => {
                setModalOpen(false);
                setPendingQuiz(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail; 