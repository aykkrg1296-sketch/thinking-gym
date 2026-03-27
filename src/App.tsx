import { useState, useEffect } from 'react';
import type { ModuleId } from './data/types';
import { modules } from './data/modules';
import { useProgress } from './hooks/useProgress';
import { useAI } from './hooks/useAI';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Training } from './components/Training';
import { Onboarding } from './components/Onboarding';
import { Settings } from './components/Settings';
import { BottomTab } from './components/BottomTab';
import type { TabId } from './components/BottomTab';
import { MyShape } from './components/MyShape';
import { Notes } from './components/Notes';
import { Glossary } from './components/Glossary';

const ONBOARDING_KEY = 'thinking-gym-onboarded';

type View =
  | { type: 'onboarding' }
  | { type: 'tabs'; tab: TabId }
  | { type: 'training'; moduleId: ModuleId };

export default function App() {
  const [view, setView] = useState<View>(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    return done ? { type: 'tabs', tab: 'lab' } : { type: 'onboarding' };
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const { progress, completeQuestion, addInsight, getModuleProgress } = useProgress();
  const ai = useAI();

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setView({ type: 'tabs', tab: 'lab' });
  };

  const handleSelectModule = (moduleId: ModuleId) => {
    setView({ type: 'training', moduleId });
  };

  const handleBack = () => {
    setView({ type: 'tabs', tab: 'lab' });
  };

  const handleShowOnboarding = () => {
    setView({ type: 'onboarding' });
  };

  const handleTabChange = (tab: TabId) => {
    setView({ type: 'tabs', tab });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Onboarding — full screen, no tabs
  if (view.type === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Training — full screen with back button
  if (view.type === 'training') {
    const modInfo = modules.find(m => m.id === view.moduleId)!;
    const modProgress = getModuleProgress(view.moduleId);
    return (
      <div className="app-shell">
        <Header
          onBack={handleBack}
          title={modInfo.title}
          streak={progress.streak}
          onSettings={() => setShowSettings(true)}
          onGlossary={() => setShowGlossary(true)}
        />
        <div className="app-main">
          <Training
            moduleId={view.moduleId}
            completedQuestions={modProgress.completedQuestions}
            onComplete={qId => completeQuestion(view.moduleId, qId)}
            onInsight={(qId, text) => addInsight(view.moduleId, qId, text)}
            ai={ai}
          />
        </div>
        {showSettings && (
          <Settings apiKey={ai.apiKey} onSave={ai.setApiKey} onClose={() => setShowSettings(false)} />
        )}
        <Glossary isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
      </div>
    );
  }

  // Tab views
  const currentTab = view.tab;

  return (
    <div className="app-shell">
      <Header
        streak={progress.streak}
        onSettings={() => setShowSettings(true)}
        onGlossary={() => setShowGlossary(true)}
      />
      <div className="app-main">
        {currentTab === 'lab' && (
          <Home onSelectModule={handleSelectModule} progress={progress} />
        )}
        {currentTab === 'myshape' && (
          <MyShape progress={progress} />
        )}
        {currentTab === 'notes' && (
          <Notes progress={progress} onShowOnboarding={handleShowOnboarding} />
        )}
      </div>
      <BottomTab active={currentTab} onChange={handleTabChange} />
      {showSettings && (
        <Settings apiKey={ai.apiKey} onSave={ai.setApiKey} onClose={() => setShowSettings(false)} />
      )}
      <Glossary isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
    </div>
  );
}
