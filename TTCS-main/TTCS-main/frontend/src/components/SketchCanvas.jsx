import { useRef, useEffect, useState } from 'react';
import { 
  Pen, Eraser, RotateCcw, Trash2, ZoomIn, ZoomOut, 
  Send, LogOut, Undo2, Redo2, ArrowLeft
} from 'lucide-react';
import '../styles/SketchCanvas.css';

function SketchCanvas({ 
  onSearch, 
  onLogout,
  onBackToCategory,
  currentUser, 
  isLoading, 
  searchCategory,
  results = []
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState('brush');
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const [searchResultsShowing, setSearchResultsShowing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';

    // Initialize history
    setHistory([canvas.toDataURL()]);
    setHistoryStep(0);

    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Update canvas styles
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = brushSize;
    if (mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
  }, [color, brushSize, mode]);

  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;
    
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasStartedDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      pushHistory();
    }
    setIsDrawing(false);
  };

  const pushHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const newStep = historyStep - 1;
    setHistoryStep(newStep);
    restoreHistory(newStep);
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const newStep = historyStep + 1;
    setHistoryStep(newStep);
    restoreHistory(newStep);
  };

  const restoreHistory = (step) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[step];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([canvas.toDataURL()]);
    setHistoryStep(0);
  };

  const handleNewSketch = () => {
    clearCanvas();
    setSearchResultsShowing(false);
    setColor('#000000');
    setBrushSize(4);
    setMode('brush');
    setZoom(1);
    setHasStartedDrawing(false);
  };

  const handleSearch = async () => {
    const canvas = canvasRef.current;
    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png');
    });
    // Show results layout once search is triggered
    setSearchResultsShowing(true);
    onSearch(blob);
  };

  return (
    <div className={`sketch-container ${searchResultsShowing ? 'show-results' : ''}`}>
      {/* Header */}
      <div className="sketch-header">
        <div className="header-left">
          <button 
            className="back-btn" 
            onClick={onBackToCategory} 
            title="Back to category selection"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="studio-title">Draw & Find</h1>
          <div className="tabs">
            <button className="tab active">Sketch Canvas</button>
          </div>
          <div className={`category-badge ${searchCategory}`}>
            <span className="category-icon">
              {searchCategory === 'animal' ? '🐾' : '📦'}
            </span>
            <span className="category-name">
              {searchCategory === 'animal' ? 'Animal Mode' : 'Product Mode'}
            </span>
          </div>
        </div>
        <div className="header-right">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser || 'User')}&background=5d3fe3&color=fff`} 
            alt="User" 
            className="user-avatar"
          />
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`sketch-content ${searchResultsShowing ? 'results-open' : ''}`}>
        {/* Left Toolbar - Hidden when showing results */}
        {!searchResultsShowing && (
          <div className="sketch-toolbar-left">
            <div className="tools-label">TOOLS</div>
            
            <button
              className={`tool-btn ${mode === 'brush' ? 'active' : ''}`}
              onClick={() => setMode('brush')}
              title="Brush"
            >
              <Pen size={20} />
            </button>

            <button
              className={`tool-btn ${mode === 'eraser' ? 'active' : ''}`}
              onClick={() => setMode('eraser')}
              title="Eraser"
            >
              <Eraser size={20} />
            </button>

            <button
              className="tool-btn color-picker-btn"
              title="Color"
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
              />
              <div 
                className="color-preview" 
                style={{ backgroundColor: color }}
              ></div>
            </button>

            <div className="tool-separator"></div>

            <button
              className="tool-btn"
              onClick={undo}
              disabled={historyStep <= 0}
              title="Undo"
            >
              <Undo2 size={20} />
            </button>

            <button
              className="tool-btn"
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              title="Redo"
            >
              <Redo2 size={20} />
            </button>

            <button
              className="tool-btn danger"
              onClick={clearCanvas}
              title="Clear"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}

        {/* Canvas Area */}
        <div className={`sketch-canvas-wrapper ${searchResultsShowing ? 'compact' : ''}`}>
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            onMouseDown={searchResultsShowing ? undefined : startDrawing}
            onMouseMove={searchResultsShowing ? undefined : draw}
            onMouseUp={searchResultsShowing ? undefined : stopDrawing}
            onMouseLeave={searchResultsShowing ? undefined : stopDrawing}
            onTouchStart={searchResultsShowing ? undefined : startDrawing}
            onTouchMove={searchResultsShowing ? undefined : draw}
            onTouchEnd={searchResultsShowing ? undefined : stopDrawing}
            className={`sketch-canvas ${searchResultsShowing ? 'readonly' : ''}`}
            style={{ transform: `scale(${zoom})` }}
          />
          {!hasStartedDrawing && !searchResultsShowing && (
            <div className="canvas-empty-state">
              <div className="empty-icon">✏️</div>
              <h2>Start your creation</h2>
              <p>Sketch your idea here. We'll instantly find matching images.</p>
            </div>
          )}

          {/* Bottom Pro Tip & Search Button - Hidden when showing results */}
          {!searchResultsShowing && (
            <div className="sketch-footer">
              <div className="pro-tip">
                <strong>PRO TIP</strong>
                <p>Use the Pencil for outlines and Color Picker to define materials.</p>
              </div>
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isLoading || history.length <= 1}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Search by Sketch
                  </>
                )}
              </button>
            </div>
          )}

          {/* New Sketch Button - Shown when results are displayed */}
          {searchResultsShowing && (
            <button
              className="sketch-new-sketch-btn"
              onClick={handleNewSketch}
              title="Create a new sketch"
            >
              New Sketch
            </button>
          )}
        </div>

        {/* Right Controls - Hidden when showing results */}
        {!searchResultsShowing && (
          <div className="sketch-controls-right">
            <div className="control-section">
              <div className="control-label">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: color }}
                ></div>
                {color.toUpperCase()}
              </div>
            </div>

            <div className="control-section">
              <div className="control-label">STROKE: {brushSize}PX</div>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="stroke-slider"
              />
            </div>

            <div className="control-separator"></div>

            <button
              className="control-btn"
              onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>

            <button
              className="control-btn"
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>

            <button
              className="control-btn reset"
              onClick={() => setZoom(1)}
              title="Reset Zoom"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {searchResultsShowing && results.length > 0 && (
        <div className="results-section-inline">
          <div className="results-container-inline">
            <h2 className="results-title-inline">Search Results</h2>
            <p className="results-subtitle-inline">Finding {results.length} visual matches from your sketch</p>
            <div className="results-grid-inline">
              {results.map((r, idx) => ( 
                <div className="result-card-inline" key={idx}>
                  <img
                    src={r.image}
                    alt={r.name}
                    className="result-image-inline"
                  />
                  <div className="result-info-inline">
                    <div className="result-name-inline">{r.name}</div>
                    <div className="result-score-inline">Match: {(r.match_score * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SketchCanvas;
