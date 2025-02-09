import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedSphereMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const pointsMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3; // Más cerca que la versión de escritorio

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitamos el pixel ratio para mejor rendimiento
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.y = -0.1;
    scene.add(group);

    // Reducimos los segmentos para mejor rendimiento en móvil
    const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);

    const currentColor = theme === 'light'
      ? getComputedStyle(document.documentElement).getPropertyValue('--primary-color-light').trim()
      : getComputedStyle(document.documentElement).getPropertyValue('--primary-color-dark').trim();

    const pointsMaterial = new THREE.PointsMaterial({
      color: currentColor,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
    });
    pointsMaterialRef.current = pointsMaterial;

    const points = new THREE.Points(sphereGeometry, pointsMaterial);
    group.add(points);

    const wireframeGeometry = new THREE.WireframeGeometry(sphereGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: currentColor,
      transparent: true,
      opacity: 0.5,
    });
    lineMaterialRef.current = lineMaterial;
    const line = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    group.add(line);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      group.rotation.y += 0.002; // Rotación más lenta para móvil
      group.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current!);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const newColor = theme === 'light'
      ? getComputedStyle(document.documentElement).getPropertyValue('--primary-color-light').trim()
      : getComputedStyle(document.documentElement).getPropertyValue('--primary-color-dark').trim();

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.color.set(newColor);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.color.set(newColor);
    }
  }, [theme]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
