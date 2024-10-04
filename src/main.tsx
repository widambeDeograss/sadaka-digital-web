import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {store, persistor} from "./store/Store.ts";
import { ThemeProvider } from "./store/utilities/themeProvider.tsx";
import App from "./App.tsx";
import "./index.css";
import { PersistGate } from 'redux-persist/integration/react';
import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </PersistGate>
    </Provider>

  </React.StrictMode>
);
