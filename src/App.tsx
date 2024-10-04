import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";
import './App.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
<QueryClientProvider client={queryClient}>
     <BrowserRouter>
     <AppRouter/>
     </BrowserRouter>
     </QueryClientProvider>

  )
}

export default App
