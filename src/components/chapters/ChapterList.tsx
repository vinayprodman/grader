import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Subject, getSubject } from '../../data/mockData';
import Loading from '../common/Loading';
import '../../styles/ChapterList.css';

const ChapterList: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubject = async () => {
      try {
        const data = await getSubject(subjectId || '');
        setSubject(data || null);
      } catch (error) {
        console.error('Error loading subject:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [subjectId]);

  const handleChapterClick = (chapterId: string) => {
    navigate(`/subjects/${subjectId}/chapters/${chapterId}`);
  };

  if (loading) {
    return <Loading text="Loading subject..." fullScreen />;
  }

  if (!subject) {
    return <Loading text="Subject not found..." fullScreen />;
  }

  return (
    <div className="chapter-list-container">
      <div className="chapter-list-header">
        <button 
          className="btn btn-ghost"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="subject-info">
          <h1>{subject.title}</h1>
          <p>{subject.description}</p>
        </div>
      </div>

      <div className="chapters-grid">
        {subject.chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`chapter-card ${chapter.status}`}
            onClick={() => handleChapterClick(chapter.id)}
          >
            <div className="chapter-icon">
              {chapter.icon}
            </div>
            <div className="chapter-content">
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
              <div className="chapter-meta">
                <span className="chapter-status">{chapter.status}</span>
                <span className="test-count">{chapter.tests.length} tests</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList; 