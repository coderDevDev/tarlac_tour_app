'use client';

import { useRef, useEffect } from 'react';

//
interface ARViewerProps {
  modelUrl: string;
  siteName: string;
}

export default function ARViewer({ modelUrl, siteName }: ARViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadModel = async () => {
      const modelViewer = document.createElement('model-viewer');
      modelViewer.setAttribute('src', modelUrl);
      modelViewer.setAttribute('alt', `3D model of ${siteName}`);
      modelViewer.setAttribute('shadow-intensity', '1');
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('auto-rotate', '');
      modelViewer.setAttribute('ar', '');
      modelViewer.style.width = '100%';
      modelViewer.style.height = '100%';

      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
        viewerRef.current.appendChild(modelViewer);
      }

      // Load the model-viewer element's required libraries
      await import('@google/model-viewer');
    };

    loadModel();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
      }
    };
  }, [modelUrl, siteName]);

  return (
    <div ref={viewerRef} className="w-full h-full">
      {/* The 3D model will be loaded here */}
    </div>
  );
}
