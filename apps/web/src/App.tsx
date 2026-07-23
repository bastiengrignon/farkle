import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { GamePage } from "./pages/Game";
import { SettingsPage } from "./pages/Settings";
import { LeaderboardPage } from "./pages/Leaderboard";
import { RulesPage } from "./pages/Rules";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
