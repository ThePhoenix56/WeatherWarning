import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import WeatherWarning from "../components/WeatherWarning";
import { useSettings } from "../context/SettingsContext";

type WarningData = {
  id: string;
  title: {
    sv: string;
    en: string;
  };
  description: string;
  severity: string;
  approximateStart: number | string;
  approximateEnd: number | string;
  areaCode?: string;
};

const ENDPOINT =
  "https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json";

export default function Index() {
  const [warnings, setWarnings] = useState<WarningData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useSettings();

  const titleText =
    language === "en"
      ? "Current weather warnings in Sweden:"
      : "Aktuella vädervarningar i Sverige:";

  const loadingText =
    language === "en" ? "Loading warnings..." : "Laddar varningar...";
  const errorPrefix = language === "en" ? "Error: " : "Fel: ";

  useEffect(() => {
    let isMounted = true;

    const loadWarnings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(ENDPOINT);
        // check for http 200+
        if (!response.ok) {
          throw new Error(`SMHI request failed: ${response.status}`);
        }

        const data = await response.json();
        // map api data to warning objects
        const mapped = mapSmhiWarnings(data);

        if (isMounted) {
          setWarnings(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // load warnings
    loadWarnings();

    // cleanup function that runs when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LinearGradient
      colors={["#387c6d", "#3b5998", "#198815"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={[styles.title, { marginTop: 15, marginBottom: 15 }]}>
        {titleText}
      </Text>
      {loading ? (
        <Text style={[styles.status, { marginTop: 10 }]}>{loadingText}</Text>
      ) : error ? (
        <Text style={[styles.status, { marginTop: 10 }]}>
          {errorPrefix}
          {error}
        </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {warnings.map((warning) => (
            <WeatherWarning key={warning.id} warning={warning} />
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

// function that parses api data into an array of WarningData objects
function mapSmhiWarnings(data: unknown): WarningData[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const warnings: WarningData[] = [];

  // go through each weather event in the data array
  data.forEach((event: any) => {
    const warningAreas = event.warningAreas || [];

    // loop through each warning area (each area is a separate warning)
    warningAreas.forEach((area: any) => {
      // Get title in both languages
      const eventNameSv = event.event?.sv || "Vädervarning";
      const eventNameEn = event.event?.en || "Weather Warning";
      const areaNameSv = area.areaName?.sv || "";
      const areaNameEn = area.areaName?.en || "";

      const approximateStart = area.approximateStart || Date.now();
      const approximateEnd = area.approximateEnd || "Okänt slutdatum";
      const level = area.warningLevel?.code || "YELLOW";
      const areaCode = area.areaCode || "";

      let descriptionText = "";
      if (area.descriptions && area.descriptions.length > 0) {
        descriptionText = area.descriptions
          // exclude area names at the end of the description
          .filter((desc: any) => desc.title?.code !== "WHERE")
          .map((desc: any) => desc.text?.sv || desc.text?.en || "")
          .join(" ");
      }

      warnings.push({
        id: String(area.id), // convert area ID to string
        title: {
          sv: `${eventNameSv} - ${areaNameSv}`,
          en: `${eventNameEn} - ${areaNameEn}`,
        },
        description: descriptionText,
        severity: level.toLowerCase(), // convert severity to lowercase (yellow/orange/red)
        approximateStart: approximateStart,
        approximateEnd: approximateEnd,
        areaCode: areaCode, // store area code for county-based filtering
      });
    });
  });

  // sort warnings so most severe appear first
  warnings.sort((a, b) => {
    // red is most severe followed by orange and yellow
    const severityOrder: { [key: string]: number } = {
      red: 0,
      orange: 1,
      yellow: 2,
    };

    // get the order value for warning a (default to 3 if severity not found)
    const orderA = severityOrder[a.severity] ?? 3;
    // get the order value for warning b (default to 3 if severity not found)
    const orderB = severityOrder[b.severity] ?? 3;

    // return negative number if a should come first, positive if b should come first
    return orderA - orderB;
  });

  // return the sorted array of warnings
  return warnings;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontFamily: "System",
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: "white",
    marginTop: 10,
  },
  list: {
    paddingBottom: 40,
    width: "100%",
  },
});
