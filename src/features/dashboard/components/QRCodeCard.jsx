import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import toast from "react-hot-toast";

// ✅ 1. Accept 'avatarUrl' as a prop
export function QRCodeCard({ username, avatarUrl }) {
  const qrRef = useRef();

  // Logic to generate the full URL
  const profileUrl = `${window.location.origin}/${username}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");

    // Because we used imageSettings, the avatar is baked into this data URL!
    const image = canvas.toDataURL("image/png");

    // Create a fake link to trigger download
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `reachme-qr-${username}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    toast.success("QR Code downloaded!");
  };

  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-4 h-full">
      <div className="flex items-center gap-2 text-slate-800 font-bold self-start">
        <QrCode size={20} className="text-brand-500" />
        <h2>Your QR Code</h2>
      </div>

      <div
        ref={qrRef}
        className="p-4 bg-white rounded-xl border-2 border-slate-100 shadow-sm"
      >
        <QRCodeCanvas
          value={profileUrl}
          size={160}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"H"} // ✅ 'H' (High) is required when adding images to allow error correction
          includeMargin={true}
          // ✅ This embeds the image into the QR code
          imageSettings={
            avatarUrl
              ? {
                  src: avatarUrl,
                  x: undefined, // Centers automatically if undefined
                  y: undefined,
                  height: 35, // Size of the avatar
                  width: 35,
                  excavate: true, // "Digs" out the dots behind the image for clarity
                }
              : undefined
          }
        />
      </div>

      <p className="text-xs text-slate-500 max-w-[200px]">
        Scan to visit: <br />
        <span className="font-mono font-bold text-brand-600">{profileUrl}</span>
      </p>

      <button
        onClick={downloadQR}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors w-full justify-center"
      >
        <Download size={16} /> Download PNG
      </button>
    </Card>
  );
}
