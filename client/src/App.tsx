import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import Menu from "./pages/Menu";
import Game from "./pages/Game";
import Instructions from "./pages/Instructions";
import { Route, Switch } from "wouter";

function GameRouter() {
  const { gameState } = useGame();

  return (
    <Switch>
      <Route path="/instructions" component={Instructions} />
      <Route path="/">
        {gameState.phase === 'menu' ? <Menu /> : <Game />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <GameProvider>
            <GameRouter />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
