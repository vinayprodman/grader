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
      
      <div className="grid gap-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`bg-white p-4 rounded-lg shadow-md ${
              !chapter.isLocked ? 'cursor-pointer hover:shadow-lg' : 'opacity-75'
            } transition-shadow`}
            onClick={() => handleChapterSelect(chapter)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={24} />
                <div>
                  <h3 className="font-semibold text-lg">{chapter.title}</h3>
                  <p className="text-gray-600 text-sm">{chapter.description}</p>
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