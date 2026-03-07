import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.section}>
        <Text style={styles.brand}>Faculty Academic Portal System</Text>
        <TouchableOpacity>
          <Text style={styles.link}>About Programmers</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity>
          <Text style={styles.link}>IT Support</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Contact IT</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>About Authors</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.copyright}>© 2026 Faculty of Science</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#1a3c6e",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  brand: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  link: {
    color: "#a8c4e0",
    fontSize: 13,
    marginBottom: 4,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#2e5a96",
    paddingTop: 12,
    alignItems: "center",
  },
  copyright: {
    color: "#a8c4e0",
    fontSize: 12,
  },
});

export default Footer;
