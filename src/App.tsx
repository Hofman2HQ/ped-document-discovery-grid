import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Queries from './pages/Queries';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
