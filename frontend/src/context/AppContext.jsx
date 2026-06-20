import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

// Language Translation Dictionary
const translations = {
  en: {
    title: 'Study Buddy',
    landingTagline: 'Personalized study companion for Andhra Pradesh students!',
    landingDesc: 'Study Buddy aligns with SSC State Board & CBSE syllabuses for Class 6 to 10. Improve performance with StudyGuru AI, adaptive daily schedules, interactive quizzes, and rewards!',
    startJourney: 'Start Learning!',
    parentPortal: 'Parent Portal',
    navDashboard: 'Dashboard',
    navPlanner: 'Syllabus Tracker',
    navQuizzes: 'Quiz Center',
    navAITeacher: 'StudyGuru AI',
    navProgress: 'Progress Report',
    navSettings: 'Settings',
    streak: 'Streak',
    xp: 'XP',
    coins: 'Coins',
    level: 'Level',
    dailyQuests: 'Daily Study Plan',
    questsCompleted: 'lessons completed',
    homeworkList: 'Homework Tracker',
    weakSubjects: 'Areas to Improve',
    badgesEarned: 'Badges Earned',
    settingsTheme: 'App Theme',
    settingsLanguage: 'Preferred Language',
    parentDashboardTitle: 'Parent Dashboard',
    setupPin: 'Setup Parent PIN',
    rewardsShop: 'Rewards Shop',
    addCustomQuest: 'Add Custom Quest',
    lockOutMsg: 'Daily study limit reached! Time to take a break!',
    logout: 'Log Out'
  },
  hi: {
    title: 'स्टडी बडी',
    landingTagline: 'आंध्र प्रदेश के छात्रों के लिए व्यक्तिगत शिक्षण मंच!',
    landingDesc: 'स्टडी बडी कक्षा 6 से 10 के लिए एसएससी स्टेट बोर्ड और सीबीएसई सिलेबस के साथ संरेखित है। स्टडीगुरु एआई, दैनिक अध्ययन योजनाओं और क्विज़ के साथ सीखें!',
    startJourney: 'सीखना शुरू करें!',
    parentPortal: 'अभिभावक पोर्टल',
    navDashboard: 'डैशबोर्ड',
    navPlanner: 'पाठ्यक्रम ट्रैकर',
    navQuizzes: 'क्विज़ केंद्र',
    navAITeacher: 'स्टडीगुरु एआई',
    navProgress: 'प्रगति रिपोर्ट',
    navSettings: 'सेटिंग्स',
    navSettings: 'सेटिंग्स',
    streak: 'लगातार दिन',
    xp: 'एक्सपी (XP)',
    coins: 'सिक्के',
    level: 'स्तर',
    dailyQuests: 'दैनिक अध्ययन योजना',
    questsCompleted: 'पाठ समाप्त हुए',
    homeworkList: 'गृहकार्य ट्रैकर',
    weakSubjects: 'अभ्यास के क्षेत्र',
    badgesEarned: 'अर्जित बैज',
    settingsTheme: 'ऐप थीम',
    settingsLanguage: 'पसंदीदा भाषा',
    parentDashboardTitle: 'अभिभावक डैशबोर्ड',
    setupPin: 'पैरेंट पिन सेट करें',
    rewardsShop: 'पुरस्कार स्टोर',
    addCustomQuest: 'कस्टम कार्य जोड़ें',
    lockOutMsg: 'दैनिक अध्ययन की सीमा समाप्त हो गई है! अब आराम करने का समय है!',
    logout: 'लॉग आउट'
  },
  te: {
    title: 'స్టడీ బడ్డీ',
    landingTagline: 'ఆంధ్రప్రదేశ్ విద్యార్థుల కోసం వ్యక్తిగతీకరించిన అధ్యయన తోడు!',
    landingDesc: 'స్టడీ బడ్డీ 6 నుండి 10 తరగతుల వరకు SSC స్టేట్ బోర్డ్ మరియు CBSE సిలబస్‌లకు అనుగుణంగా రూపొందించబడింది. స్టడీగురు AI, వ్యక్తిగత అధ్యయన ప్రణాళికలు మరియు ఇంటరాక్టివ్ క్విజ్‌లతో నేర్చుకోండి!',
    startJourney: 'నేర్చుకోవడం ప్రారంభించండి!',
    parentPortal: 'తల్లిదండ్రుల పోర్టల్',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navPlanner: 'సిలబస్ ట్రాకర్',
    navQuizzes: 'క్విజ్ సెంటర్',
    navAITeacher: 'స్టడీగురు AI',
    navProgress: 'ప్రగతి నివేదిక',
    navSettings: 'సెట్టింగ్‌లు',
    streak: 'స్ట్రీక్',
    xp: 'XP',
    coins: 'నాణేలు',
    level: 'స్థాయి',
    dailyQuests: 'రోజువారీ అధ్యయన ప్రణాళిక',
    questsCompleted: 'పాఠాలు పూర్తయ్యాయి',
    homeworkList: 'హోంవర్క్ ట్రాకర్',
    weakSubjects: 'మెరుగుపరచవలసిన అంశాలు',
    badgesEarned: 'సాధించిన బ్యాడ్జీలు',
    settingsTheme: 'యాప్ థీమ్',
    settingsLanguage: 'ప్రాధాన్య భాష',
    parentDashboardTitle: 'తల్లిదండ్రుల డ్యాష్‌బోర్డ్',
    setupPin: 'తల్లిదండ్రుల పిన్ సెటప్',
    rewardsShop: 'బహుమతుల దుకాణం',
    addCustomQuest: 'కస్టమ్ పనిని జోడించు',
    lockOutMsg: 'రోజువారీ అధ్యయన పరిమితి ముగిసింది! విశ్రాంతి తీసుకోండి!',
    logout: 'లాగ్ అవుట్'
  }
};

