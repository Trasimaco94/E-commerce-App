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

   # AGGIORNAMENTO SPIEGAZIONE 

1. **Importazioni e definizioni di interfaccia**:
   - Le importazioni iniziali includono `React`, `useState`, `useEffect` e `Link`, necessarie per la gestione dello stato e delle azioni nel componente React, nonché per la navigazione tramite React Router.
   - È stata definita un'interfaccia `Product` per rappresentare la struttura dei prodotti ottenuti dalla chiamata API.
   - È stata definita un'interfaccia `CartItem` che estende `Product` aggiungendo la proprietà `quantity` per tenere traccia della quantità di un prodotto nel carrello.
   
2. **Componente principale `App`**:
   - Viene dichiarato il componente `App` che rappresenta l'intera applicazione.
   - Sono stati definiti tre stati utilizzando il `useState` hook: `products` per memorizzare i prodotti ottenuti dalla chiamata API, `cart` per memorizzare i prodotti aggiunti al carrello e `[]` per tenere traccia dei prezzi dei prodotti nel carrello.
   - Viene utilizzato l'`useEffect` hook per effettuare la chiamata API quando il componente viene montato.
   - La funzione `addToCart` aggiunge un prodotto al carrello.
   - La funzione `removeFromCart` rimuove un prodotto dal carrello.
   - La funzione `calculateTotalPrice` calcola il prezzo totale dei prodotti nel carrello.
   - Viene utilizzato `BrowserRouter` per avvolgere l'intera applicazione e abilitare la navigazione tramite React Router.
   - Viene mostrato un elenco di prodotti e un pulsante "Carrello" che reindirizza alla pagina del carrello.

3. **Pagina del carrello `CartPage`**:
   - Viene definito il componente `CartPage`, che mostra i prodotti nel carrello e il prezzo totale.
   - Viene utilizzato il componente `Link` per creare un link che reindirizza alla pagina principale.
   - Viene mappato l'array `cart` per mostrare tutti i prodotti nel carrello.
   - Ogni prodotto nel carrello viene visualizzato con il titolo, l'immagine, la quantità e un pulsante "Rimuovi" per rimuovere il prodotto dal carrello.
   - Viene mostrato il prezzo totale dei prodotti nel carrello.


# *LINK* E *BROWSERROUTER*
   `Link` e `BrowserRouter` sono entrambi componenti forniti da `react-router-dom`, una libreria che offre funzionalità di gestione della navigazione in React.

1. **`Link`**:
   - Il componente `Link` viene utilizzato per creare un link tra diverse "pagine" della tua Single Page Application (SPA).
   - Funziona sostanzialmente come un normale tag `<a>` HTML, ma anziché caricare una nuova pagina, utilizza React Router per aggiornare l'URL e renderizzare il componente associato all'URL senza dover effettuare una richiesta HTTP.
   - Quando si fa clic su un componente `Link`, React Router intercetta l'evento di clic e gestisce la navigazione senza dover ricaricare l'intera pagina.

Esempio:
```javascript
<Link to="/cart">
  <button>Carrello</button>
</Link>
```
In questo esempio, viene creato un link che reindirizza l'utente alla pagina del carrello quando si fa clic sul pulsante "Carrello".

2. **`BrowserRouter`**:
   - `BrowserRouter` è un componente wrapper che fornisce il contesto per la gestione delle rotte (routes) tramite React Router.
   - Viene utilizzato per avvolgere l'intera applicazione e abilitare la navigazione basata sulle rotte.
   - `BrowserRouter` utilizza la parte del percorso dell'URL (dopo il dominio) per determinare quale componente renderizzare in base alla rotta specificata.

Esempio:
```javascript
<BrowserRouter>
  <App />
</BrowserRouter>
```
In questo esempio, l'intera applicazione, rappresentata dal componente `App`, è avvolta dal componente `BrowserRouter`. Ciò consente a React Router di gestire la navigazione all'interno dell'applicazione in base alle rotte specificate.

# AGGIORNAMENTO

Nel codice fornito ci sono casi di props drilling. Il props drilling si verifica quando si passano props attraverso più livelli di componenti, anche quando alcuni di questi componenti non hanno bisogno direttamente di quelle props. Nel codice fornito, il props drilling si verifica quando passiamo le props `cart` e `removeFromCart` dal componente `App` al componente `CartPage`.

Il componente `App` gestisce lo stato del carrello e contiene anche la funzione `removeFromCart`. Queste informazioni vengono passate al componente `CartPage` attraverso props. Anche se il componente `CartPage` non ha bisogno direttamente di queste informazioni per il suo funzionamento interno, esse vengono passate attraverso i livelli intermedi di componenti. Questo è un esempio di props drilling.

Per eliminare il props drilling, si può utilizzare il Context API di React. Invece di passare esplicitamente le props `cart` e `removeFromCart` attraverso tutti i livelli di componenti, si possono fornire queste informazioni utilizzando un context. Ecco come si potrebbe modificare il codice per utilizzare il Context API:

```jsx
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
```

In questo esempio, abbiamo creato un `CartContext` utilizzando `createContext`, che contiene lo stato del carrello e la funzione `removeFromCart`. Nel componente `App`, avvolgiamo la nostra app con il `CartContext.Provider` per rendere questi dati disponibili globalmente. Nel componente `CartPage`, utilizziamo `useContext` per accedere al contesto e ottenere il carrello e la funzione `removeFromCart` senza passarli esplicitamente attraverso props. Questo elimina il props drilling e semplifica il passaggio dei dati attraverso la gerarchia dei componenti.


