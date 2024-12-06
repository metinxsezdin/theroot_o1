import React, { useState } from "react";

const translations = {
  en: {
    welcome: "Welcome to Project Setup",
    followSteps: "Follow the steps below to set up the application.",
    step1: "Step 1: Install Dependencies",
    step1Desc: "Install necessary dependencies for the project.",
    install: "Install Dependencies",
    installing: "Installing...",
    step2: "Step 2: Configure Environment",
    step2Desc: "Set the necessary environment variables.",
    save: "Save Configuration",
    step3: "Step 3: Start Development Server",
    step3Desc: "Start the development server and view logs below.",
    startServer: "Start Server",
    running: "Running...",
    logs: "Logs",
    stepCompleted: "Step {step} of 3 completed.",
    language: "Language",
  },
  tr: {
    welcome: "Proje Kurulumuna Hoş Geldiniz",
    followSteps: "Uygulamayı kurmak için aşağıdaki adımları takip edin.",
    step1: "Adım 1: Bağımlılıkları Yükle",
    step1Desc: "Proje için gerekli bağımlılıkları yükleyin.",
    install: "Bağımlılıkları Yükle",
    installing: "Yükleniyor...",
    step2: "Adım 2: Ortam Değişkenlerini Yapılandır",
    step2Desc: "Gerekli ortam değişkenlerini ayarlayın.",
    save: "Yapılandırmayı Kaydet",
    step3: "Adım 3: Geliştirme Sunucusunu Başlat",
    step3Desc: "Geliştirme sunucusunu başlatın ve günlükleri görüntüleyin.",
    startServer: "Sunucuyu Başlat",
    running: "Çalışıyor...",
    logs: "Günlükler",
    stepCompleted: "3 adımdan {step} tamamlandı.",
    language: "Dil",
  },
};

const SetupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [installStatus, setInstallStatus] = useState("Pending");
  const [envStatus, setEnvStatus] = useState("Pending");
  const [serverStatus, setServerStatus] = useState("Pending");
  const [logs, setLogs] = useState("");
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const handleInstall = async () => {
    setInstallStatus("In Progress");
    setTimeout(() => {
      setInstallStatus("Success");
      setCurrentStep(2);
    }, 3000);
  };

  const handleEnvSave = () => {
    setEnvStatus("Success");
    setCurrentStep(3);
  };

  const handleServerStart = () => {
    setServerStatus("Running");
    setLogs("Server started at http://localhost:3000...");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="text-center p-6">
        <h1 className="text-3xl font-bold">{t.welcome}</h1>
        <p className="text-gray-600">{t.followSteps}</p>
        <button
          onClick={() => setLanguage(language === "en" ? "tr" : "en")}
          className="mt-4 px-4 py-2 text-white bg-indigo-600 rounded"
        >
          {t.language}: {language === "en" ? "Türkçe" : "English"}
        </button>
      </header>

      <div className="w-full max-w-xl space-y-6">
        {/* Step 1 */}
        <div className={`p-4 bg-white shadow rounded ${currentStep === 1 ? "border-l-4 border-indigo-600" : ""}`}>
          <h2 className="font-semibold">{t.step1}</h2>
          <p>{t.step1Desc}</p>
          <button
            onClick={handleInstall}
            className={`mt-3 px-4 py-2 text-white rounded ${installStatus === "Success" ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700"}`}
            disabled={installStatus === "Success" || installStatus === "In Progress"}
          >
            {installStatus === "In Progress" ? t.installing : t.install}
          </button>
        </div>

        {/* Step 2 */}
        <div className={`p-4 bg-white shadow rounded ${currentStep === 2 ? "border-l-4 border-indigo-600" : ""}`}>
          <h2 className="font-semibold">{t.step2}</h2>
          <p>{t.step2Desc}</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="API_KEY"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-600"
            />
            <button
              onClick={handleEnvSave}
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded"
            >
              {t.save}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`p-4 bg-white shadow rounded ${currentStep === 3 ? "border-l-4 border-indigo-600" : ""}`}>
          <h2 className="font-semibold">{t.step3}</h2>
          <p>{t.step3Desc}</p>
          <button
            onClick={handleServerStart}
            className={`mt-3 px-4 py-2 text-white rounded ${serverStatus === "Running" ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700"}`}
            disabled={serverStatus === "Running"}
          >
            {serverStatus === "Running" ? t.running : t.startServer}
          </button>
          <div className="mt-4 p-2 bg-gray-900 text-white rounded">
            <pre>{t.logs}: {logs}</pre>
          </div>
        </div>
      </div>

      <footer className="mt-8">
        <p className="text-gray-600">
          {t.stepCompleted.replace("{step}", currentStep.toString())}
        </p>
      </footer>
    </div>
  );
};

export default SetupPage;
