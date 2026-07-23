import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { TolgeeProvider } from "@tolgee/react";
import App from "./App";
import { tolgee } from "./i18n/config";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles/global.css";

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "indigo",
  primaryShade: { light: 5, dark: 4 },
  cursorType: "pointer",
  defaultRadius: "md",
  colors: {
    brand: [
      "#e6f4ff",
      "#cce7ff",
      "#99ceff",
      "#66b5ff",
      "#339cff",
      "#0084ff",
      "#006acc",
      "#005099",
      "#003566",
      "#001b33",
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TolgeeProvider tolgee={tolgee} fallbackLanguage="en">
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </TolgeeProvider>
  </React.StrictMode>
);
