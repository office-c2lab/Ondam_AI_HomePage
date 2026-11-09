import { useEffect, useRef, useState } from 'react';
import OndamSidebar, {
  OndamSidebarRail,
} from '../../../components/usersidebar/ondamsidebar/OndamSidebar.jsx';
import NewChatView from './components/NewChatView.jsx';
import ChatView from './components/ChatView.jsx';
import ProjectHomeView from './components/ProjectHomeView.jsx';
import VoiceConversationView from './components/VoiceConversationView.jsx';
import ToolBrowserView from './components/ToolBrowserView.jsx';
import LibraryView from './components/LibraryView.jsx';
import { createMockAnswer } from './components/mockResponses.js';
import usePreferencesStore from '../../../stores/preferencesStore.js';

const SCROLL_DEMO_PROMPT = '온담AI에서는 어떤 솔루션을 제공하나요?';

function mapProgress(progress, start, end) {
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

export default function OndamPage() {
  const isDarkModeEnabled = usePreferencesStore(state => state.isDarkModeEnabled);
  const characterThemeMode = isDarkModeEnabled ? 'dark' : 'light';
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.localStorage.getItem('ondam-sidebar-open') !== 'false';
  });
  const [sidebarOpenSection, setSidebarOpenSection] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [projectViewKey, setProjectViewKey] = useState(0);
  const [projectSettingsRequest, setProjectSettingsRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isResponding, setIsResponding] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollDemoProgress, setScrollDemoProgress] = useState(0);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(() => {
    return window.localStorage.getItem('ondam-assistant-enabled') === 'true';
  });
  const chatVersionRef = useRef(0);
  const responseTimersRef = useRef(new Set());

  const clearResponseTimers = () => {
    responseTimersRef.current.forEach(timerId => window.clearTimeout(timerId));
    responseTimersRef.current.clear();
  };

  const scheduleResponse = (callback, delay) => {
    const timerId = window.setTimeout(() => {
      responseTimersRef.current.delete(timerId);
      callback();
    }, delay);
    responseTimersRef.current.add(timerId);
  };

  useEffect(() => () => clearResponseTimers(), []);

  useEffect(() => {
    const updateScrollDemo = event => {
      if (
        event.source !== window.parent ||
        event.origin !== window.location.origin ||
        event.data?.type !== 'ondam-scroll-demo'
      ) {
        return;
      }

      setScrollDemoProgress(Math.max(0, Math.min(1, Number(event.data.progress) || 0)));
    };

    window.addEventListener('message', updateScrollDemo);
    return () => window.removeEventListener('message', updateScrollDemo);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('ondam-dark-active', isDarkModeEnabled);

    return () => document.body.classList.remove('ondam-dark-active');
  }, [isDarkModeEnabled]);

  const setSidebarOpen = isOpen => {
    setIsSidebarOpen(isOpen);
    window.localStorage.setItem('ondam-sidebar-open', String(isOpen));
  };

  const openSidebar = (section = null) => {
    setSidebarOpenSection(section);
    setSidebarOpen(true);
  };

  const setAssistantEnabled = isEnabled => {
    setIsAssistantEnabled(isEnabled);
    window.localStorage.setItem('ondam-assistant-enabled', String(isEnabled));
  };

  const startNewChat = (projectId = null, project = null, projectChats = []) => {
    clearResponseTimers();
    chatVersionRef.current += 1;
    setIsResponding(false);
    setIsLoadingHistory(false);
    setIsVoiceMode(false);
    setActiveMenu(null);
    setActiveChatId(null);
    setMessages([]);

    if (projectId && project) {
      setActiveProject({ ...project, chats: projectChats });
      setProjectViewKey(current => current + 1);
    } else {
      setActiveProject(null);
    }
  };

  const selectProject = (project, projectChats = []) => {
    clearResponseTimers();
    chatVersionRef.current += 1;
    setIsResponding(false);
    setIsLoadingHistory(false);
    setIsVoiceMode(false);
    setActiveMenu(null);
    setActiveProject({ ...project, chats: projectChats });
    setActiveChatId(null);
    setMessages([]);
    setProjectViewKey(current => current + 1);
  };

  const openProjectSettings = project => {
    if (!isSidebarOpen) setSidebarOpen(true);
    setProjectSettingsRequest({ projectId: project.id, requestId: Date.now() });
  };

  const updateProject = updatedProject => {
    setActiveProject(current =>
      current?.id === updatedProject.id ? { ...current, ...updatedProject } : current
    );
  };

  const submitPrompt = prompt => {
    if (isResponding || isLoadingHistory) return;

    const now = Date.now();
    const chatVersion = chatVersionRef.current;
    const userMessage = { id: `user-${now}`, role: 'user', content: prompt };
    const assistantMessageId = `assistant-${now}`;
    const answer = createMockAnswer(prompt);

    setIsResponding(true);
    setIsLoadingHistory(false);
    setActiveChatId(currentId => currentId ?? `new-${now}`);
    setMessages(currentMessages => [...currentMessages, userMessage]);

    scheduleResponse(() => {
      if (chatVersion !== chatVersionRef.current) return;

      let visibleLength = Math.min(3, answer.length);
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: answer.slice(0, visibleLength),
          isStreaming: true,
        },
      ]);

      const revealNextChunk = () => {
        if (chatVersion !== chatVersionRef.current) return;

        const currentCharacter = answer[visibleLength - 1];
        const chunkSize = /[.!?。\n]/.test(currentCharacter) ? 2 : 4;
        visibleLength = Math.min(answer.length, visibleLength + chunkSize);
        const isComplete = visibleLength >= answer.length;

        setMessages(currentMessages =>
          currentMessages.map(message =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: answer.slice(0, visibleLength),
                  isStreaming: !isComplete,
                }
              : message
          )
        );

        if (isComplete) {
          setIsResponding(false);
          return;
        }

        const nextDelay = /[.!?。\n]/.test(answer[visibleLength - 1]) ? 80 : 24;
        scheduleResponse(revealNextChunk, nextDelay);
      };

      scheduleResponse(revealNextChunk, 40);
    }, 750);
  };

  const selectChat = (chat, project = null) => {
    clearResponseTimers();
    chatVersionRef.current += 1;
    const chatVersion = chatVersionRef.current;
    setIsResponding(false);
    setIsLoadingHistory(true);
    setIsVoiceMode(false);
    setActiveMenu(null);
    if (project) {
      setActiveProject(current => ({
        ...project,
        chats: current?.id === project.id ? current.chats : [],
      }));
    } else {
      setActiveProject(null);
    }
    setActiveChatId(chat.id);
    setMessages([{ id: `${chat.id}-user`, role: 'user', content: chat.title }]);

    scheduleResponse(() => {
      if (chatVersion !== chatVersionRef.current) return;

      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: `${chat.id}-assistant`,
          role: 'assistant',
          content: createMockAnswer(chat.title),
        },
      ]);
      setIsLoadingHistory(false);
    }, 4200);
  };

  const selectSidebarMenu = menuId => {
    if (menuId !== 'plugins' && menuId !== 'library') return;

    clearResponseTimers();
    chatVersionRef.current += 1;
    setIsResponding(false);
    setIsLoadingHistory(false);
    setIsVoiceMode(false);
    setActiveMenu(menuId);
  };

  const isScrollDemo = window.parent !== window;
  const demoTypingProgress = mapProgress(scrollDemoProgress, 0.04, 0.38);
  const demoPrompt = SCROLL_DEMO_PROMPT.slice(
    0,
    Math.round(SCROLL_DEMO_PROMPT.length * demoTypingProgress)
  );
  const isDemoSubmitted = isScrollDemo && scrollDemoProgress >= 0.46;
  const demoAnswer = createMockAnswer(SCROLL_DEMO_PROMPT);
  const demoAnswerProgress = mapProgress(scrollDemoProgress, 0.6, 0.94);
  const demoAnswerLength = Math.round(demoAnswer.length * demoAnswerProgress);
  const demoCreditCost = Math.round(640 * demoAnswerProgress);
  const demoUser = {
    name: 'rex307',
    email: 'rex307@ondam.ai',
    plan: 'Plus',
    remainingCredits: 1000000 - demoCreditCost,
    totalCredits: 1000000,
  };
  const demoMessages = isDemoSubmitted
    ? [
        { id: 'scroll-demo-user', role: 'user', content: SCROLL_DEMO_PROMPT },
        ...(demoAnswerProgress > 0
          ? [
              {
                id: 'scroll-demo-assistant',
                role: 'assistant',
                content: demoAnswer.slice(0, Math.max(3, demoAnswerLength)),
                isStreaming: demoAnswerProgress < 1,
              },
            ]
          : []),
      ]
    : [];
  const isDemoResponding = isDemoSubmitted && demoAnswerProgress < 1;

  return (
    <div
      className={`flex h-full overflow-hidden bg-white text-[#0d0d0d] ${
        isDarkModeEnabled ? 'ondam-dark' : ''
      }`}
    >
      <div
        className={`h-full shrink-0 overflow-hidden transition-[width] duration-200 ease-out ${
          isSidebarOpen ? 'w-[292px]' : 'w-12'
        }`}
      >
        {isSidebarOpen ? (
          <OndamSidebar
            user={demoUser}
            activeChatId={activeMenu ? null : activeChatId}
            onNewChat={startNewChat}
            onSelectChat={selectChat}
            onSelectProject={selectProject}
            onSelectMenu={selectSidebarMenu}
            activeMenu={activeMenu}
            initialOpenSection={sidebarOpenSection}
            onProjectUpdated={updateProject}
            settingsRequest={projectSettingsRequest}
            onSettingsRequestHandled={() => setProjectSettingsRequest(null)}
            assistantEnabled={isAssistantEnabled}
            onAssistantEnabledChange={setAssistantEnabled}
            onClose={() => setSidebarOpen(false)}
          />
        ) : (
          <OndamSidebarRail
            onOpen={() => openSidebar()}
            onOpenSection={openSidebar}
            onNewChat={startNewChat}
            onSelectMenu={selectSidebarMenu}
            activeMenu={activeMenu}
            activeChatId={activeChatId}
          />
        )}
      </div>

      <main
        data-route-scroll-container
        className="min-w-0 flex-1 overflow-y-auto bg-white"
        aria-label="AI 채팅 영역"
      >
        {activeMenu === 'plugins' ? (
          <ToolBrowserView />
        ) : activeMenu === 'library' ? (
          <LibraryView />
        ) : isVoiceMode ? (
          <VoiceConversationView
            themeMode={characterThemeMode}
            onClose={() => setIsVoiceMode(false)}
          />
        ) : !activeChatId && activeProject ? (
          <ProjectHomeView
            key={`${activeProject.id}-${projectViewKey}`}
            project={activeProject}
            chats={activeProject.chats}
            onSubmit={submitPrompt}
            onSelectChat={selectChat}
            onOpenSettings={openProjectSettings}
            onStartVoice={() => setIsVoiceMode(true)}
          />
        ) : !activeChatId && !isDemoSubmitted ? (
          <NewChatView
            themeMode={characterThemeMode}
            onSubmit={submitPrompt}
            onStartVoice={() => setIsVoiceMode(true)}
            demoPrompt={isScrollDemo ? demoPrompt : null}
          />
        ) : (
          <ChatView
            messages={isDemoSubmitted ? demoMessages : messages}
            onSubmit={submitPrompt}
            isResponding={isDemoSubmitted ? isDemoResponding : isResponding}
            isLoadingHistory={isLoadingHistory}
            isAssistantEnabled={isAssistantEnabled}
            themeMode={characterThemeMode}
            onStartVoice={() => setIsVoiceMode(true)}
          />
        )}
      </main>
    </div>
  );
}
