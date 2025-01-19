'use client'
import { useEffect, useRef, useState } from 'react';

interface GameOfLifeProps {
  gridSize?: number; // tamaño de la cuadrícula (30px por defecto)
  cellSize?: number; // tamaño de cada celda
  updateSpeed?: number; // Velocidad de actualización en ms (default: 2000ms)
  initialActiveCells?: number; // Número de celdas activas iniciales
  reloadInterval?: number;
  spreadRadius?: number; // Radio de dispersión para las celdas
}

export default function GameOfLife({ 
  gridSize = 30, 
  cellSize = 30,
  updateSpeed = 2000,
  initialActiveCells = 100, // Aumentado el número por defecto
  reloadInterval = 10000,
  spreadRadius = 20 // Radio de dispersión más grande
}: GameOfLifeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<boolean[][]>([]);
  const rows = Math.ceil(window.innerHeight / cellSize);
  const cols = Math.ceil(window.innerWidth / cellSize);

  // Función para crear un nuevo patrón aleatorio
  const createRandomPattern = () => {
    const initialGrid = Array(rows).fill(null).map(() =>
      Array(cols).fill(false)
    );

    // Definir múltiples puntos de origen
    const origins = [
      { row: Math.floor(rows / 2), col: Math.floor(cols / 2) },           // Centro
      { row: Math.floor(rows / 3), col: Math.floor(cols / 3) },           // Superior izquierda
      { row: Math.floor(rows / 3), col: Math.floor((cols * 2) / 3) },     // Superior derecha
      { row: Math.floor((rows * 2) / 3), col: Math.floor(cols / 3) },     // Inferior izquierda
      { row: Math.floor((rows * 2) / 3), col: Math.floor((cols * 2) / 3)} // Inferior derecha
    ];

    let cellsPlaced = 0;
    while (cellsPlaced < initialActiveCells) {
      // Seleccionar un punto de origen aleatorio
      const origin = origins[Math.floor(Math.random() * origins.length)];
      
      // Radio aleatorio alrededor del punto de origen
      const radius = Math.floor(Math.random() * spreadRadius);
      const angle = Math.random() * Math.PI * 2;
      
      const row = origin.row + Math.floor(Math.cos(angle) * radius);
      const col = origin.col + Math.floor(Math.sin(angle) * radius);

      // Asegurarse de que la celda está dentro de los límites y no está ya activa
      if (row >= 0 && row < rows && col >= 0 && col < cols && !initialGrid[row][col]) {
        initialGrid[row][col] = true;
        cellsPlaced++;
      }
    }

    return initialGrid;
  };

  // Inicializar y recargar periódicamente
  useEffect(() => {
    setGrid(createRandomPattern());
    const reloadId = setInterval(() => {
      setGrid(createRandomPattern());
    }, reloadInterval);

    return () => clearInterval(reloadId);
  }, [rows, cols]);

  // Manejar clicks en el canvas
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  // Reglas del Game of Life
  const getNextGeneration = (currentGrid: boolean[][]) => {
    const nextGrid = currentGrid.map((row, i) =>
      row.map((cell, j) => {
        let neighbors = 0;
        
        // Verificar las 8 celdas vecinas
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const newI = (i + x + rows) % rows;
            const newJ = (j + y + cols) % cols;
            if (currentGrid[newI][newJ]) neighbors++;
          }
        }

        // Aplicar reglas del Game of Life
        if (cell) {
          return neighbors === 2 || neighbors === 3;
        } else {
          return neighbors === 3;
        }
      })
    );
    return nextGrid;
  };

  // Dibujar en el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar tamaño del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dibujar el grid base
    const drawBaseGrid = () => {
      ctx.strokeStyle = 'rgba(240, 240, 236, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= canvas.width; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i <= canvas.height; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBaseGrid();
      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell) {
            ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'; // Color gris semi-transparente
            ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
          }
        });
      });
    };

    const updateAndDraw = () => {
      setGrid(prevGrid => getNextGeneration(prevGrid));
      drawGrid();
    };

    drawGrid();
    const intervalId = setInterval(updateAndDraw, updateSpeed);

    return () => clearInterval(intervalId);
  }, [grid, cellSize, updateSpeed]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        cursor: 'pointer',
      }}
    />
  );
}
