import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { usePerformance } from '../hooks/usePerformance';
import type { Subject } from '../types/education';
import Logo from '../components/Logo';
import { RippleButton } from '../components/ui/ripple-button';
import { TrendingUp, Target, Clock, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { getSubjects, loading: subjectsLoading } = useFirestore();
  const { performance, formatTime, getOverallProgress } = usePerformance();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (profile?.grade) {
        const subjectData = await getSubjects(profile.grade);
        setSubjects(subjectData);
      }
    };

    loadSubjects();
  }, [profile, getSubjects]);

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <Logo size="sm" />
        <RippleButton variant="outline" size="sm" onClick={logout}>
          Sign Out
        </RippleButton>
      </header>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section with Purple Gradient */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.name || 'Student'}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              Ready to continue your learning journey? {overallProgress}% completed
            </p>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">OVERALL PROGRESS</p>
                <p className="text-3xl font-bold text-gray-900">{overallProgress}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">AVERAGE SCORE</p>
                <p className="text-3xl font-bold text-gray-900">{Math.min(100, Number((performance?.averageScore || 0).toFixed(2)))}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">TIME SPENT</p>
                <p className="text-3xl font-bold text-gray-900">{performance?.totalTimeSpent ? formatTime(performance.totalTimeSpent) : '0m'}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link 
              key={subject.id} 
              to={`/subjects/${subject.id}/chapters`}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${subject.color || 'bg-gray-100'} rounded-xl flex items-center justify-center text-2xl`}>
                    {subject.icon || '📚'}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {subject.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {subject.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    📖 {(subject as any).chapters || 4} chapters
                  </span>
                  <span className="flex items-center">
                    🎓 Grade {profile?.grade || 5}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
