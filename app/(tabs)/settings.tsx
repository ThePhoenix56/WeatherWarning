import { LinearGradient } from "expo-linear-gradient";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SWEDISH_COUNTIES, useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { language, setLanguage, county, setCounty, isLoading } = useSettings();

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#387c6d", "#3b5998", "#198815"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#387c6d", "#3b5998", "#198815"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={{ ...styles.title, marginTop: 20 }}>Inställningar</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "en" ? "Language" : "Språk"}
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, language === "sv" && styles.buttonActive]}
              onPress={() => setLanguage("sv")}
            >
              <Text
                style={[
                  styles.buttonText,
                  language === "sv" && styles.buttonTextActive,
                ]}
              >
                Svenska
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, language === "en" && styles.buttonActive]}
              onPress={() => setLanguage("en")}
            >
              <Text
                style={[
                  styles.buttonText,
                  language === "en" && styles.buttonTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* County Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "en" ? "Select County" : "Välj läns"}
          </Text>
          <Text style={styles.description}>
            {language === "en"
              ? "Warnings in your local area will be shown on the Local tab"
              : "Varningar i ditt lokala område visas i fliken Lokalt"}
          </Text>
          <ScrollView
            style={styles.countyList}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {SWEDISH_COUNTIES.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={[
                  styles.countyButton,
                  county === c.code && styles.countyButtonActive,
                ]}
                onPress={() => setCounty(c.code)}
              >
                <Text
                  style={[
                    styles.countyText,
                    county === c.code && styles.countyTextActive,
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.currentSelection}>
          <Text style={styles.currentLabel}>
            {language === "en" ? "Current Selection:" : "Nuvarande val:"}
          </Text>
          <Text style={styles.currentValue}>
            {language === "en" ? "Language:" : "Språk:"}{" "}
            {language === "en" ? "English" : "Svenska"}
          </Text>
          <Text style={styles.currentValue}>
            {language === "en" ? "County:" : "Län:"}{" "}
            {SWEDISH_COUNTIES.find((c) => c.code === county)?.name}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 15,
  },
  description: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  buttonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "white",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  buttonTextActive: {
    color: "white",
  },
  countyList: {
    maxHeight: 300,
    marginTop: 10,
  },
  countyButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  countyButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderLeftColor: "white",
  },
  countyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  countyTextActive: {
    color: "white",
    fontWeight: "600",
  },
  currentSelection: {
    marginTop: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 15,
  },
  currentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  currentValue: {
    fontSize: 13,
    color: "white",
    marginBottom: 6,
  },
});
