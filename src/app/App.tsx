import { RouterProvider } from "react-router";
import { router } from "./routes";
import { GameProvider } from "./context/GameContext";
import { AchievementNotification } from "./components/AchievementNotification";

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
      <AchievementNotification />
    </GameProvider>
  );
}
