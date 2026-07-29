import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogLayout from './components/BlogLayout';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogLayout />}>
          <Route index element={<BlogList />} />
          <Route path="post/:id" element={<BlogPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
