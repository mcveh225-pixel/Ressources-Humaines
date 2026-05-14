import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  description?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  url, 
  title = "QR Code d'Inscription", 
  description = "Scannez ce code pour créer votre compte employé"
}) => {
  const downloadQRCode = () => {
    const svg = document.getElementById('registration-qr');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-inscription.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
      toast.success('QR Code téléchargé !');
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const shareLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Lien copié dans le presse-papier !');
  };

  return (
    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
        <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <QrCode className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 font-medium">{description}</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border-4 border-slate-50 shadow-inner">
          <QRCodeSVG 
            id="registration-qr"
            value={url} 
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="flex gap-4 w-full">
          <Button 
            onClick={downloadQRCode}
            className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest"
          >
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>
          <Button 
            variant="outline"
            onClick={shareLink}
            className="flex-1 h-12 rounded-xl border-2 border-slate-100 font-bold text-xs uppercase tracking-widest"
          >
            <Share2 className="mr-2 h-4 w-4" /> Copier Lien
          </Button>
        </div>
        
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
          DIOMANDE BAN SERVICE
        </p>
      </CardContent>
    </Card>
  );
};
