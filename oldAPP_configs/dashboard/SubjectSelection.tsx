import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary mb-6">Select Your Subject</h1>
      
      <div className="grid gap-4">
        <div 
          className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/chapters/science')}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary" size={24} />
            <div>
              <h3 className="font-semibold text-lg">Science</h3>
              <p className="text-gray-600 text-sm">Class 5 - All Chapters</p>
            </div>
          </div>
        </div>
        
        {/* Other subjects will be added here later */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-500 text-center">More subjects coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;