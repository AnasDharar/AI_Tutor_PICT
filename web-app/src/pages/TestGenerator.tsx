import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Download, ChevronDown } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const TestGenerator = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [testGenerated, setTestGenerated] = useState(false);

  const topics = [
    t('testGenerator.topics.math'),
    t('testGenerator.topics.fractions'),
    t('testGenerator.topics.science'),
    t('testGenerator.topics.plants'),
    t('testGenerator.topics.electricity'),
    t('testGenerator.topics.english'),
  ];

  const difficulties = [
    t('testGenerator.difficulties.easy'),
    t('testGenerator.difficulties.medium'),
    t('testGenerator.difficulties.hard'),
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getLanguageLabel = () => {
    if (language === "hi") return "हिंदी";
    if (language === "mr") return "मराठी";
    return "EN";
  };

  const sampleQuestions = [
    {
      question: "What is 15 + 27?",
      options: ["42", "41", "43", "40"],
      correct: 0,
    },
    {
      question: "Which of these is a prime number?",
      options: ["4", "6", "7", "9"],
      correct: 2,
    },
    {
      question: "What is 8 × 7?",
      options: ["54", "56", "58", "64"],
      correct: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('testGenerator.title')} />

      <main className="max-w-lg mx-auto px-4 py-6">
        {!testGenerated ? (
          <>
            {/* Topic Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t('testGenerator.selectTopic')}
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                  className="w-full h-14 px-4 rounded-xl bg-card border border-border flex items-center justify-between text-left"
                >
                  <span className={selectedTopic ? "text-foreground" : "text-muted-foreground"}>
                    {selectedTopic || t('testGenerator.chooseTopic')}
                  </span>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </button>
                {showTopicDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setShowTopicDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t('testGenerator.difficultyLevel')}
              </label>
              <div className="flex gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${selectedDifficulty === diff
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-primary/30"
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Display */}
            <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">{t('testGenerator.questionsIn')}</p>
              <p className="font-bold text-foreground text-lg">
                {language === "hi" ? "हिंदी" : language === "mr" ? "मराठी" : "English"}
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={() => setTestGenerated(true)}
              disabled={!selectedTopic}
              className="w-full h-14 text-lg font-bold"
            >
              <Play className="w-5 h-5 mr-2" />
              {t('testGenerator.generateTest')}
            </Button>

            {/* Offline Practice Option */}
            <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-start gap-3">
                <Download className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground">{t('testGenerator.practiceOffline')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('testGenerator.practiceOfflineDesc')}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Generated Test */}
            <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="font-semibold text-primary">
                {selectedTopic} • {selectedDifficulty}
              </p>
              <p className="text-sm text-muted-foreground">3 Questions</p>
            </div>

            <div className="space-y-4">
              {sampleQuestions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 rounded-xl bg-card border border-border">
                  <p className="font-semibold text-foreground mb-4">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        className="w-full p-3 rounded-lg bg-muted text-left hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                      >
                        {String.fromCharCode(65 + oIndex)}. {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setTestGenerated(false)} className="flex-1">
                {t('testGenerator.newTest')}
              </Button>
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                {t('testGenerator.saveOffline')}
              </Button>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default TestGenerator;
