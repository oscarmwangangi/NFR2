// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const StarAnimation = () => {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     // Function to initialize the 3D scene
//     const initializeScene = () => {
//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       const renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       mountRef.current.appendChild(renderer.domElement);

//       return { scene, camera, renderer };
//     };

//     // Function to create a star shape
//     const createStar = (radius1, radius2, points) => {
//       const shape = new THREE.Shape();
//       const angle = Math.PI / points;

//       for (let i = 0; i < 2 * points; i++) {
//         const radius = (i % 2 === 0) ? radius1 : radius2;
//         const x = radius * Math.cos(i * angle);
//         const y = radius * Math.sin(i * angle);
//         if (i === 0) {
//           shape.moveTo(x, y);
//         } else {
//           shape.lineTo(x, y);
//         }
//       }
//       shape.closePath();

//       return new THREE.ShapeGeometry(shape);
//     };

//     // Function to create stars in the scene
//     const createStars = (scene, numStars) => {
//       const stars = [];

//       for (let i = 0; i < numStars; i++) {
//         const geometry = createStar(Math.random() * 1.5 + 1, Math.random() * 0.5 + 0.5, 5); // Create star shape with 5 points
//         const material = new THREE.MeshBasicMaterial({ color: 0xFF00FF, opacity: 0.6, transparent: true });
//         const star = new THREE.Mesh(geometry, material);
//         star.position.set(
//           Math.random() * window.innerWidth - window.innerWidth / 2,
//           Math.random() * window.innerHeight - window.innerHeight / 2,
//           Math.random() * 200 - 100
//         );
//         scene.add(star);
//         stars.push(star);
//       }

//       return stars;
//     };

//     // Function to animate the scene
//     const animate = (stars, renderer, scene, camera) => {
//       requestAnimationFrame(() => animate(stars, renderer, scene, camera));

//       stars.forEach(star => {
//         star.position.y += 0.5; // Stars rise
//         if (star.position.y > window.innerHeight / 2) {
//           star.position.y = -window.innerHeight / 2;
//         }
//       });

//       renderer.render(scene, camera);
//     };

//     // Function to handle window resizing
//     const handleResize = (renderer, camera) => {
//       window.addEventListener('resize', () => {
//         const width = window.innerWidth;
//         const height = window.innerHeight;
//         renderer.setSize(width, height);
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//       });
//     };

//     const { scene, camera, renderer } = initializeScene();
//     const stars = createStars(scene, 700); // Create 700 stars
//     camera.position.z = 90;
//     animate(stars, renderer, scene, camera);
//     handleResize(renderer, camera);

//     // Cleanup function
//     return () => {
//       mountRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={mountRef}>
//     return <div ref={mountRef} className="star-animation"></div>;
//   </div>;
// };

// export default StarAnimation;