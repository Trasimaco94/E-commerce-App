# SPIEGAZIONE 

### Importazione di React e altri moduli

```typescript
import React, { useState, useEffect } from "react";
import "./App.css";
```

- Importiamo `React`, `useState` e `useEffect` dal modulo "react".
- Importiamo anche il file CSS per lo stile dell'applicazione.

### Definizione delle interfacce

```typescript
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
```

- Definiamo due interfacce: `Product` e `CartItem`.
- `Product` rappresenta un singolo prodotto con le sue caratteristiche.
- `CartItem` estende `Product` aggiungendo un campo `quantity` per tenere traccia della quantità nel carrello.

### Definizione del componente App

```typescript
function App() {
  // Stati per i prodotti, il carrello, e l'errore di caricamento
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
```

- Utilizziamo lo hook `useState` per definire tre stati nel componente `App`: `products`, `cart` e `error`.
- `products` contiene i dati dei prodotti ottenuti dall'API.
- `cart` contiene i prodotti aggiunti al carrello.
- `error` contiene un messaggio di errore nel caso in cui si verifichi un problema durante il recupero dei dati.

### Effetto collaterale per il recupero dei dati dei prodotti

```typescript
  useEffect(() => {
    // Variabile locale per tenere traccia dello stato di caricamento
    let loading = true;

    fetch("https://mockend.up.railway.app/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data: Product[]) => {
        // Aggiorniamo lo stato dei prodotti
        setProducts(data);
      })
      .catch((error) => {
        // In caso di errore, impostiamo lo stato dell'errore
        setError(error.message);
      })
      .finally(() => {
        // Quando la richiesta è completata, impostiamo lo stato del caricamento a false
        loading = false;
      });

    // Funzione di cleanup
    return () => {
      // Questa funzione viene eseguita quando il componente viene dismesso
      // È utile per pulire eventuali effetti collaterali, come richieste di rete in sospeso
    };
  }, []);
```

- Utilizziamo lo hook `useEffect` per eseguire un effetto collaterale quando il componente viene montato.
- All'interno di `useEffect`, facciamo una chiamata API per recuperare i dati dei prodotti.
- Gestiamo il caso in cui la risposta non sia OK e lanciamo un'eccezione.
- Aggiorniamo lo stato dei prodotti con i dati ricevuti dall'API.
- In caso di errore, impostiamo lo stato dell'errore con il messaggio di errore.
- Infine, impostiamo la variabile locale `loading` su `false` quando il recupero dei dati è completato.

### Funzioni per gestire il carrello

```typescript
  const addToCart = (product: Product) => {
    // Verifichiamo se il prodotto è già nel carrello
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      // Se il prodotto è già nel carrello, incrementiamo la quantità
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Altrimenti, aggiungiamo il prodotto al carrello con quantità 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    // Rimuoviamo il prodotto dal carrello
    setCart(cart.filter((item) => item.id !== productId));
  };
```

- `addToCart`: Questa funzione gestisce l'aggiunta di un prodotto al carrello. Controlla se il prodotto è già presente nel carrello. Se sì, incrementa la quantità. Altrimenti, aggiunge il prodotto al carrello con una quantità iniziale di 1.
- `removeFromCart`: Questa funzione rimuove un prodotto dal carrello.

### Rendering del componente

```typescript
  return (
    <div className="App">
      {/* Rendering dei prodotti */}
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

      {/* Rendering del messaggio di errore */}
      {error && <div>Error: {error}</div>}

      {/* Rendering del carrello */}
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
```

- Nel rendering, mostriamo la lista dei prodotti se sono stati ottenuti correttamente, altrimenti mostriamo un messaggio di caricamento.
- Se si verifica un errore durante il recupero dei dati, mostriamo un messaggio di errore.
- Infine, mostriamo il carrello con i prodotti aggiunti e forniamo un pulsante per rimuovere i prodotti dal carrello.


# *SETERROR* E *FINALLY*
 
`setError` e `.finally` sono entrambi metodi di JavaScript utilizzati nel contesto di questa applicazione React.

1. **`setError`**: Questo è un metodo utilizzato per impostare lo stato di `error`. In React, quando si utilizza lo stato tramite `useState`, viene restituito un array con due elementi: il valore dello stato e una funzione per modificarlo. Quando chiami questa funzione (nel tuo caso `setError`), il valore dello stato viene aggiornato con il nuovo valore passato come argomento.

   Nel tuo codice:
   ```typescript
   .catch((error) => {
     setError(error.message);
   })
   ```
   Quando si verifica un errore durante la chiamata API, viene chiamato il metodo `catch`, che a sua volta chiama `setError` per impostare lo stato di `error` con il messaggio di errore ottenuto dalla chiamata API.

2. **`.finally`**: Questo è un metodo utilizzato nelle promesse JavaScript. Viene eseguito sempre, indipendentemente dal risultato (risolto o rigettato) della promessa. È utile per eseguire le operazioni di pulizia o altre operazioni che devono essere eseguite indipendentemente dall'esito della promessa.

   Nel tuo codice:
   ```typescript
   .finally(() => {
     loading = false;
   });
   ```
   Dopo che la promessa generata da `fetch` è stata risolta o rigettata, `.finally` viene eseguito per impostare la variabile locale `loading` su `false`, indicando che il caricamento dei dati è stato completato. Anche se ci sono stati errori nel recupero dei dati o se è andato tutto bene, questa operazione verrà eseguita.