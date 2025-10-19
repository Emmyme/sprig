import {
  WindowMinimise,
  WindowMaximise,
  WindowUnmaximise,
  Quit,
  WindowIsMaximised,
  EventsOn,
} from "../../wailsjs/runtime/runtime";
import { useState, useEffect } from "react";

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const checkWindowState = async () => {
      try {
        const maximized = await WindowIsMaximised();
        setIsMaximized(maximized);
      } catch (error) {
        console.warn("Failed to check window state:", error);
      }
    };

    checkWindowState();

    const unsubscribeMaximize = EventsOn("window:maximized", () => {
      setIsMaximized(true);
    });

    const unsubscribeRestore = EventsOn("window:restored", () => {
      setIsMaximized(false);
    });

    const unsubscribeMinimize = EventsOn("window:minimized", () => {});

    const stateCheckInterval = setInterval(checkWindowState, 1000);

    return () => {
      try {
        unsubscribeMaximize();
        unsubscribeRestore();
        unsubscribeMinimize();
        clearInterval(stateCheckInterval);
      } catch (error) {
        console.warn("Error during cleanup:", error);
      }
    };
  }, []);

  const handleMinimize = () => {
    WindowMinimise();
  };

  const handleMaximize = () => {
    if (isMaximized) {
      WindowUnmaximise();
    } else {
      WindowMaximise();
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    Quit();
  };

  return (
    <div
      className="flex items-center justify-between h-8 select-none border-b-2"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)",
        borderColor: "var(--blue-primary)",
      }}
    >
      <div
        className="flex-1 h-full cursor-move titlebar-drag"
        data-wails-drag
      ></div>

      <div className="flex h-full titlebar-controls" data-wails-no-drag>
        <button
          onClick={handleMinimize}
          className="h-full px-4 transition-all duration-200 flex items-center justify-center"
          style={{
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          title="Minimize"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="7" width="10" height="2" rx="1" />
          </svg>
        </button>

        <button
          onClick={handleMaximize}
          className="h-full px-4 transition-all duration-200 flex items-center justify-center"
          style={{
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="7" y="7" width="6" height="6" rx="1" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="10" height="10" rx="1" />
            </svg>
          )}
        </button>

        <button
          onClick={handleClose}
          className="h-full px-4 transition-all duration-200 flex items-center justify-center"
          style={{
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          title="Close"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 11-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 11-1.414-1.414L6.586 8 4.293 5.707a1 1 0 111.414-1.414L8 6.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