Analizzeremo adesso il codice passo dopo passo per capire come funziona.

1. **Definizione delle interfacce**:
   - Le interfacce `Product` e `CartItem` definiscono la struttura dei dati per i prodotti e gli elementi del carrello.

2. **Creazione del contesto**:
   - Viene creato un `CartContext` utilizzando `createContext()`. Questo contesto contiene le informazioni sul carrello, come `cart` e `removeFromCart`.

3. **Componente App**:
   - Nel componente `App`, vengono gestiti gli stati per i prodotti (`products`) e il carrello (`cart`).
   - Utilizziamo `useEffect` per effettuare una chiamata API per recuperare i prodotti una volta che il componente è stato montato.
   - La funzione `addToCart` viene utilizzata per aggiungere un prodotto al carrello. Se il prodotto è già presente nel carrello, incrementiamo la quantità, altrimenti lo aggiungiamo al carrello con quantità 1.
   - La funzione `removeFromCart` rimuove un prodotto dal carrello in base all'ID del prodotto.
   - La funzione `calculateTotalPrice` calcola il prezzo totale del carrello moltiplicando il prezzo di ogni prodotto per la sua quantità e sommandoli tutti.

4. **Rendering dei prodotti**:
   - Nel rendering del componente `App`, mostriamo una lista di prodotti se sono stati caricati. Per ogni prodotto, mostriamo l'immagine, il titolo, la quantità disponibile e un pulsante per aggiungere il prodotto al carrello.

5. **Routing e rendering della pagina del carrello**:
   - Utilizziamo il componente `Router` di React Router per la gestione del routing.
   - Quando l'URL corrisponde a `/cart`, viene renderizzato il componente `CartPage`.
   - Nel componente `CartPage`, utilizziamo il `useContext` hook per accedere al `CartContext` e ottenere il carrello e la funzione `removeFromCart`.
   - Mostriamo tutti gli elementi del carrello e un pulsante per rimuovere ciascun prodotto.
   - Calcoliamo e mostriamo il prezzo totale del carrello.

Questo è un riassunto del funzionamento del codice. Il contesto (`CartContext`) ci consente di evitare il props drilling, consentendo a componenti figli come `CartPage` di accedere direttamente alle informazioni sul carrello senza doverle passare esplicitamente attraverso props.

## NEL DETTAGLIO

1. **Definizione delle interfacce**:
   Le interfacce `Product` e `CartItem` definiscono la struttura dei dati per i prodotti e gli elementi del carrello. Questo aiuta a garantire che i dati siano conformi al formato previsto e facilita la gestione dei dati all'interno dell'applicazione.

2. **Creazione del contesto**:
   - Utilizzando `createContext()`, definiamo un contesto chiamato `CartContext`.
   - Questo contesto conterrà le informazioni sul carrello, come la lista dei prodotti nel carrello (`cart`) e la funzione per rimuovere un prodotto dal carrello (`removeFromCart`).

3. **Componente App**:
   - Nel componente `App`, vengono gestiti gli stati per i prodotti (`products`) e il carrello (`cart`).
   - Utilizziamo `useEffect` per effettuare una chiamata API per recuperare i prodotti una volta che il componente è stato montato. Quando i dati sono disponibili, vengono impostati nello stato `products`.
   - La funzione `addToCart` viene utilizzata per aggiungere un prodotto al carrello. Controlliamo se il prodotto è già presente nel carrello. Se sì, aggiorniamo la quantità del prodotto nel carrello. Se non è presente, aggiungiamo il prodotto al carrello con quantità 1.
   - La funzione `removeFromCart` rimuove un prodotto dal carrello in base all'ID del prodotto.
   - La funzione `calculateTotalPrice` calcola il prezzo totale del carrello sommando il prezzo di ogni prodotto moltiplicato per la sua quantità.

4. **Rendering dei prodotti**:
   - Nel rendering del componente `App`, mostriamo una lista di prodotti se sono stati caricati. Utilizziamo una struttura condizionale per mostrare un messaggio di caricamento se i dati dei prodotti non sono ancora stati caricati.
   - Per ogni prodotto, mostriamo l'immagine, il titolo, la quantità disponibile e un pulsante per aggiungere il prodotto al carrello.

5. **Routing e rendering della pagina del carrello**:
   - Utilizziamo il componente `Router` di React Router per gestire il routing dell'applicazione.
   - Quando l'URL corrisponde a `/cart`, viene renderizzato il componente `CartPage`.
   - Nel componente `CartPage`, utilizziamo il `useContext` hook per accedere al `CartContext` e ottenere il carrello (`cart`) e la funzione `removeFromCart`.
   - Mostriamo tutti gli elementi presenti nel carrello con le relative informazioni, come l'immagine, il titolo, la quantità e un pulsante per rimuovere il prodotto dal carrello.
   - Calcoliamo e mostriamo il prezzo totale del carrello utilizzando la funzione `calculateTotalPrice`.

Utilizzare il contesto (`CartContext`) ci permette di evitare il props drilling, consentendo ai componenti figli di accedere direttamente alle informazioni sul carrello senza doverle passare esplicitamente attraverso props. Ciò semplifica la gestione dello stato all'interno dell'applicazione e migliora la leggibilità del codice.