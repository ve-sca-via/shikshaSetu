import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { api, Test, Submission } from '@/src/services/api';
import { CheckCircle2, XCircle, ChevronRight, RefreshCw, Zap, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Results() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<{ test: Test, result: any, submissions: Partial<Submission>[] } | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [officialSolution, setOfficialSolution] = useState<any>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<Record<number, string>>({});
  const [isAnalysing, setIsAnalysing] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults');
    if (savedResults) {
      setData(JSON.parse(savedResults));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!data) return <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">Loading results...</div>;

  const { test, result, submissions } = data;

  const handleViewSolution = async (index: number) => {
    setSelectedQuestion(index);
    setOfficialSolution(null);
    try {
      const solution = await api.getOfficialSolution(test.questions[index].id);
      setOfficialSolution(solution);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnalyse = async (index: number) => {
    setIsAnalysing(true);
    // Simulate API call for detailed AI analysis
    setTimeout(() => {
      const hasImage = !!submissions[index].image_s3_url;
      const isCorrect = result.results[index].isCorrect;
      
      let analysisText = "";
      if (!hasImage) {
        analysisText = "Since no solution was uploaded, I cannot analyze your specific steps. Please review the official solution to understand the correct approach.";
      } else if (isCorrect) {
        analysisText = "Excellent work! Your steps perfectly align with the official solution. You correctly identified the formula and executed the calculations flawlessly. Keep it up!";
      } else {
        analysisText = "Based on the extracted text, you correctly identified the initial formula but made a substitution error in the intermediate steps. The official solution uses different values which led to the correct final answer. Review the official solution carefully to see where your calculation diverged.";
      }
      
      setDetailedAnalysis(prev => ({
        ...prev,
        [index]: analysisText
      }));
      setIsAnalysing(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-12">
      <div className="flex items-start gap-6 border-b border-slate-200 dark:border-white/10 pb-10 transition-colors duration-300">
        <button 
          onClick={() => navigate('/')}
          className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1 transition-colors duration-300">
              <CheckCircle2 className="h-3 w-3" /> COMPLETED
            </span>
            <span className="text-slate-500 text-sm font-medium tracking-widest uppercase transition-colors duration-300">
              {test.name}
            </span>
          </div>
          <h1 className="text-5xl font-serif font-light tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Performance Analysis</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl transition-colors duration-300">AI evaluation complete. Review your answers and detailed feedback below.</p>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="flex flex-col items-center justify-center shrink-0"
        >
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-colors duration-300">
            <div className="text-center">
              <span className="block text-4xl font-serif text-amber-600 dark:text-amber-400 transition-colors duration-300">
                {result.score}
              </span>
              <span className="block text-sm text-amber-600/70 dark:text-amber-500/70 uppercase tracking-widest mt-1 transition-colors duration-300">
                / {result.total}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <h2 className="text-xl font-serif font-light text-slate-900 dark:text-white mb-6 transition-colors duration-300">Questions Overview</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {test.questions.map((q, idx) => {
              const isCorrect = result.results[idx].isCorrect;
              const marks = result.results[idx].marks_awarded;
              const isSelected = selectedQuestion === idx;
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all border ${isSelected ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-500/5' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10'}`}
                    onClick={() => handleViewSolution(idx)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${isCorrect ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : marks > 0 ? 'bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                          {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : marks > 0 ? <AlertCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-medium transition-colors duration-300 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>Question {idx + 1}</span>
                          <span className="text-xs text-slate-500 mt-0.5 transition-colors duration-300">{marks}/{q.max_marks} Marks</span>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-transform ${isSelected ? 'rotate-90 text-amber-500' : 'text-slate-400 dark:text-slate-600'}`} />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedQuestion !== null ? (
              <motion.div
                key={selectedQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl overflow-hidden transition-colors duration-300">
                  <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 p-8 transition-colors duration-300">
                    <CardTitle className="text-2xl font-serif font-light leading-relaxed text-slate-900 dark:text-white transition-colors duration-300">
                      {test.questions[selectedQuestion].question_text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300">Your Solution</h3>
                      {submissions[selectedQuestion].image_s3_url ? (
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/50 p-2 transition-colors duration-300">
                          <img src={submissions[selectedQuestion].image_s3_url} alt="Your solution" className="w-full max-h-96 object-contain rounded-xl opacity-90" />
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 p-12 text-center text-slate-500 font-serif italic transition-colors duration-300">
                          No solution uploaded.
                        </div>
                      )}
                    </div>

                    {result.results[selectedQuestion].ai_evaluation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl border p-8 space-y-4 transition-colors duration-300 ${result.results[selectedQuestion].isCorrect ? 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5' : 'border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5'}`}
                      >
                        <div className={`flex items-center gap-3 transition-colors duration-300 ${result.results[selectedQuestion].isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          <Search className="h-6 w-6" />
                          <h3 className="font-serif text-xl">AI Evaluation</h3>
                        </div>
                        
                        <div>
                          <p className={`font-medium p-4 rounded-xl border leading-relaxed transition-colors duration-300 ${result.results[selectedQuestion].isCorrect ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-200'}`}>
                            {result.results[selectedQuestion].ai_evaluation.feedback}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {result.results[selectedQuestion].ai_evaluation?.extracted_text && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300">Extracted Text</h3>
                          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 shadow-sm h-full transition-colors duration-300">
                            <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed transition-colors duration-300">
                              {result.results[selectedQuestion].ai_evaluation.extracted_text}
                            </pre>
                          </div>
                        </div>
                      )}

                      {officialSolution && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300">Official Solution</h3>
                          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-6 space-y-4 shadow-sm h-full transition-colors duration-300">
                            {officialSolution.steps.map((step: string, i: number) => (
                              <p key={i} className="text-emerald-800 dark:text-emerald-100/80 font-mono text-sm leading-relaxed transition-colors duration-300">{step}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col items-center space-y-6 transition-colors duration-300">
                      {!detailedAnalysis[selectedQuestion] ? (
                        <Button 
                          onClick={() => handleAnalyse(selectedQuestion)}
                          disabled={isAnalysing}
                          className="gap-3 bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] h-14 px-8 text-base rounded-xl font-medium transition-all duration-300"
                        >
                          {isAnalysing ? (
                            <><RefreshCw className="h-5 w-5 animate-spin" /> Analysing Solution...</>
                          ) : (
                            <><Zap className="h-5 w-5" /> Analyse with AI</>
                          )}
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 p-8 space-y-5 shadow-sm transition-colors duration-300"
                        >
                          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 transition-colors duration-300">
                            <Zap className="h-6 w-6" />
                            <h3 className="font-serif text-xl">Detailed AI Analysis</h3>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg transition-colors duration-300">
                            {detailedAnalysis[selectedQuestion]}
                          </p>
                        </motion.div>
                      )}
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-12 text-center transition-colors duration-300">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/5 transition-colors duration-300">
                  <Search className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-serif font-light text-slate-900 dark:text-white transition-colors duration-300">Select a question</h3>
                <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md leading-relaxed transition-colors duration-300">Click on any question on the left to view your uploaded solution, AI feedback, and the official solution.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
