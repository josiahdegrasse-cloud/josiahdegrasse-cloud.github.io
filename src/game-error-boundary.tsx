import { Component, type ReactNode } from "react";
export class GameErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="game-fallback">
          <p className="eyebrow">Optional 3D experiment</p>
          <h1>The world couldn’t open.</h1>
          <p>
            The interactive scene needs a working graphics context and its game
            files. You can try again or return to the portfolio.
          </p>
          <div>
            <button type="button" onClick={() => window.location.reload()}>
              Try again
            </button>
            <a href="/">Return to portfolio →</a>
          </div>
        </main>
      );
    return this.props.children;
  }
}
