// Draw & Find - Main App Component
import { useState, useEffect } from 'react'; 
import '../styles/App.css';
import { LogOut } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SketchCanvas from './SketchCanvas';

function App() {
  //  Authentication State
  const [authStatus, setAuthStatus] = useState('login'); // 'login' | 'register' | 'authenticated'
  const [currentUser, setCurrentUser] = useState(null);
  
  // 🎨 Canvas & Search State
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]); 
  const [searchCategory, setSearchCategory] = useState(null); // 'animal' | 'product'

  //  Initialize user on load - Check localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (token && username && isAuthenticated === 'true') {
      // User đã đăng nhập trước đó
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(username); 
      setAuthStatus('authenticated');
    } else {
      // Chưa đăng nhập, show login form
      setAuthStatus('login');
    }
  }, []);

  // 🔐 Handle successful login
  const handleLoginSuccess = () => {
    const username = localStorage.getItem('username');
    setCurrentUser(username);
    setAuthStatus('authenticated');
  };

  // 🔐 Handle successful registration
  const handleRegisterSuccess = () => {
    const username = localStorage.getItem('username');
    setCurrentUser(username);
    setAuthStatus('authenticated');
  };

  // 🔐 Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
    setCurrentUser(null);
    setAuthStatus('login');
    setIsStarted(false);
    setSearchCategory(null);
    setResults([]);
  };

  //  Switch to register form
  const switchToRegister = () => {
    setAuthStatus('register');
  };

  //  Switch to login form
  const switchToLogin = () => {
    setAuthStatus('login');
  };

  //  Handle sketch search
  const handleSearch = async (blob) => {
    if (isLoading || !searchCategory || !blob) return;

    setIsLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append('file', blob, 'sketch.png');
      formData.append('category', searchCategory);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      const items = data.results.map((result, i) => ({
        image: result.image_url,
        name: result.class_name || `result_${i + 1}`,
        type: result.class_name,
        match_score: result.score,
      }));

      setResults(items);
      console.log('✅ Predict successful:', data);
    } catch (error) {
      console.error('❌ Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  //  Back to category selection
  const handleBackToCategory = () => {
    setIsStarted(false);
    setSearchCategory(null);
    setResults([]);
  };


  return (
    <div className="app-container">
      {/* 🔐 Show login form if not authenticated */}
      {authStatus === 'login' && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
          onLoading={setIsLoading}
        />
      )}

      {/* 🔐 Show register form if switched */}
      {authStatus === 'register' && (
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
          onLoading={setIsLoading}
        />
      )}

      {/* Main app - only show when authenticated */}
      {authStatus === 'authenticated' && (
        <>
          {!isStarted ? (
            // Welcome screen
            <div className="welcome-screen">
              <div className="welcome-header">
                <h1 className="welcome-title-small">Draw & Find</h1>
                <button className="logout-btn" onClick={handleLogout} title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
              <div className="welcome-logo">
                <span className="paper"></span>
                <span className="pencil"></span>
              </div>
              <p className="welcome-message">Hello, <strong>{currentUser}</strong>!</p> 
              <p className="welcome-subtitle">Sketch your idea, we find the match.</p>
              
              {/*  Search category selection */}
              <div className="search-category-container">
                <button
                  className={`search-category-option ${searchCategory === 'animal' ? 'selected' : ''}`}
                  onClick={() => setSearchCategory('animal')}
                  title="Search animals"
                >
                  <span className="category-icon">🐾</span>
                  <span className="category-text">Animals</span>
                </button>
                <button
                  className={`search-category-option ${searchCategory === 'product' ? 'selected' : ''}`}
                  onClick={() => setSearchCategory('product')}
                  title="Search products"
                >
                  <span className="category-icon">📦</span>
                  <span className="category-text">Products</span>
                </button>
              </div>
              
              <button 
                className="start-btn" 
                disabled={searchCategory === null}
                onClick={() => setIsStarted(true)}
              >
                Start Sketching
              </button>
            </div>
          ) : (
            // Canvas screen
            <>
              <SketchCanvas
                onSearch={handleSearch}
                onLogout={handleLogout}
                onBackToCategory={handleBackToCategory}
                currentUser={currentUser}
                isLoading={isLoading}
                searchCategory={searchCategory}
                results={results}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
