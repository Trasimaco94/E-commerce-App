import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
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

const CartContext = createContext<{
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
}>({
  cart: [],
  removeFromCart: () => {}
});

function App() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Fetch dei prodotti
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
        console.error("Error fetching products:", error);
      });

    // Cleanup function
    return () => {
      // Eseguito quando il componente si disimpegna
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

  const calculateTotalPrice = () => {
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return totalPrice;
  };

  return (
    <Router>
      <CartContext.Provider value={{ cart, removeFromCart }}>
        <div className="App">
          <h1>E-Commerce</h1>
          <p>Benvenuto nel negozio online. Sfoglia i nostri prodotti!</p>
          <Link to="/cart">
            <button>Carrello</button>
          </Link>
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
        </div>

        <Route path="/cart">
          <CartPage totalPrice={calculateTotalPrice()} />
        </Route>
      </CartContext.Provider>
    </Router>
  );
}

interface CartPageProps {
  totalPrice: number;
}

function CartPage({ totalPrice }: CartPageProps) {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <h2>Carrello</h2>
      <Link to="/">
        <button>Home</button>
      </Link>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>Quantità: {item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)}>Rimuovi</button>
          </li>
        ))}
      </ul>
      <p>Prezzo totale: {totalPrice}</p>
    </div>
  );
}

export default App;
