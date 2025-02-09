import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  // Referencias para almacenar los materiales, de forma que podamos actualizar el color si el tema cambia
  const pointsMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Creamos la escena, la cámara y el renderer (con alpha para fondo transparente)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Grupo que contendrá los elementos de la esfera
    const group = new THREE.Group();
    group.position.y = -0.1; // Desplaza la esfera hacia abajo en la escena
    scene.add(group);

    // Creamos la geometría de la esfera
    // Parámetros: (radio, segmentosHorizontales, segmentosVerticales)
    const sphereGeometry = new THREE.SphereGeometry(2, 24, 24);

    // Obtenemos el color actual en función del tema
    const currentColor =
      theme === 'light'
        ? getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color-light')
            .trim()
        : getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color-dark')
            .trim();

    // Creamos el material para los puntos (vértices) de la esfera
    const pointsMaterial = new THREE.PointsMaterial({
      color: currentColor,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    pointsMaterialRef.current = pointsMaterial;

    // Creamos los puntos a partir de la geometría
    const points = new THREE.Points(sphereGeometry, pointsMaterial);
    group.add(points);

    // Para resaltar los vértices usaremos el wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(sphereGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: currentColor,
      transparent: true,
      opacity: 0.5,
    });
    lineMaterialRef.current = lineMaterial;
    const line = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    group.add(line);

    // Bucle de animación: rota el grupo en cada cuadro
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Ajustamos la vista en respuesta al cambio de tamaño de la ventana
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup: removemos el listener de resize, cancelamos la animación y eliminamos el canvas
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current!);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  // Al cambiar el tema, se actualizan los colores de los materiales
  useEffect(() => {
    const newColor =
      theme === 'light'
        ? getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color-light')
            .trim()
        : getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color-dark')
            .trim();

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.color.set(newColor);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.color.set(newColor);
    }
  }, [theme]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
