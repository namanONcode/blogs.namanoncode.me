import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BlogLayout from './components/BlogLayout';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

const App: React.FC = () => {
  return (
    <>
      <div style={{ position: 'fixed', top: '10px', right: '10px', color: '#f89820', fontSize: '10px', zIndex: 9999, fontFamily: 'monospace' }}>APP_MOUNTED_V3</div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<BlogLayout />}>
            <Route index element={<BlogList />} />
            <Route path="post/:id" element={<BlogPost />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};

export default App;
