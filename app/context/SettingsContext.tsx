import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

// type definitions for settings
export type Language = "sv" | "en";

// list of län
export const SWEDISH_COUNTIES = [
  { code: "AB", name: "Stockholms län" },
  { code: "AC", name: "Västmanlands län" },
  { code: "BD", name: "Sörmlands län" },
  { code: "C", name: "Uppsala län" },
  { code: "D", name: "Värmlands län" },
  { code: "E", name: "Gävleborgs län" },
  { code: "F", name: "Västnorrlands län" },
  { code: "G", name: "Jämtlands län" },
  { code: "H", name: "Västergötlands län" },
  { code: "I", name: "Hallands län" },
  { code: "K", name: "Kalmar län" },
  { code: "L", name: "Kronobergs län" },
  { code: "M", name: "Blekinge län" },
  { code: "N", name: "Skåne län" },
  { code: "O", name: "Jönköpings län" },
  { code: "S", name: "Västra Götalands län" },
  { code: "T", name: "Örebro län" },
  { code: "U", name: "Dalarnas län" },
  { code: "W", name: "Dalarna" },
  { code: "X", name: "Västerbottens län" },
  { code: "Y", name: "Norrbottens län" },
  { code: "Z", name: "Gotlands län" },
];

// settings context type
interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  county: string;
  setCounty: (county: string) => Promise<void>;
  isLoading: boolean;
}

// create context with default values
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("sv");
  const [county, setCountyState] = useState<string>("AB");
  const [isLoading, setIsLoading] = useState(true);

  // load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedLanguage, savedCounty] = await Promise.all([
        AsyncStorage.getItem("language"),
        AsyncStorage.getItem("county"),
      ]);

      if (savedLanguage && (savedLanguage === "sv" || savedLanguage === "en")) {
        setLanguageState(savedLanguage as Language);
      }
      if (savedCounty && SWEDISH_COUNTIES.some((c) => c.code === savedCounty)) {
        setCountyState(savedCounty);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // function to save and update language
  const handleSetLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguageState(lang);
    } catch (err) {
      console.error("Error saving language:", err);
    }
  };

  // function to save and update county
  const handleSetCounty = async (newCounty: string) => {
    try {
      await AsyncStorage.setItem("county", newCounty);
      setCountyState(newCounty);
    } catch (err) {
      console.error("Error saving county:", err);
    }
  };

  const value: SettingsContextType = {
    language,
    setLanguage: handleSetLanguage,
    county,
    setCounty: handleSetCounty,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// custom hook to use settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

// helper function to get text in the selected language
export function getText(
  svText: string | undefined,
  enText: string | undefined,
  language: Language,
): string {
  if (language === "en") {
    return enText || svText || "";
  }
  return svText || enText || "";
}

// helper function to format date based on language
export function formatDate(value: number | string, language: Language): string {
  const rawValue =
    typeof value === "string"
      ? value
          .replace(/^Börjar:\s*/i, "")
          .replace(/^Slutar:\s*/i, "")
          .trim()
      : value;

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return language === "en" ? "Unknown date" : "Okänt datum";
  }

  const locale = language === "en" ? "en-GB" : "sv-SE";
  const timeZone = "Europe/Stockholm";

  const datePart = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const timePart = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  if (language === "en") {
    return `${datePart} at ${timePart} Stockholm time`;
  }
  return `${datePart} kl. ${timePart} svensk tid`;
}