const ToastItem = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className="animate-bounce-in"
      style={{
        padding: '16px 20px',
        backgroundColor: notification.type === 'green' || notification.type === 'success' ? 'var(--color-green)' : notification.type === 'purple' ? 'var(--color-purple)' : notification.type === 'yellow' ? 'var(--color-yellow)' : 'var(--color-red)',
        color: notification.type === 'yellow' ? '#3c3c3c' : '#ffffff',
        borderRadius: 'var(--radius-sm)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        fontWeight: '600',
        fontSize: '1.05rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: `4px solid ${notification.type === 'green' || notification.type === 'success' ? 'var(--color-green-dark)' : notification.type === 'purple' ? 'var(--color-purple-dark)' : notification.type === 'yellow' ? 'var(--color-yellow-dark)' : 'var(--color-red-dark)'}`
      }}
    >
      <span>{notification.text}</span>
      <button
        onClick={() => onDismiss(notification.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1.4rem',
          opacity: 0.8,
          flexShrink: 0,
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1',
          outline: 'none'
        }}
      >
        ×
      </button>
    </div>
  );
};

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState(localStorage.getItem('studybuddy_theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('studybuddy_language') || 'en');
  const [notifications, setNotifications] = useState([]);
  const [parentLock, setParentLock] = useState(false); // Used to lock screen if limit is hit

  // Apply Theme class/attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studybuddy_theme', theme);
  }, [theme]);

  // Save language selection
  useEffect(() => {
    localStorage.setItem('studybuddy_language', language);
  }, [language]);

  // Navigate helper
  const navigate = (page) => {
    if (parentLock && page !== 'parent-dashboard' && page !== 'landing') {
      triggerNotification('🚫 Screen Locked: Parent study limit reached for today!', 'red');
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Smart notification alert triggering
  const triggerNotification = (text, type = 'green') => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, text, type }]);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        theme,
        setTheme,
        language,
        setLanguage,
        notifications,
        triggerNotification,
        parentLock,
        setParentLock,
        t
      }}
    >
      {children}
      
      {/* Dynamic Global Toast Notifications Banner */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '350px'
      }}>
        {notifications.map((n) => (
          <ToastItem
            key={n.id}
            notification={n}
            onDismiss={(id) => setNotifications((prev) => prev.filter((item) => item.id !== id))}
          />
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
