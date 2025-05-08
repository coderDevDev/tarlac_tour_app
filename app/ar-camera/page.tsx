"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, QrCode, X, Info } from "lucide-react"
import { getSiteById } from "@/lib/data"
import ARViewer from "@/components/ar-viewer"
import { motion, AnimatePresence } from "framer-motion"

export default function ARCameraPage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [scannedSiteId, setScannedSiteId] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const searchParams = useSearchParams()

  // If siteId is provided in URL, use it directly
  useEffect(() => {
    const siteId = searchParams.get("siteId")
    if (siteId) {
      setScannedSiteId(siteId)
    }
  }, [searchParams])

  const site = scannedSiteId ? getSiteById(scannedSiteId) : null

  const handleStartCamera = () => {
    setCameraActive(true)
  }

  const handleCloseAR = () => {
    setScannedSiteId(null)
  }

  // Mock QR code scanning - in a real app, this would use a QR code scanning library
  const handleScanQR = () => {
    setScanning(true)

    // Simulate scanning a QR code after 2 seconds
    setTimeout(() => {
      // For demo purposes, just pick a random site
      const siteIds = [
        "ninoy-aquino-ancestral-house",
        "capas-national-shrine",
        "tarlac-cathedral",
        "monasterio-de-tarlac",
      ]
      const randomSiteId = siteIds[Math.floor(Math.random() * siteIds.length)]
      setScannedSiteId(randomSiteId)
      setCameraActive(false)
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="container px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-center"
      >
        AR Experience
      </motion.h1>

      <AnimatePresence mode="wait">
        {!cameraActive && !scannedSiteId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            key="start-screen"
          >
            <Card className="max-w-md mx-auto border-none shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Augmented Reality Scanner</CardTitle>
                <CardDescription>
                  Scan QR codes at heritage sites to view 3D models and additional information.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground/50" />
                </div>

                <Button onClick={handleStartCamera} className="w-full rounded-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>

                <div className="text-sm text-muted-foreground text-center px-4">
                  <Info className="h-4 w-4 inline-block mr-1" />
                  Point your camera at a QR code located at any Tarlac heritage site.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {cameraActive && !scannedSiteId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            key="camera-screen"
            className="max-w-md mx-auto"
          >
            <div className="relative h-[70vh] bg-black rounded-2xl overflow-hidden shadow-lg">
              <div className="ar-scanner">
                <video autoPlay playsInline muted className="w-full h-full object-cover">
                  <source src="/placeholder-video.mp4" type="video/mp4" />
                </video>
                <div className="ar-overlay">
                  <div className="scan-area"></div>
                </div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <Button
                  onClick={handleScanQR}
                  disabled={scanning}
                  className="rounded-full px-6 bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
                >
                  {scanning ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Scan QR Code
                    </>
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={() => setCameraActive(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {scannedSiteId && site && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            key="ar-view-screen"
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{site.name} in AR</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseAR} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="h-[70vh] bg-black/5 rounded-2xl overflow-hidden shadow-lg">
              <ARViewer modelUrl={site.modelUrl || "/models/placeholder.glb"} siteName={site.name} />
            </div>

            <div className="mt-4 text-sm text-muted-foreground text-center">
              <p>Move your device around to explore the 3D model. Pinch to zoom in and out.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
