import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SocketProvider } from './socket/socket.tsx';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </SocketProvider>
    </QueryClientProvider >
  </Provider>
)
