import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Scoreboard } from './components/Scoreboard';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [view, setView] = useState<'scoreboard' | 'admin'>('scoreboard');
  const adminCode = '1234';
  const [enteredCode, setEnteredCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeError, setCodeError] = useState('');

  const handleAdminAccess = () => {
    if (enteredCode === adminCode) {
      setView('admin');
      setEnteredCode('');
      setShowCodeInput(false);
      setCodeError('');
    } else {
      setCodeError('Invalid code');
      setTimeout(() => setCodeError(''), 3000);
    }
  };

  return (
    <div>
      {view === 'scoreboard' ? (
        <div className="relative">
          <Scoreboard />
          <button
            onClick={() => setShowCodeInput(true)}
            className="fixed bottom-4 left-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-50"
            title="Admin"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showCodeInput && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-slate-800 rounded-lg p-6 w-80 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4">Admin Access</h2>
                <input
                  type="password"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value);
                    setCodeError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                  placeholder="Enter access code"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white mb-4 placeholder-gray-500"
                  autoFocus
                />
                {codeError && <p className="text-red-400 text-sm mb-4">{codeError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCodeInput(false);
                      setEnteredCode('');
                      setCodeError('');
                    }}
                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdminAccess}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <AdminPanel />
          <button
            onClick={() => {
              setView('scoreboard');
              setEnteredCode('');
              setShowCodeInput(false);
            }}
            className="fixed top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors z-50"
          >
            Exit Admin
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
