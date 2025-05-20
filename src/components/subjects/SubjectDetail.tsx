import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectInfo, loadSubjectChapters } from '../../utils/dataLoader';
import { Subject, Chapter } from '../../types/education';
import Loading from '../common/Loading';
import BackButton from '../common/BackButton';
import '../../styles/SubjectDetail.css';

const SubjectDetail: React.FC = () => {
  const { grade, subjectId } = useParams<{ grade: string; subjectId: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (!grade || !subjectId) {
          throw new Error('Missing required parameters');
        }
        
        // Add artificial delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const subjectInfo = getSubjectInfo(subjectId, grade);
        const chaptersData = await loadSubjectChapters(grade, subjectId);
        setSubject(subjectInfo);
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error loading subject:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [grade, subjectId, navigate]);

  if (loading) {
    return <Loading text="Loading subject content..." fullScreen />;
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="subject-detail">
      <div className="nav-header">
        <BackButton to="/dashboard" label="Back to Dashboard" />
        <h1 className="nav-title">{subject.title}</h1>
      </div>

      <div className="subject-content">
        <p className="subject-description">{subject.description}</p>

        <div className="chapters-grid">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="chapter-card">
              <h2>{chapter.title}</h2>
              <p>{chapter.description}</p>
              <button
                className="start-chapter-btn"
                onClick={() => navigate(`/chapter/${grade}/${subjectId}/chapter${chapter.id}`)}
              >
                Start Chapter
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail; 