import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Mascot } from '../components/Mascot';
import { Flame, Sparkles, Trophy, ShieldAlert, Award } from 'lucide-react';

export const LandingPage = () => {
  const { navigate, t } = useApp();
  const { startDemoSession } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '2px solid var(--border-light)',
        boxShadow: '0 4px 0 rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mascot size={50} expression="happy" />
          <h1 style={{ color: 'var(--color-green)', fontSize: '2.1rem', fontFamily: 'var(--font-header)' }}>
            {t('title')}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('auth')} className="btn-3d btn-3d-light" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
            Sign In / Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="hero-grid">
          {/* Hero Left */}
          <div>
            <h2 style={{ fontSize: '3.2rem', lineHeight: '1.15', marginBottom: '20px', color: 'var(--text-main)' }}>
              {t('landingTagline')}
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '35px' }}>
              {t('landingDesc')}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('auth')} className="btn-3d btn-3d-green" style={{ padding: '16px 36px', fontSize: '1.2rem' }}>
                {t('startJourney')}
              </button>
              <button 
                onClick={() => {
                  navigate('auth');
                  // Trigger Parent View Selection in Auth
                }} 
                className="btn-3d btn-3d-purple" 
                style={{ padding: '16px 36px', fontSize: '1.2rem' }}
              >
                {t('parentPortal')}
              </button>
            </div>
          </div>

          {/* Hero Right */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 24px',
              position: 'relative',
              marginBottom: '20px',
              boxShadow: '0 4px 0 rgba(0,0,0,0.05)'
            }}>
              <p style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-purple)' }}>
                "Hoot! Let's build a daily learning habit together!" 🦉
              </p>
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                right: '40px',
                width: '20px',
                height: '20px',
                backgroundColor: 'var(--bg-card)',
                borderRight: '2px solid var(--border-light)',
                borderBottom: '2px solid var(--border-light)',
                transform: 'rotate(45deg)'
              }} />
            </div>
            <Mascot size={220} expression="celebrate" />
          </div>
        </div>

        {/* Developer Zero-Setup Demo Banner */}
        <section style={{
          backgroundColor: 'var(--color-yellow-light)',
          border: '2px solid var(--color-yellow-dark)',
          borderRadius: 'var(--radius-md)',
          padding: '30px',
          marginBottom: '60px',
          boxShadow: '0 6px 0 var(--color-yellow-dark)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles fill="currentColor" color="currentColor" /> Instant Developer Demo Mode! <Sparkles fill="currentColor" color="currentColor" />
          </h3>
          <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '20px', fontWeight: '500' }}>
            Test every aspect of the application immediately with standard profiles. No databases, accounts, or Firebase setup required!
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => startDemoSession('student')} 
              className="btn-3d btn-3d-green"
              style={{ padding: '12px 28px' }}
            >
              🚀 Enter as Demo Student
            </button>
            <button 
              onClick={() => startDemoSession('parent')} 
              className="btn-3d btn-3d-purple"
              style={{ padding: '12px 28px' }}
            >
              🔒 Enter Parent Portal
            </button>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-yellow-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: 'var(--color-yellow)'
            }}>
              <Flame size={32} fill="currentColor" className="animate-flame" />
            </div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Streak Tracking</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Study every day, protect your streak flame, and earn high levels and XP rewards!
            </p>
          </div>

          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-purple-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: 'var(--color-purple)'
            }}>
              <Sparkles size={32} />
            </div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>AI Teacher Chat</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Solve math equations or review spelling with Buddy, your personalized 24/7 AI tutor chatbot.
            </p>
          </div>

          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-green-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: 'var(--color-green)'
            }}>
              <Trophy size={32} />
            </div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Quizzes & Badges</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Take beautiful multiple-choice quizzes, unlock achievement badges, and review weak subject topics.
            </p>
          </div>

          <div className="card-buddy" style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-blue-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: 'var(--color-blue)'
            }}>
              <Award size={32} />
            </div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Parental Corner</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Secure dashboard where parents can set target study limit locks, customized quests, and store rewards!
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '30px 40px',
        backgroundColor: 'var(--bg-sidebar)',
        borderTop: '2px solid var(--border-light)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <p>© 2026 StudyBuddy App. Built with ❤️ for gamified education from Class 6 to 10.</p>
      </footer>
    </div>
  );
};
