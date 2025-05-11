import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Layout from './components/Layout/Layout';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="app">
            <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
            <Layout sidebarOpen={sidebarOpen} />
        </div>
    );
}

export default App;
