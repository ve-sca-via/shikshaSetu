import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { api, Test, TestSeries } from '@/src/services/api';
import { Play, Clock, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function TestSeriesDetails() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);
  const [series, setSeries] = useState<TestSeries | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      if (!seriesId) return;
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const allSeries = await api.getTestSeries(user.classId || '11');
        const currentSeries = allSeries.find(s => s.id === seriesId);
        if (currentSeries) setSeries(currentSeries);

        const seriesTests = await api.getTestsForSeries(seriesId);
        setTests(seriesTests);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [seriesId]);

  const handleStartTest = async (testId: string) => {
    try {
      const testDetails = await api.getTestDetails(testId);
      localStorage.setItem('currentTest', JSON.stringify(testDetails));
      navigate(`/test/${testId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">Loading tests...</div>;
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="flex items-start gap-6 border-b border-slate-200 dark:border-white/10 pb-10 transition-colors duration-300">
        <button 
          onClick={() => navigate('/')}
          className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1 transition-colors duration-300">
              <CheckCircle2 className="h-3 w-3" /> ENROLLED
            </span>
            <span className="text-slate-500 text-sm font-medium tracking-widest uppercase transition-colors duration-300">
              {series?.type.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-5xl font-serif font-light tracking-tight text-slate-900 dark:text-white transition-colors duration-300">{series?.name || 'Test Series'}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl transition-colors duration-300">{series?.description || 'Select a test to start practicing.'}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test, index) => (
          <motion.div 
            key={test.id}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm flex flex-col hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-colors group">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-900 dark:text-white font-serif font-light group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{test.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-5 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors duration-300">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="font-medium">{test.duration_minutes} Minutes</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors duration-300">
                      <BookOpen className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {test.subjects.map(sub => (
                        <span key={sub} className="inline-flex items-center rounded-md bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors duration-300">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartTest(test.id)} 
                  className="w-full gap-2 h-12 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-amber-500 dark:hover:bg-amber-400 font-medium rounded-xl transition-colors"
                >
                  <Play className="h-4 w-4" /> Start Test
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
