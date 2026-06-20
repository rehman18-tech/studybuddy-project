import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Mascot } from '../components/Mascot';
import { Mail, Lock, User, GraduationCap, School, ShieldCheck, Phone, Globe, BookOpen } from 'lucide-react';

export const AuthPage = () => {
  const { login, register, sendPasswordReset, startDemoSession } = useAuth();
  const { navigate, triggerNotification } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [studentClass, setStudentClass] = useState('6');
  const [schoolName, setSchoolName] = useState('');
  const [schoolType, setSchoolType] = useState('Public');
  const [board, setBoard] = useState('SSC');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [parentContact, setParentContact] = useState('');
  const [parentPin, setParentPin] = useState('1234');
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      triggerNotification('Please enter your email address.', 'red');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'forgot') {
        await sendPasswordReset(email);
        setAuthMode('login');
      } else if (authMode === 'register') {
        if (!email || !password || !name) {
          triggerNotification('⚠️ Please fill out all required fields!', 'red');
          setLoading(false);
          return;
        }
        await register({
          name,
          email,
          password,
          role,
          studentClass: role === 'student' ? Number(studentClass) : undefined,
          schoolName: role === 'student' ? schoolName : undefined,
          schoolType: role === 'student' ? schoolType : undefined,
          board: role === 'student' ? board : undefined,
          preferredLanguage: role === 'student' ? preferredLanguage : undefined,
          parentContact: role === 'student' ? parentContact : undefined,
          parentPin: role === 'student' ? parentPin : undefined
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, var(--bg-app) 0%, var(--border-light) 100%)'
    }}>
      <div className="card-buddy" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '40px 30px',
        backgroundColor: 'var(--bg-card)',
        textAlign: 'center'
      }}>
        {/* Floating Mascot */}
        <div style={{ marginTop: '-70px', marginBottom: '15px' }}>
          <Mascot size={100} expression={authMode === 'register' ? 'thinking' : authMode === 'forgot' ? 'confused' : 'happy'} />
        </div>

        <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
          {authMode === 'register' ? 'Join Study Buddy!' : authMode === 'forgot' ? 'Reset Password' : 'Welcome Back!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '25px', fontWeight: '600', fontSize: '0.92rem' }}>
          {authMode === 'register' ? 'Create student profile for Andhra Pradesh State Board & CBSE' : authMode === 'forgot' ? 'Enter your email to receive a password reset link' : 'Sign in to access quizzes, schedules and StudyGuru AI'}
        </p>

        {/* Tab Selector (only show if not in forgot password mode) */}
        {authMode !== 'forgot' && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px',
            marginBottom: '25px'
          }}>
            <button
              onClick={() => setAuthMode('login')}
              type="button"
              style={{
                flex: 1, padding: '10px', border: 'none',
                background: authMode === 'login' ? 'var(--bg-card)' : 'transparent',
                fontFamily: 'var(--font-header)', fontSize: '0.95rem',
                borderRadius: 'calc(var(--radius-sm) - 4px)', cursor: 'pointer',
                color: authMode === 'login' ? 'var(--color-green)' : 'var(--text-muted)',
                fontWeight: '700', transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              type="button"
              style={{
                flex: 1, padding: '10px', border: 'none',
                background: authMode === 'register' ? 'var(--bg-card)' : 'transparent',
                fontFamily: 'var(--font-header)', fontSize: '0.95rem',
                borderRadius: 'calc(var(--radius-sm) - 4px)', cursor: 'pointer',
                color: authMode === 'register' ? 'var(--color-green)' : 'var(--text-muted)',
                fontWeight: '700', transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Panel */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                    fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                  }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="student@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                  fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                }}
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                    fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                  }}
                  required
                />
              </div>
            </div>
          )}

          {/* Registration AP Student Metadata Fields */}
          {authMode === 'register' && (
            <>
              {/* Role Select */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Registering as</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                    fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                  }}
                >
                  <option value="student">Student Profile</option>
                  <option value="parent">Parent Profile</option>
                </select>
              </div>

              {role === 'student' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Class / Grade</label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        style={{
                          width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                          fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', fontWeight: 'bold'
                        }}
                      >
                        {[6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>Class {num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Curriculum Board</label>
                      <select
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        style={{
                          width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                          fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', fontWeight: 'bold'
                        }}
                      >
                        <option value="SSC">SSC (State Board)</option>
                        <option value="CBSE">CBSE aligned</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>School Name</label>
                    <div style={{ position: 'relative' }}>
                      <School size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="e.g. ZP High School, Nellore"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        style={{
                          width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                          fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>School Management</label>
                      <select
                        value={schoolType}
                        onChange={(e) => setSchoolType(e.target.value)}
                        style={{
                          width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                          fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                        }}
                      >
                        <option value="Public">Public School</option>
                        <option value="Private">Private School</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Study Medium</label>
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        style={{
                          width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                          fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                        }}
                      >
                        <option value="English">English</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Parent Contact Number</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                        <input
                          type="tel"
                          placeholder="Parent mobile number"
                          value={parentContact}
                          onChange={(e) => setParentContact(e.target.value)}
                          style={{
                            width: '100%', padding: '12px 12px 12px 38px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                            fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none'
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>Parent Pin (4 digits)</label>
                      <div style={{ position: 'relative' }}>
                        <ShieldCheck size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="1234"
                          value={parentPin}
                          onChange={(e) => setParentPin(e.target.value.replace(/\D/g, ''))}
                          style={{
                            width: '100%', padding: '12px 12px 12px 32px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-light)',
                            fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', fontWeight: 'bold', textAlign: 'center'
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Forgot Password trigger */}
          {authMode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-5px' }}>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                style={{
                  background: 'none', border: 'none', color: 'var(--color-purple)',
                  fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline'
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn-3d btn-3d-green"
            style={{ width: '100%', marginTop: '10px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : authMode === 'forgot' ? 'Send Password Reset Email' : authMode === 'register' ? 'Register & Start Studying!' : 'Sign In'}
          </button>
        </form>

        {/* Back link for Forgot Password */}
        {authMode === 'forgot' && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{
                background: 'none', border: 'none', color: 'var(--color-green)',
                fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Developer Bypass */}
        {authMode !== 'forgot' && (
          <div style={{ marginTop: '20px', borderTop: '2px solid var(--border-light)', paddingTop: '15px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
              Testing out the platform as a developer?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => startDemoSession('student')} 
                style={{
                  background: 'none', border: 'none', color: 'var(--color-green)', fontFamily: 'var(--font-header)',
                  fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                Demo Student
              </button>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <button 
                onClick={() => startDemoSession('parent')} 
                style={{
                  background: 'none', border: 'none', color: 'var(--color-purple)', fontFamily: 'var(--font-header)',
                  fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                Demo Parent
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('landing')}
          style={{
            marginTop: '25px', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem',
            textDecoration: 'underline'
          }}
        >
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};
