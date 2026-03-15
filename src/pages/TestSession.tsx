import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { api, Test, Submission } from '@/src/services/api';
import { CameraCapture } from '@/src/components/CameraCapture';
import { Upload, ChevronRight, CheckCircle2, Image as ImageIcon, Camera, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestSession() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissions, setSubmissions] = useState<Partial<Submission>[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTest = localStorage.getItem('currentTest');
    if (savedTest) {
      const parsedTest = JSON.parse(savedTest);
      setTest(parsedTest);
      setSubmissions(new Array(parsedTest.questions.length).fill({}));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!test) return <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">Loading...</div>;

  const currentQuestion = test.questions[currentIndex];

  const handleNext = () => {
    const newSubmissions = [...submissions];
    newSubmissions[currentIndex] = {
      question_id: currentQuestion.id,
      image_s3_url: currentImage || '',
    };
    setSubmissions(newSubmissions);

    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(newSubmissions[currentIndex + 1]?.image_s3_url || null);
    } else {
      handleSubmitTest(newSubmissions);
    }
  };

  const handleSubmitTest = async (finalSubmissions: Partial<Submission>[]) => {
    setLoading(true);
    try {
      const result = await api.submitTest(test.id, finalSubmissions);
      localStorage.setItem('testResults', JSON.stringify({ test, result, submissions: finalSubmissions }));
      navigate(`/results/${test.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate R2 upload and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-3xl font-serif font-light tracking-tight text-slate-900 dark:text-white transition-colors duration-300">{test.name}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 font-serif text-lg transition-colors duration-300">
            {currentIndex + 1}
          </span>
          <span className="tracking-widest uppercase text-xs">of {test.questions.length}</span>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/5 transition-colors duration-300">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / test.questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl transition-colors duration-300">
            <CardHeader className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-8 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 transition-colors duration-300">{currentQuestion.subject} • {currentQuestion.topic}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 transition-colors duration-300">{currentQuestion.max_marks} Marks</span>
              </div>
              <CardTitle className="text-2xl font-light leading-relaxed text-slate-900 dark:text-white font-serif transition-colors duration-300">
                {currentQuestion.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-6">
                <label className="text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300">Upload Your Solution</label>
                
                {showCamera ? (
                  <CameraCapture 
                    onCapture={(img) => { setCurrentImage(img); setShowCamera(false); }} 
                    onCancel={() => setShowCamera(false)} 
                  />
                ) : currentImage ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/50 transition-colors duration-300">
                    <img src={currentImage} alt="Uploaded work" className="h-80 w-full object-contain opacity-90 p-4" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-6 py-3 text-sm font-medium text-emerald-400 shadow-lg">
                        <CheckCircle2 className="h-5 w-5" />
                        Solution Uploaded
                      </div>
                    </div>
                    <button 
                      onClick={() => setCurrentImage(null)}
                      className="absolute right-4 top-4 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <button onClick={() => setShowCamera(true)} className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 py-16 transition-all hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-500/5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-white/5 text-slate-400 dark:text-slate-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 border border-slate-100 dark:border-transparent">
                        <Camera className="h-8 w-8" />
                      </div>
                      <span className="mt-6 text-lg font-serif font-light text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">Take Photo</span>
                      <span className="mt-2 text-sm text-slate-500 dark:text-slate-500 text-center px-6 transition-colors duration-300">Use your camera to snap a picture instantly</span>
                    </button>

                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 py-16 transition-all hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-500/5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-white/5 text-slate-400 dark:text-slate-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 border border-slate-100 dark:border-transparent">
                        <Upload className="h-8 w-8" />
                      </div>
                      <span className="mt-6 text-lg font-serif font-light text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">Upload Image</span>
                      <span className="mt-2 text-sm text-slate-500 dark:text-slate-500 text-center px-6 transition-colors duration-300">Choose an existing photo from your gallery</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center pt-6">
        <Button 
          variant="outline" 
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setCurrentImage(submissions[currentIndex - 1]?.image_s3_url || null);
            }
          }}
          disabled={currentIndex === 0 || loading}
          className="h-14 px-8 rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
        >
          Previous
        </Button>
        <Button 
          size="lg" 
          onClick={handleNext} 
          disabled={!currentImage || loading} 
          className="h-14 px-8 rounded-xl bg-amber-500 text-white dark:text-black hover:bg-amber-600 dark:hover:bg-amber-400 font-medium shadow-[0_0_20px_rgba(245,158,11,0.2)] gap-2 transition-all duration-300"
        >
          {currentIndex < test.questions.length - 1 ? (
            <>Next Question <ChevronRight className="h-5 w-5" /></>
          ) : (
            <>{loading ? 'Submitting...' : 'Submit Test'} <CheckCircle2 className="h-5 w-5" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
