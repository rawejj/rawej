import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/providers/TranslationsProvider';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void;
  onReject: () => void;
  onAcceptAll?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onReject, onAcceptAll }) => {
  const { t } = useTranslations();
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    if (onAcceptAll) {
      onAcceptAll();
    } else {
      onAccept({
        essential: true,
        analytics: true,
        marketing: true,
      });
    }
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  const handleRejectAll = () => {
    onReject();
  };

  const togglePreference = (key: keyof Omit<CookiePreferences, 'essential'>) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-t-2xl" />

      {/* Main banner */}
      <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-t-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6">
            {/* Header with icon */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold dark:text-white mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('cookieConsent.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('cookieConsent.description')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="shrink-0 ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                aria-label={t('cookieConsent.customize')}
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Cookie categories with smooth animation */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Cookie Preferences
                </h4>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                  {/* Essential Cookies */}
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {t('cookieConsent.categories.essential.title')}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {t('cookieConsent.categories.essential.description')}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-sm">📊</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {t('cookieConsent.categories.analytics.title')}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {t('cookieConsent.categories.analytics.description')}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => togglePreference('analytics')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                      />
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {t('cookieConsent.categories.marketing.title')}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {t('cookieConsent.categories.marketing.description')}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => togglePreference('marketing')}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons with improved styling */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('cookieConsent.acceptAll')}
              </button>
              {showDetails && (
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {t('cookieConsent.acceptSelected')}
                </button>
              )}
              <button
                onClick={handleRejectAll}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('cookieConsent.rejectAll')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;