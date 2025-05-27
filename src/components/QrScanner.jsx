import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { X } from 'lucide-react';

const QRScannerComponent = ({ onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const manualScanIntervalRef = useRef(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        if (!videoRef.current) {
          setError('Video element not found');
          return;
        }

        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          setError('No camera found on this device');
          return;
        }

        const cameras = await QrScanner.listCameras(true);
        const physicalCameras = cameras.filter(
          camera => !camera.label.toLowerCase().includes('transcreen')
        );

        if (physicalCameras.length === 0) {
          setError('No suitable camera found');
          return;
        }

        const preferredCamera =
          physicalCameras.find(camera =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('rear')
          ) || physicalCameras[0];

        scannerRef.current = new QrScanner(
          videoRef.current,
          result => {
            console.log('Scan result:', result);
            const match = result.data.match(/\/qr-verify-pass\/([A-Z0-9]+)$/);
            if (match) {
              const passId = match[1];
              console.log('Valid QR Code found:', passId);
              scannerRef.current.stop();
              onClose();
              navigate(`/qr-verify-pass/${passId}`);
            } else {
              console.log('Invalid QR Code format:', result.data);
            }
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 10,
          }
        );

        await scannerRef.current.setCamera(preferredCamera.id);

        await scannerRef.current.start();

        // Manual scanning every 100ms as a fallback to ensure scanning triggers
        manualScanIntervalRef.current = setInterval(() => {
          if (scannerRef.current) scannerRef.current.scanImage();
        }, 100);

      } catch (err) {
        console.error('Error initializing scanner:', err);
        setError('Camera error: ' + err.message);
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (manualScanIntervalRef.current) {
        clearInterval(manualScanIntervalRef.current);
      }
    };
  }, [navigate, onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Scan QR Code</h2>
          <button
            onClick={() => {
              if (scannerRef.current) {
                scannerRef.current.destroy();
              }
              onClose();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
};

export default QRScannerComponent;
