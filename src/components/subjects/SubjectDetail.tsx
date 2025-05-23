import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectInfo, loadSubjectChapters } from '../../utils/dataLoader';
import { Subject, Chapter } from '../../types/education';
import Loading from '../common/Loading';
import BackButton from '../common/BackButton';
import '../../styles/SubjectDetail.css';
import { BookOpen, Lock, ChevronRight } from 'lucide-react';

const SubjectDetail: React.FC = () => {
  const { grade, subjectId } = useParams<{ grade: string; subjectId: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define a color palette
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100'];
  const textColors = ['text-blue-800', 'text-green-800', 'text-yellow-900', 'text-red-800'];

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (!grade || !subjectId) {
          throw new Error('Missing required parameters');
        }
        
        console.log('Loading subject with params:', { grade, subjectId });

        await new Promise(resolve => setTimeout(resolve, 500));
        
        const subjectInfo = getSubjectInfo(subjectId, grade);
        if (!subjectInfo) {
             throw new Error(`Subject with ID ${subjectId} not found for grade ${grade}`);
        }
        // Assign a temporary isLocked status for demonstration if not available from data
        const chaptersData = (await loadSubjectChapters(grade, subjectId)).map((chapter, index) => ({
            ...chapter,
            isLocked: index > 2 // Example: lock chapters after the third one
        }));

        setSubject(subjectInfo);
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error loading subject:', error);
        setError(error instanceof Error ? error.message : 'Failed to load subject');
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [grade, subjectId, navigate]);

  if (loading) {
    return <Loading text="Loading subject content..." fullScreen />;
  }

   if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Subject</h2>
        <p>{error}</p>
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>
    );
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="subject-detail container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="nav-header flex items-center justify-between mb-8">
        <BackButton to="/dashboard" label="Back to Dashboard" />
        <h1 className="text-3xl font-bold text-primary text-center flex-grow">{subject.title} Chapters</h1>
         <div className="w-10">{/* Placeholder for spacing */}</div>
      </div>

      <div className="subject-content">
        <div className="chapters-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`chapter-card p-6 rounded-xl shadow-lg border border-gray-200 ${
                colors[index % colors.length]} ${textColors[index % textColors.length]} ${
                !chapter.isLocked ? 'cursor-pointer hover:shadow-xl transform hover:-translate-y-1 border-primary' : 'opacity-75 bg-gray-200 text-gray-500'
              } transition-all duration-300 ease-in-out flex flex-col justify-between`}
              onClick={() => !chapter.isLocked && navigate(`/chapter/${grade}/${subjectId}/${chapter.id}`)}
            >
               <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${!chapter.isLocked ? 'bg-white/50' : 'bg-gray-300'} rounded-full`}>
                     <BookOpen className={!chapter.isLocked ? 'text-primary' : 'text-gray-500'} size={20} />
                  </div>
                 
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{chapter.title}</h3>
                  </div>
                </div>
                {chapter.isLocked ? (
                  <Lock className="text-gray-500" size={20} />
                ) : (
                  <ChevronRight className="text-current" size={24} />
                )}
              </div>
              {/* Chapter description */}
              <p className="text-sm mt-2">{chapter.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail; 