/**
 * DashboardLayout.jsx
 *
 * Replaces the web layout pattern:
 *   <div className="layout">
 *     <Sidebar open={open} setOpen={setOpen} />
 *     <div className="content">
 *       <Header open={open} setOpen={setOpen} />
 *       {children}
 *     </div>
 *   </div>
 *
 * Usage — wrap each dashboard screen with this:
 *
 *   import DashboardLayout from '../components/DashboardLayout';
 *
 *   function StudentDashboard() {
 *     return (
 *       <DashboardLayout>
 *         <StudentInfoCard student={student} />
 *         <RegistrationStatusCard status="open" />
 *         ...
 *       </DashboardLayout>
 *     );
 *   }
 */

import { View, ScrollView, StyleSheet } from "react-native";
import { SidebarProvider } from "./SidebarContext";
import Header   from "./Header_student";
import Sidebar  from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    // SidebarProvider supplies shared open/toggle/close state
    // to both Header and Sidebar without prop drilling.
    <SidebarProvider>
      <View style={styles.root}>

        {/* Main column: header + scrollable content */}
        <View style={styles.column}>
          <Header />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
        </View>

        {/* Sidebar overlays on top via absolute positioning */}
        <Sidebar />

      </View>
    </SidebarProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  column: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
});

export default DashboardLayout;
