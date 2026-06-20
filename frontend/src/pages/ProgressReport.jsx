import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Trophy, AlertTriangle, BookMarked, Award, Star, Flame, Zap, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

export const ProgressReport = () => {
  const { user } = useAuth();
  const { triggerNotification, t } = useApp();
  
  const [report, setReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatsAndReport() {
      try {
        const [reportData, statsData] = await Promise.all([
          api.getProgressReport(),
          api.getProgressStats()
        ]);
        setReport(reportData);
        setStats(statsData);
      } catch (err) {
        console.error("Error loading progress data:", err);
        triggerNotification('Error loading progress statistics. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStatsAndReport();
  }, [triggerNotification]);

  const profile = report?.profile || user?.studentProfile || { xp: 0, streak: 0, coins: 0, badges: [] };

  // Define static badges description
  const predefinedBadges = [
    { id: 'streak_3', title: 'Streak Starter', desc: 'Maintain a study streak of 3 or more days!', icon: '🔥', color: '#ff6d00' },
    { id: 'xp_100', title: 'XP Achiever', desc: 'Accumulate 100 or more study XP points!', icon: '⚡', color: '#ffd600' },
    { id: 'perfect_quiz', title: 'Master Mind', desc: 'Score a perfect 100% on any subject quiz!', icon: '🏆', color: '#854dff' },
    { id: 'homework_hero', title: 'Homework Hero', desc: 'Log and complete 3 or more homework assignments!', icon: '📚', color: '#29b6f6' }
  ];

  // Dynamic Badges Cabinet mapping
  const unlockedAchievementTitles = report?.achievements?.map(a => a.title) || [];
  const unlockedBadgesSet = new Set([
    ...(profile.badges || []),
    ...unlockedAchievementTitles
  ]);

  const achievementsList = [...predefinedBadges];
  if (report?.achievements) {
    report.achievements.forEach(ach => {
      if (!achievementsList.some(b => b.title.toLowerCase() === ach.title.toLowerCase() || b.id === ach.title)) {
        achievementsList.push({
          id: ach.title,
          title: ach.title,
          desc: ach.description || `Milestone unlocked on ${new Date(ach.unlockedAt || Date.now()).toLocaleDateString()}`,
          icon: ach.title.toLowerCase().includes('streak') ? '🔥' : ach.title.toLowerCase().includes('perfect') ? '🏆' : '⭐',
          color: '#854dff'
        });
      }
    });
  }

  // Calculate dynamic weekly study hours from logs
  const studyHours = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (report?.logs && report.logs.length > 0) {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sun, 1 is Mon
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    report.logs.forEach(log => {
      const logDate = new Date(log.date || log.createdAt);
      if (logDate >= monday) {
        let dayIndex = logDate.getDay();
        dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // convert to Mon=0, Sun=6
        if (dayIndex >= 0 && dayIndex < 7) {
          // 40 XP approximates roughly 1 hour of active study
          studyHours[dayIndex] += (log.xpEarned || 20) / 40;
        }
      }
    });
  } else {
    // Baseline sample curve for new profiles
    studyHours.splice(0, 7, 0.8, 1.5, 0.4, 2.2, 1.8, 3.0, 1.0);
  }

  // Cap study hours at reasonable visual bounds
  const formattedStudyHours = studyHours.map(h => parseFloat(Math.max(0.1, Math.min(8, h)).toFixed(1)));
  const maxHour = Math.max(...formattedStudyHours, 2);

  // Mappings for AP Class subjects
  const allSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Telugu', 'Hindi'];
  const subjectColorMap = {
    'Mathematics': { ring: 'var(--color-green)', bg: 'var(--color-green-light)', hover: 'rgba(74, 222, 128, 0.2)' },
    'Science': { ring: 'var(--color-purple)', bg: 'var(--color-purple-light)', hover: 'rgba(192, 132, 252, 0.2)' },
    'English': { ring: 'var(--color-yellow-dark)', bg: 'var(--color-yellow-light)', hover: 'rgba(253, 224, 71, 0.2)' },
    'Social Studies': { ring: 'var(--color-blue)', bg: 'var(--color-blue-light)', hover: 'rgba(96, 165, 250, 0.2)' },
    'Telugu': { ring: '#f43f5e', bg: '#ffe4e6', hover: 'rgba(244, 63, 94, 0.2)' },
    'Hindi': { ring: '#06b6d4', bg: '#ecfeff', hover: 'rgba(6, 182, 212, 0.2)' }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '15px' }}>
        <div className="spinner-buddy" style={{ width: '50px', height: '50px', border: '5px solid var(--border-light)', borderTop: '5px solid var(--color-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Compiling study performance report...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top Banner introducing Mascot */}
      <section className="card-buddy" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(133, 77, 255, 0.15) 0%, rgba(41, 182, 246, 0.15) 100%)',
        border: '1.5px solid rgba(133, 77, 255, 0.3)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2 }}>
          <div style={{
            fontSize: '3.5rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🤖
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
              Study Buddy Analytics Hub
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.5' }}>
              Hi, {profile.name || 'Student'}! Here is your personalized performance dashboard. I have analyzed your study patterns, quiz scores, and subject completions to help you prepare for exams!
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-app)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          zIndex: 2
        }}>
          <Flame size={24} color="#ff6d00" fill="#ff6d00" />
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Streak Status</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>{profile.streak} Days Active</span>
          </div>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </section>

      {/* Visual Analytics Overview Row */}
      {stats && (
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div className="card-buddy" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
              Quizzes Attempted
            </h4>
            <h3 style={{ fontSize: '2.8rem', color: 'var(--color-purple)', fontWeight: '800' }}>{stats.totalQuizzes || 0}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Across all subjects</span>
          </div>
          
          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
              Average Accuracy
            </h4>
            <h3 style={{ fontSize: '2.8rem', color: 'var(--color-green)', fontWeight: '800' }}>
              {stats.subjectAverages?.length > 0 
                ? `${Math.round(stats.subjectAverages.reduce((acc, c) => acc + c.avgScore, 0) / stats.subjectAverages.length)}%`
                : '0%'
              }
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Target: 70%+ Mastery</span>
          </div>

          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
              Study Experience (XP)
            </h4>
            <h3 style={{ fontSize: '2.8rem', color: 'var(--color-yellow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '800' }}>
              <Zap size={30} fill="currentColor" /> {profile.xp}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Level {Math.floor(profile.xp / 100) + 1} Achieved</span>
          </div>

          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
              Study Buddy Coins
            </h4>
            <h3 style={{ fontSize: '2.8rem', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '800' }}>
              🪙 {profile.coins || 0}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Spendable on Parent Rewards</span>
          </div>
        </section>
      )}

      {/* Main Grid: Visual SVG Chart & Rings on Left, Weak Areas & Badges on Right */}
      <div className="dashboard-grid">
        
        {/* Left: Study Duration Vector Chart & Course rings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Custom SVG Study Hours Chart */}
          <section className="card-buddy" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
              <Trophy size={22} color="var(--color-yellow)" /> Weekly Active Study Graph
            </h3>
            
            {/* SVG Render */}
            <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 10px 0 10px' }}>
              <svg viewBox="0 0 500 200" width="100%" height="100%">
                {/* Horizontal gridlines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="var(--border-light)" strokeWidth="1.5" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="var(--border-light)" strokeWidth="1.5" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="var(--border-light)" strokeWidth="1.5" strokeDasharray="5,5" />
                
                {/* Render bars */}
                {formattedStudyHours.map((hours, i) => {
                  const barWidth = 35;
                  const spacing = 65;
                  const x = i * spacing + 30;
                  const barHeight = (hours / maxHour) * 130;
                  const y = 170 - barHeight;

                  return (
                    <g key={i}>
                      <defs>
                        <linearGradient id={`bar-grad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-purple)" />
                          <stop offset="100%" stopColor="var(--color-blue)" />
                        </linearGradient>
                      </defs>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="6"
                        fill={`url(#bar-grad-${i})`}
                        style={{ transition: 'all 0.5s ease' }}
                      />
                      <text x={x + barWidth/2} y={y - 8} textAnchor="middle" fontSize="10" fill="var(--text-main)" fontWeight="bold">
                        {hours}h
                      </text>
                      <text x={x + barWidth/2} y="190" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="bold">
                        {days[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* Competency Rings grid */}
          <section className="card-buddy" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', fontWeight: '800' }}>Subject Competency Mastery</h3>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', textAlign: 'center'
            }}>
              {allSubjects.map((sub, idx) => {
                const subColor = subjectColorMap[sub] || { ring: 'var(--color-purple)', bg: 'var(--bg-app)', hover: 'rgba(133, 77, 255, 0.2)' };
                
                // Find subject average score
                const match = stats?.subjectAverages?.find(sa => sa.subject.toLowerCase() === sub.toLowerCase());
                const score = match ? match.avgScore : 0;
                const testsTaken = match ? match.testsTaken : 0;
                
                return (
                  <div key={idx} className="card-buddy" style={{ padding: '20px 10px', backgroundColor: 'var(--bg-app)', transition: 'transform 0.2s', cursor: 'default' }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    {/* Ring Container */}
                    <div style={{
                      width: '75px', height: '75px', borderRadius: '50%', margin: '0 auto 12px auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `conic-gradient(${subColor.ring} ${score * 3.6}deg, var(--border-light) 0deg)`,
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '63px', height: '63px', borderRadius: '50%', backgroundColor: 'var(--bg-app)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)'
                      }}>
                        {score}%
                      </div>
                    </div>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '4px' }}>{sub}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{testsTaken} quizzes</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quiz Attempt History Logs */}
          <section className="card-buddy" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={22} color="var(--color-purple)" /> Recent Quiz History
            </h3>
            
            {!report?.quizResults || report.quizResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                <p>No quizzes taken yet. Visit the AI Tutor or Quiz Center to take a practice quiz!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {report.quizResults.slice(0, 5).map((q, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-app)'
                  }}>
                    <div>
                      <h5 style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '2px' }}>
                        {q.subject} - {q.chapterName || 'General Knowledge'}
                      </h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(q.date).toLocaleDateString()} at {new Date(q.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {q.correctAnswers} / {q.totalQuestions} Correct
                      </span>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: q.score >= 80 ? 'var(--color-green-dark)' : q.score >= 50 ? 'var(--color-yellow-dark)' : 'var(--color-red-dark)',
                        backgroundColor: q.score >= 80 ? 'var(--color-green-light)' : q.score >= 50 ? 'var(--color-yellow-light)' : 'var(--color-red-light)',
                        border: `1px solid ${q.score >= 80 ? 'var(--color-green)' : q.score >= 50 ? 'var(--color-yellow)' : 'var(--color-red)'}`
                      }}>
                        {q.score}% Score
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right: Weak Areas recommendations & Badges cabinet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Weak Subject recommendations */}
          <section className="card-buddy" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
              <AlertTriangle size={20} color="var(--color-red)" /> Weak Subjects Action Plan
            </h3>

            {!stats || stats.weakSubjects?.length === 0 ? (
              <div style={{
                padding: '16px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-green)',
                backgroundColor: 'var(--color-green-light)', display: 'flex', gap: '10px', alignItems: 'start'
              }}>
                <CheckCircle size={22} color="var(--color-green-dark)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.95rem', color: 'var(--color-green-dark)', fontWeight: 'bold' }}>Fantastic Work!</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-green-dark)', lineHeight: '1.4', marginTop: '4px', fontWeight: '600' }}>
                    All subjects are at 70%+ accuracy. Keep studying with your Study Buddy daily to maintain this level!
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {stats.weakSubjects.map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-red)',
                      backgroundColor: 'var(--color-red-light)', display: 'flex', gap: '10px', alignItems: 'start'
                    }}
                  >
                    <BookMarked size={20} color="var(--color-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <h5 style={{ fontSize: '0.95rem', color: 'var(--color-red-dark)', fontWeight: 'bold' }}>
                        {w.subject}
                      </h5>
                      <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--color-red-dark)', opacity: 0.8, marginTop: '2px' }}>
                        {w.reason}
                      </span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-red-dark)', lineHeight: '1.4', marginTop: '6px', fontWeight: '600' }}>
                        💡 {w.rec}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Achievement Badges Showcase shelf */}
          <section className="card-buddy" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
              <Award size={20} color="var(--color-purple)" /> Badges Cabinet
            </h3>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'
            }}>
              {achievementsList.map((badge) => {
                const isUnlocked = unlockedBadgesSet.has(badge.id) || unlockedBadgesSet.has(badge.title);
                return (
                  <div
                    key={badge.id}
                    className="card-buddy"
                    style={{
                      padding: '15px 10px', textAlign: 'center', backgroundColor: isUnlocked ? 'var(--bg-app)' : 'var(--bg-app)',
                      opacity: isUnlocked ? 1 : 0.4, filter: isUnlocked ? 'none' : 'grayscale(100%)',
                      border: `2px solid ${isUnlocked ? badge.color : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: isUnlocked ? '0 4px 12px rgba(133, 77, 255, 0.15)' : 'none',
                      transition: 'transform 0.2s',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      if (isUnlocked) e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (isUnlocked) e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>{badge.icon}</div>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '4px', fontWeight: 'bold' }}>{badge.title}</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{badge.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

