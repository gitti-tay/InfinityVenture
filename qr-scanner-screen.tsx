import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function QRScannerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState('');
  const [scanType, setScanType] = useState(location.state?.type || 'generic');
  
  useEffect(() => {
    // Simulate QR code scanning after 3 seconds
    const timer = setTimeout(() => {
      const mockData = scanType === 'wallet' 
        ? 'wc:1a2b3c4d5e6f7g8h9i0j...' 
        : scanType === 'payment'
        ? 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        : 'INV2024ALEX8291';
      
      setScannedData(mockData);
      setIsScanning(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [scanType]);
  
  const handleScanComplete = () => {
    if (scanType === 'wallet') {
      navigate('/home');
    } else if (scanType === 'payment') {
      navigate('/deposit');
    } else if (scanType === 'referral') {
      navigate('/signup', { state: { referralCode: scannedData } });
    } else {
      navigate(-1);
    }
  };
  
  const handleManualInput = () => {
    navigate(-1);
  };
  
  return (
    <PageWrapper hideNav className="bg-black">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h1 className="text-white font-bold">
            {scanType === 'wallet' ? 'Scan Wallet QR' : 
             scanType === 'payment' ? 'Scan Payment Code' :
             scanType === 'referral' ? 'Scan Referral Code' :
             'Scan QR Code'}
          </h1>
          <button 
            onClick={handleManualInput}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white"
          >
            <span className="material-symbols-outlined">dialpad</span>
          </button>
        </header>
        
        {/* Scanner Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 relative">
          {/* Camera Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-black/50"></div>
          
          {/* Scanner Frame */}
          <div className="relative z-10 w-full max-w-sm">
            <div className="aspect-square relative">
              {/* Corner Borders */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
              
              {/* Scanning Line Animation */}
              {isScanning && (
                <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#1132d4] to-transparent animate-scan"></div>
                </div>
              )}
              
              {/* Center Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isScanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-white text-sm font-medium">Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center animate-in">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="material-symbols-outlined text-white text-4xl">check</span>
                    </div>
                    <p className="text-white text-sm font-bold mb-2">Scan Complete!</p>
                    <p className="text-white/60 text-xs px-4 break-all font-mono">{scannedData.substring(0, 30)}...</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="mt-8 text-center">
              <p className="text-white font-medium mb-2">
                {isScanning 
                  ? 'Position QR code within the frame'
                  : 'QR code detected successfully'
                }
              </p>
              <p className="text-white/60 text-sm">
                {scanType === 'wallet' && 'Connect your wallet by scanning the QR code'}
                {scanType === 'payment' && 'Scan the payment QR code to proceed'}
                {scanType === 'referral' && 'Scan your friend\'s referral QR code'}
                {scanType === 'generic' && 'Align the QR code in the center'}
              </p>
            </div>
          </div>
        </main>
        
        {/* Bottom Actions */}
        <div className="px-5 pb-8 space-y-3 relative z-10">
          {!isScanning && (
            <button
              onClick={handleScanComplete}
              className="w-full h-14 bg-[#1132d4] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Continue
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
          
          <div className="grid grid-cols-3 gap-3">
            <button className="h-12 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold text-sm flex items-center justify-center gap-1 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">photo_library</span>
              Gallery
            </button>
            <button className="h-12 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold text-sm flex items-center justify-center gap-1 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-sm">flashlight_on</span>
              Flash
            </button>
            <button 
              onClick={handleManualInput}
              className="h-12 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold text-sm flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">keyboard</span>
              Manual
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: in 0.3s ease-out;
        }
      `}</style>
    </PageWrapper>
  );
}