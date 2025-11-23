import React, { useRef, useState, useEffect } from "react";

const sampleCatalog = [
  { name: "Branco Neve", code: "SN01", hex: "#F6F6F6", finish: "Fosco" },
  { name: "Areia", code: "AR12", hex: "#D7C4A6", finish: "Fosco" },
  { name: "Azul Mar", code: "AZ34", hex: "#2F6F9F", finish: "Semibrilho" },
  { name: "Verde Folha", code: "VF08", hex: "#4A8A65", finish: "Fosco" }
];

export default function ColorizeMVP() {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [points, setPoints] = useState([]);
  const [selectedColor, setSelectedColor] = useState(sampleCatalog[0].hex);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      // limit max size for performance
      const maxW = 1200;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      draw();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [points, selectedColor, imageSrc, isClosed]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setPoints([]);
    setIsClosed(false);
  }

  function addPoint(e) {
    if (!imgRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (isClosed) {
      setPoints([{ x, y }]);
      setIsClosed(false);
    } else {
      setPoints(prev => [...prev, { x, y }]);
    }
  }

  function closePolygon() {
    if (points.length >= 3) setIsClosed(true);
  }

  function clearPolygon() {
    setPoints([]);
    setIsClosed(false);
  }

  function downloadResult() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "colorized.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!imgRef.current) {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }
    // draw image scaled to canvas size
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);

    if (points.length === 0) return;

    // draw polygon outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    if (isClosed) ctx.closePath();
    ctx.stroke();

    // draw vertices
    points.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // If closed, apply color fill using composite operation to preserve texture
    if (isClosed) {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d");

      octx.beginPath();
      points.forEach((p, i) => (i === 0 ? octx.moveTo(p.x, p.y) : octx.lineTo(p.x, p.y)));
      octx.closePath();
      octx.fillStyle = selectedColor;
      octx.fill();

      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(off, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(off, 0, 0);
      ctx.restore();
    }
  }

  return (
    <div style={{maxWidth:1000, display:'flex', gap:20}}>
      <div style={{flex:1}}>
        <div style={{marginBottom:8}}>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <div style={{border:'1px solid #ddd', display:'inline-block'}}>
          <canvas
            ref={canvasRef}
            onClick={addPoint}
            style={{ maxWidth: '100%', cursor: 'crosshair', display:'block' }}
          />
        </div>
        <div style={{marginTop:8, fontSize:13, color:'#444'}}>
          Clique na imagem para adicionar pontos do polígono. Quando terminar, pressione <b>Fechar polígono</b>.
        </div>
        <div style={{marginTop:8, display:'flex', gap:8}}>
          <button onClick={closePolygon} style={{padding:'6px 10px'}}>Fechar polígono</button>
          <button onClick={clearPolygon} style={{padding:'6px 10px'}}>Limpar</button>
          <button onClick={downloadResult} style={{padding:'6px 10px'}}>Baixar resultado</button>
        </div>
      </div>

      <div style={{width:220}}>
        <h3 style={{margin:0, marginBottom:8}}>Catálogo (exemplo)</h3>
        <div>
          {sampleCatalog.map(c => (
            <div key={c.code} style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
              <div style={{width:36,height:36,background:c.hex,borderRadius:6,border:'1px solid #ccc'}} />
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{c.name}</div>
                <div style={{fontSize:12,color:'#666'}}>{c.code} · {c.finish}</div>
              </div>
              <button onClick={() => setSelectedColor(c.hex)} style={{padding:'6px 8px', borderRadius:6}}>
                Escolher
              </button>
            </div>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontSize:13,color:'#333'}}>Cor selecionada:</div>
          <div style={{marginTop:8, padding:8, borderRadius:6, border:'1px solid #ddd', display:'flex', alignItems:'center',gap:8}}>
            <div style={{width:40,height:40,background:selectedColor,borderRadius:6}} />
            <div>{selectedColor}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
