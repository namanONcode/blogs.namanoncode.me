import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BlogLayout from './components/BlogLayout';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BlogLayout />}>
          <Route index element={<BlogList />} />
          <Route path="post/:id" element={<BlogPost />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
