import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Handbook() {
    return (
        <div>
            {/* PDF Viewer */}
            <iframe
                src="/files/NCF Student Handbook.pdf"
                style={{ width: '100%', height: '800px', border: 'none' }}
                title="PDF Viewer"
            ></iframe>
        </div>
    );
}
