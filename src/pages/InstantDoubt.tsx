import React, { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { api } from '@/src/services/api';
import { CameraCapture } from '@/src/components/CameraCapture';
import { Upload, Zap, CheckCircle2, RefreshCw, Camera, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function InstantDoubt() {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await api.instantDoubt(image);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-12">
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
              <Zap className="h-3 w-3" /> AI POWERED
            </span>
          </div>
          <h1 className="text-5xl font-serif font-light tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Instant Doubt</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl transition-colors duration-300">
            Stuck on a problem? Upload a photo of it, and our AI will instantly extract the text, check our database, and generate a step-by-step solution.
          </p>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="hidden md:flex flex-col items-center justify-center shrink-0"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-colors duration-300">
            <Zap className="h-10 w-10 text-amber-500" />
          </div>
        </motion.div>
      </div>

      <Card className="overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl transition-colors duration-300">
        <CardContent className="p-8 md:p-12 space-y-10">
          {showCamera ? (
            <CameraCapture 
              onCapture={(img) => { setImage(img); setResult(null); setShowCamera(false); }} 
              onCancel={() => setShowCamera(false)} 
            />
          ) : !image ? (
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
          ) : (
            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/50 p-4 transition-colors duration-300">
                <img src={image} alt="Uploaded doubt" className="max-h-[500px] w-full object-contain opacity-90 rounded-xl" />
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute right-6 top-6 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors duration-300"
                >
                  Change Photo
                </button>
              </div>
              
              {!result && (
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading}
                  className="w-full gap-3 bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] h-16 text-lg rounded-xl font-medium transition-all duration-300"
                >
                  {loading ? (
                    <><RefreshCw className="h-6 w-6 animate-spin" /> Extracting & Solving...</>
                  ) : (
                    <><Zap className="h-6 w-6" /> Solve This Problem</>
                  )}
                </Button>
              )}
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-8 border-t border-slate-200 dark:border-white/10 transition-colors duration-300"
              >
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-6 flex items-start gap-4 text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                  <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-500" />
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-emerald-800 dark:text-emerald-300 transition-colors duration-300">Solution Found!</p>
                    <div className="bg-white/50 dark:bg-black/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-500/10 transition-colors duration-300">
                      <p className="text-sm font-mono text-emerald-700 dark:text-emerald-100/80 leading-relaxed transition-colors duration-300">Extracted: "{result.question_text}"</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-serif font-light text-slate-900 dark:text-white transition-colors duration-300">Step-by-Step Solution</h3>
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-8 shadow-sm space-y-6 transition-colors duration-300">
                    {result.official_solution.steps.map((step: string, i: number) => (
                      <div key={i} className="flex gap-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 font-serif text-lg transition-colors duration-300">
                          {i + 1}
                        </div>
                        <p className="pt-2 text-slate-700 dark:text-slate-300 font-mono text-base leading-relaxed transition-colors duration-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
