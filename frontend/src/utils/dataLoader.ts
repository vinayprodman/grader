import { Subject } from '../types/education';

export const getSubjectInfo = (subjectId: string, grade: string): Subject => {
  const subjects: Record<string, Subject> = {
    math: {
      id: 'math',
      title: 'Mathematics',
      description: 'Learn numbers, algebra, and geometry',
      grade,
      color: '#4a6ee0',
      icon: '📐'
    },
    science: {
      id: 'science',
      title: 'Science',
      description: 'Explore biology, chemistry, and physics',
      grade,
      color: '#e04a4a',
      icon: '🔬'
    },
    english: {
      id: 'english',
      title: 'English',
      description: 'Master grammar, literature, and writing',
      grade,
      color: '#4ae04a',
      icon: '📚'
    }
  };

  return subjects[subjectId] || {
    id: subjectId,
    title: 'Unknown Subject',
    description: 'No description available',
    grade,
    color: '#cccccc',
    icon: '❓'
  };
}; 