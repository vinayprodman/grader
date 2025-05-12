import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Chapter, Quiz } from '../../types/education';
import Loading from '../common/Loading';
import '../../styles/ChapterDetail.css';

const ChapterDetail: React.FC = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapterData = async () => {
      console.log('ChapterDetail: Starting to load chapter data');
      console.log('ChapterDetail: chapterId from params:', chapterId);
      
      try {
        if (!chapterId) {
          console.log('ChapterDetail: No chapterId found, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }

        console.log('ChapterDetail: Fetching chapter data for ID:', chapterId);
        const chapterData = await api.getChapter(chapterId);
        console.log('ChapterDetail: Received chapter data:', chapterData);

        if (chapterData) {
          setChapter(chapterData);
          console.log('ChapterDetail: Fetching quizzes for chapter:', chapterId);
          const quizzesData = await api.getQuizzes(chapterId);
          console.log('ChapterDetail: Received quizzes data:', quizzesData);
          setQuizzes(quizzesData);
        } else {
          console.log('ChapterDetail: No chapter data found, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('ChapterDetail: Error loading chapter:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [chapterId, navigate]);

  const handleQuizClick = (quiz: Quiz) => {
    console.log('ChapterDetail: Quiz clicked:', quiz);
    navigate(`/quiz/${quiz.id}`);
  };

  if (loading) {
    console.log('ChapterDetail: Rendering loading state');
    return <Loading text="Loading chapter..." fullScreen />;
  }

  if (!chapter) {
    console.log('ChapterDetail: No chapter found, rendering not found message');
    return <Loading text="Chapter not found..." fullScreen />;
  }

  console.log('ChapterDetail: Rendering chapter with quizzes:', { chapter, quizzes });

  return (
    <div className="chapter-detail">
      <div className="nav-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="nav-title">{chapter.title}</div>
      </div>

      <div className="chapter-content">
        <h3>Available Quizzes</h3>
        <p className="section-subtitle">Complete quizzes to unlock more content</p>
        
        {quizzes.length === 0 ? (
          <div className="no-quizzes">No quizzes available for this chapter yet.</div>
        ) : (
          <div className="test-grid">
            {quizzes.map((quiz, index) => (
              <button
                key={quiz.id}
                className="test-btn"
                onClick={() => handleQuizClick(quiz)}
              >
                <span className="test-info">
                  <span className="test-icon">
                    {index + 1}
                  </span>
                  <span>{quiz.title}</span>
                </span>
                <span className="test-meta">
                  <span className="test-details">
                    {quiz.questions.length} Questions
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterDetail; 