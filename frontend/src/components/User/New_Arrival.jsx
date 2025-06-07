import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js"; // Import utility function

function New_Arrival() {
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=10`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // Three.js animation setup
  useEffect(() => {
    // --- Three.js Functions ---
    // Initialize the 3D scene
    function initializeScene() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      // Get the canvas from the DOM (it is rendered below)
      const canvas = document.getElementById("bubble-canvas");
      const renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Note: In React you already include the canvas element in JSX,
      // so appending it to document.body is not necessary.
      return { scene, camera, renderer };
    }

    // Create a star shape geometry
    function createStar(radius1, radius2, points) {
      const shape = new THREE.Shape();
      const angle = Math.PI / points;

      for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? radius1 : radius2;
        const x = radius * Math.cos(i * angle);
        const y = radius * Math.sin(i * angle);
        if (i === 0) {
          shape.moveTo(x, y);
        } else {
          shape.lineTo(x, y);
        }
      }
      shape.closePath();
      return new THREE.ShapeGeometry(shape);
    }

    // Create many stars and add them to the scene
    function createStars(scene, numStars) {
      const stars = [];
      for (let i = 0; i < numStars; i++) {
        const geometry = createStar(
          Math.random() * 1.5 + 1,
          Math.random() * 0.5 + 0.5,
          5
        );
        const material = new THREE.MeshBasicMaterial({
          color: 0xff00ff,
          opacity: 0.6,
          transparent: true,
        });
        const star = new THREE.Mesh(geometry, material);
        star.position.set(
          Math.random() * window.innerWidth - window.innerWidth / 2,
          Math.random() * window.innerHeight - window.innerHeight / 2,
          Math.random() * 200 - 100
        );
        scene.add(star);
        stars.push(star);
      }
      return stars;
    }

    // Animate the scene
    function animate(stars, renderer, scene, camera) {
      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => animate(stars, renderer, scene, camera));
      stars.forEach((star) => {
        star.position.y += 0.5; // Move star upward
        if (star.position.y > window.innerHeight / 2) {
          star.position.y = -window.innerHeight / 2;
        }
      });
      renderer.render(scene, camera);
    }

    // Adjust the scene when the window is resized
    function handleResize(renderer, camera) {
      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      });
    }

    // Restart the typewriter effect when the animation iterates
    function restartTypewriterEffect() {
      document.querySelectorAll(".new-arrivals-typewriter").forEach((element) => {
        element.addEventListener("animationiteration", () => {
          element.style.animation = "none"; // Remove animation
          // Trigger reflow to reset animation
          void element.offsetHeight;
          element.style.animation = "";
        });
      });
    }
    
    // Initialize and start the animation
    function init() {
      const { scene, camera, renderer } = initializeScene();
      const stars = createStars(scene, 700); // Create 700 stars
      camera.position.z = 90;
      animate(stars, renderer, scene, camera);
      handleResize(renderer, camera);
      restartTypewriterEffect();
    }

    // Call init to set everything up
    init();

    // Optionally, you might want to clean up event listeners on component unmount.
    // For this example, cleanup code is omitted.
  }, []);

  return (
    <div className="container mx-auto p-4 relative">
      {/* The canvas is positioned fixed with a negative z-index so it acts as a background */}
      <canvas
        id="bubble-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100%",
          height: "100%",
        }}
      ></canvas>
      <h2 className="text-4xl font-extrabold text-left mb-8 text-white new-arrivals-typewriter">
        New Arrival
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product.id} 
            to={`/product/${product.id}`}
            className="product-item group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all relative"
            >

              {product.discount_price && (
                          <div className="absolute top-2 right-2 bg-red-500 bg-opacity-10 text-[#f5594b] text-sm font-semibold  px-2 py-1 rounded">
                                  -{calculateDiscountPercentage(product.price, product.discount_price)}%
                                </div>
                              )}
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-sm font-semibold text-white truncate-text">
                  {product.name}
                </h3>
                <div className="mt-2 flex flex-col">
                {product.discount_price && (
                    <span className="text-xl font-bold text-white">
                      {product.discount_price}
                    </span>
                  )}
                  <span className="text-sm text-white line-through">
                    Ksh {product.price}
                  </span>
                 
                </div>
     
            </Link>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
}

export default New_Arrival;
