'use client'
import { useEffect, useRef, useState } from 'react';

interface GameOfLifeProps {
  gridSize?: number; // tamaño de la cuadrícula (30px por defecto)
  cellSize?: number; // tamaño de cada celda
  updateSpeed?: number; // Velocidad de actualización en ms (default: 2000ms)
}

export default function GameOfLife({ 
  gridSize = 30, 
  cellSize = 30,
  updateSpeed = 2000 // 2 segundos por defecto para hacerlo más lento
}: GameOfLifeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<boolean[][]>([]);
  const rows = Math.ceil(window.innerHeight / cellSize);
  const cols = Math.ceil(window.innerWidth / cellSize);

  // Inicializar grid con puntos aleatorios alrededor del título
  useEffect(() => {
    const initialGrid = Array(rows).fill(null).map(() =>
      Array(cols).fill(false)
    );

    // Obtener la posición del título
    const titleElement = document.querySelector('.title');
    if (titleElement) {
      const rect = titleElement.getBoundingClientRect();
      const centerRow = Math.floor(rect.top / cellSize);
      const centerCol = Math.floor(rect.left / cellSize);
      const width = Math.ceil(rect.width / cellSize);
      const height = Math.ceil(rect.height / cellSize);

      // Crear puntos aleatorios alrededor del título
      for (let i = -5; i < height + 5; i++) {
        for (let j = -5; j < width + 5; j++) {
          const row = centerRow + i;
          const col = centerCol + j;
          if (row >= 0 && row < rows && col >= 0 && col < cols) {
            initialGrid[row][col] = Math.random() > 0.85;
          }
        }
      }
    }

    setGrid(initialGrid);
  }, [rows, cols, cellSize]);

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
      const newGrid = [...prevGrid.map(row => [...row])];
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
