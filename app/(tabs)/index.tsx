import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import WeatherWarning from "../components/WeatherWarning";

type Warning = {
  id: string;
  title: string;
  description: string;
  severity: string;
  approximateStart: number | string;
  approximateEnd: number | string;
};

const ENDPOINT =
  "https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json";

export default function Index() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track if component is still mounted to prevent updating state after unmount
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
        Aktuella vädervarningar i Sverige:
      </Text>
      {loading ? (
        <Text style={[styles.status, { marginTop: 10 }]}>
          Laddar varningar...
        </Text>
      ) : error ? (
        <Text style={[styles.status, { marginTop: 10 }]}>Fel: {error}</Text>
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

// function that parses api data into an array of Warning objects
function mapSmhiWarnings(data: unknown): Warning[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const warnings: Warning[] = [];

  // go through each weather event in the data array
  data.forEach((event: any) => {
    const warningAreas = event.warningAreas || [];

    // loop through each warning area (each area is a separate warning)
    warningAreas.forEach((area: any) => {
      const eventName = event.event?.sv || event.event?.en || "Vädervarning";
      const areaName = area.areaName?.sv || area.areaName?.en || "";
      const approximateStart = area.approximateStart || Date.now();
      const approximateEnd = area.approximateEnd || "Okänt slutdatum";
      const level = area.warningLevel?.code || "YELLOW";

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
        title: `${eventName} - ${areaName}`, // combine event and area names
        description: descriptionText,
        severity: level.toLowerCase(), // convert severity to lowercase (yellow/orange/red)
        approximateStart: `Börjar: ${approximateStart}`,
        approximateEnd: `Slutar: ${approximateEnd}`,
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
