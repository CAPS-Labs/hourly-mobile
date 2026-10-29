import { StatusBar } from "expo-status-bar";

import AppTabs from "./src/navigation/AppTabs";
import { AppStateProvider } from "./src/context/AppStateContext";

/**
 * Root of the app: supplies the shared organization state and renders the
 * tab navigation shell.
 */
export default function App() {
  return (
    <AppStateProvider>
      {/* The app is always dark, so keep the status-bar text light. */}
      <StatusBar style="light" />
      <AppTabs />
    </AppStateProvider>
  );
}