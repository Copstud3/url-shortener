import axios from "axios";
import { useState } from "react";
import QRCodeGenerator from "qrcode";
import QRCode from "react-qr-code";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)

  const [copied, setCopied] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState("");

  const handleShorten = async () => {
    if (!url) return;

    try {
       setLoading(true)
       const response = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });
       
      const newShortUrl = response.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);
      setLoading(false)
      

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);

      setQrImage(qr);
      setQrImage(qr);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">URL SHORTENER</h1>

      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input
          type="text"
          className="input input-success w-full"
          placeholder="Enter Long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className={`${loading ? "opacity-50" : ""} btn btn-primary w-full sm:auto`} onClick={handleShorten} disabled={loading}>{loading ? "Loading, please wait..." :"Shorten"}</button>
      </div>
      {shortUrl && (
        <div className="flex flex-col items-center max-w-3xl w-full">
          <p className="font-medium my-2">Your short link:</p>
          <a href={shortUrl} target="_blank" className="link link-primary break-all">{shortUrl}</a>

          <button
            onClick={handleCopy}
            className={`btn mt-2 w-full ${copied ? "btn-success" : "btn-secondary"}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>

          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <p className="mb-2 text-center font-semibold text-gray-800">Scan QR Code:</p>

            <QRCode value={shortUrl} size={180} />
          </div>
          {qrImage && (
            <a className="btn btn-accent mt-3 w-full" download={`qr-code.png`} href={qrImage}>Download QR Code</a>
          )}
        </div>
      )}
    </div>
  );
}
