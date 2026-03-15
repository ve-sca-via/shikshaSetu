import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card, CardContent } from '@/src/components/ui/Card';
import { api } from '@/src/services/api';
import { BookOpen, Lock, Mail, Phone, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [classId, setClassId] = useState('11');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking opted test series based on class for MVP
      const optedTestSeriesIds = classId === '11' ? ['ts-1', 'ts-2', 'ts-3'] : ['ts-4', 'ts-5'];
      const user = await api.login(email, phone, classId, optedTestSeriesIds);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6"
      >
        <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-slate-200/50 dark:ring-white/10 bg-white dark:bg-[#111]">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-serif font-light tracking-tight">Shiksha Setu</h2>
              <p className="mt-2 text-amber-100 font-medium tracking-wide">Sign in to access your premium courses</p>
            </div>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus-visible:ring-amber-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus-visible:ring-amber-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Class</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <select
                    className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a1a1a] pl-10 pr-3 py-2 text-sm text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus-visible:ring-amber-500"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium text-lg shadow-lg shadow-amber-500/20 transition-all" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
