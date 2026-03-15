import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { api, TestSeries, User } from '@/src/services/api';
import { BookOpen, Calculator, BrainCircuit, Zap, ArrowRight, Lock, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allSeries, setAllSeries] = useState<TestSeries[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedToPurchase, setSelectedToPurchase] = useState<TestSeries | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      setUser(parsedUser);
      
      try {
        const series = await api.getTestSeries(parsedUser.classId);
        setAllSeries(series);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/login');
    }
  };

  const handleSeriesClick = (series: TestSeries) => {
    if (user?.optedTestSeriesIds.includes(series.id)) {
      navigate(`/test-series/${series.id}`);
    } else {
      setSelectedToPurchase(series);
    }
  };

  const handlePurchase = async () => {
    if (!user || !selectedToPurchase) return;
    setIsPurchasing(true);
    
    try {
      await api.purchaseTestSeries(user.id, selectedToPurchase.id);
      
      // Update local user state
      const updatedUser = {
        ...user,
        optedTestSeriesIds: [...user.optedTestSeriesIds, selectedToPurchase.id]
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedToPurchase(null);
      }, 2000);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">Loading your dashboard...</div>;
  }

  const purchasedSeries = allSeries.filter(s => user?.optedTestSeriesIds.includes(s.id));
  const lockedSeries = allSeries.filter(s => !user?.optedTestSeriesIds.includes(s.id));

  return (
    <div className="space-y-16 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-white/10 pb-10 transition-colors duration-300">
        <h1 className="text-5xl font-serif font-light tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
          Welcome back, {user?.name}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium tracking-wide transition-colors duration-300">
          CLASS {user?.classId} • YOUR LEARNING DASHBOARD
        </p>
      </div>

      {/* Enrolled Series */}
      <div className="space-y-8">
        <h2 className="text-2xl font-serif font-light text-slate-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
          <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400" /> Your Enrolled Series
        </h2>
        {purchasedSeries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purchasedSeries.map((series, index) => (
              <motion.div 
                key={series.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSeriesClick(series)}
                className="cursor-pointer h-full"
              >
                <Card className="h-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:shadow-lg dark:hover:bg-white/10 group flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/5 transition-colors duration-300">
                      {series.type === 'boards' ? <BookOpen className="h-6 w-6" /> : 
                       series.type === 'jee_main' ? <Calculator className="h-6 w-6" /> : 
                       <BrainCircuit className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-2xl text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif font-light">
                      {series.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors duration-300">{series.description}</p>
                    <div className="flex items-center text-sm font-semibold tracking-wide text-amber-600 dark:text-amber-500 uppercase transition-colors duration-300">
                      View Tests <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {/* Always show Instant Doubt in enrolled */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: purchasedSeries.length * 0.1 }}>
              <Card className="h-full border border-amber-500/20 bg-gradient-to-br from-amber-50 dark:from-amber-500/10 to-orange-50 dark:to-orange-600/10 transition-all hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer flex flex-col" onClick={() => navigate('/instant-doubt')}>
                <CardHeader>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 transition-colors duration-300">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl text-amber-900 dark:text-amber-50 font-serif font-light transition-colors duration-300">Instant Doubt</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-amber-800/70 dark:text-amber-200/70 leading-relaxed mb-8 transition-colors duration-300">Upload a photo of any question, get an instant AI-powered step-by-step solution.</p>
                  <div className="flex items-center text-sm font-semibold tracking-wide text-amber-600 dark:text-amber-400 uppercase transition-colors duration-300">
                    Try it now <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-12 text-center backdrop-blur-sm transition-colors duration-300">
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors duration-300">You haven't enrolled in any test series yet. Explore our premium offerings below.</p>
          </div>
        )}
      </div>

      {/* Premium Locked Series */}
      {lockedSeries.length > 0 && (
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6 transition-colors duration-300">
            <h2 className="text-3xl font-serif font-light text-slate-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
              <Sparkles className="h-7 w-7 text-amber-500" /> Premium Test Series
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lockedSeries.map((series, index) => (
              <motion.div 
                key={series.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSeriesClick(series)}
                className="cursor-pointer h-full"
              >
                <Card className="h-full border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#111] text-slate-900 dark:text-white transition-all hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] group relative overflow-hidden flex flex-col">
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 backdrop-blur-md transition-colors duration-300">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider flex items-center gap-1 transition-colors duration-300">
                        ₹{series.price}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif font-light">
                      {series.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors duration-300">{series.description}</p>
                    <div className="flex items-center text-sm font-semibold tracking-wide text-amber-600 dark:text-amber-500 uppercase transition-colors duration-300">
                      Unlock Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedToPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-[#111] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 transition-colors duration-300"
            >
              {purchaseSuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-3xl font-serif font-light text-slate-900 dark:text-white transition-colors duration-300">Payment Successful!</h3>
                  <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">You now have access to {selectedToPurchase.name}.</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 dark:bg-[#1a1a1a] p-10 text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 bg-amber-500 rounded-full blur-[80px] opacity-20" />
                    <h3 className="text-3xl font-serif font-light mb-3 relative z-10">Unlock Premium</h3>
                    <p className="text-slate-600 dark:text-slate-400 relative z-10 text-sm leading-relaxed transition-colors duration-300">{selectedToPurchase.name}</p>
                  </div>
                  
                  <div className="p-10 space-y-8">
                    <div className="flex justify-between items-center pb-8 border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
                      <span className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-xs transition-colors duration-300">Total Amount</span>
                      <span className="text-4xl font-light text-slate-900 dark:text-white transition-colors duration-300">₹{selectedToPurchase.price}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 backdrop-blur-sm transition-colors duration-300">
                        <CreditCard className="h-6 w-6 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors duration-300">Pay via Credit/Debit Card</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 transition-colors duration-300">Secure mock payment gateway</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-14 rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
                        onClick={() => setSelectedToPurchase(null)}
                        disabled={isPurchasing}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 h-14 rounded-xl bg-amber-500 text-white dark:text-black hover:bg-amber-600 dark:hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-medium transition-all duration-300"
                        onClick={handlePurchase}
                        disabled={isPurchasing}
                      >
                        {isPurchasing ? 'Processing...' : `Pay ₹${selectedToPurchase.price}`}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
