import React, { useState, useEffect } from "react";
import "./App.css";

interface Product {
  qty: number;
  userId: number;
  title: string;
  description: string;
  id: number;
  price: number;
  image: string;
  thumbnail: string;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://mockend.up.railway.app/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((error) => {
        setError(error.message);
      });

    return () => {
      // Cleanup function
      // This will execute when the component unmounts
      // You can perform cleanup operations here if needed
    };
  }, []);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  return (
    <div className="App">
      <h1>E-Commerce</h1>
      <p>Benvenuto nel negozio online. Sfoglia i nostri prodotti!</p>
      {products ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>Quantità disponibile: {product.qty}</p>
              <button onClick={() => addToCart(product)}>Aggiungi al carrello</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
      {error && <div>Error: {error}</div>}
      <h2>Carrello</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>Quantità: {item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)}>Rimuovi dal carrello</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
