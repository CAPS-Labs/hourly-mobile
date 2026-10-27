import AppTabs from "./src/navigation/AppTabs";
import { AppStateProvider } from "./src/context/AppStateContext";

export default function App() {
  return (
    <AppStateProvider>
      <AppTabs />
    </AppStateProvider>
  );
}