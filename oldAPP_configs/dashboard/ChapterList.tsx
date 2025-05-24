import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, BookOpen } from 'lucide-react';
import { useSubject } from '../../contexts/SubjectContext';

const ChapterList: React.FC = () => {
  const { chapters, setCurrentChapter } = useSubject();
  const navigate = useNavigate();

  const handleChapterSelect = (chapter: typeof chapters[0]) => {
    if (!chapter.isLocked) {
      setCurrentChapter(chapter);
      navigate(`/chapters/${chapter.id}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary mb-6">Science Chapters</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${
              !chapter.isLocked ? 'cursor-pointer hover:shadow-xl transform hover:-translate-y-1' : 'opacity-75'
            } transition-all duration-300 ease-in-out`}
            onClick={() => handleChapterSelect(chapter)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                   <BookOpen className="text-primary" size={20} />
                </div>
               
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{chapter.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{chapter.description}</p>
                </div>
              </div>
              {chapter.isLocked ? (
                <Lock className="text-gray-400" size={20} />
              ) : (
                <Unlock className="text-green-500" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;