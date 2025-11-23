import React from 'react';
import ColorizeMVP from './ColorizeMVP';

export default function App(){
  return (
    <div style={{fontFamily: 'Inter, system-ui, Arial', padding:20}}>
      <h1 style={{fontSize:22, marginBottom:12}}>Palácio Tintas — Simulador de Cor (Prototype)</h1>
      <p style={{marginBottom:16}}>Faça upload de uma foto, desenhe um polígono na área que quer pintar e escolha uma cor do catálogo.</p>
      <ColorizeMVP />
    </div>
  );
}
