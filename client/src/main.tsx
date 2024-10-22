// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.tsx';
import { RestaurantsProvider } from './contexts/RestaurantsContext.tsx';
import { UsersProvider } from './contexts/UsersContext.tsx';
import { CommentsProvider } from './contexts/CommentsContext.tsx';
import { ReservationsProvider } from './contexts/ReservationsContext.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <RestaurantsProvider>
      <UsersProvider>
        <CommentsProvider>
         <ReservationsProvider>
            <App />
          </ReservationsProvider>
        </CommentsProvider>
      </UsersProvider>
    </RestaurantsProvider>
  </BrowserRouter>
  // </StrictMode>
);