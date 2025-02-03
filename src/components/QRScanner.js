import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';

const QRScanner = ({ setScannedData }) => {
    const [error, setError] = useState('');
    const [hasCamera, setHasCamera] = useState(true);

    useEffect(() => {
        // Check if the device has camera capabilities
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const cameras = devices.filter(device => device.kind === 'videoinput');
            if (cameras.length === 0) {
                setHasCamera(false);
            }
        });
    }, []);

    const handleScan = (data) => {
        if (data) {
            setScannedData(data.text);
        }
    };

    const handleError = (err) => {
        setError(err.message);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    if (!hasCamera) {
        return <p>No camera found on this device.</p>;
    }

    return (
        <div>
            <QrReader
                delay={300}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
            />
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default QRScanner;
