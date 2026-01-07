const url = 'http://localhost:3000/books';

// Hämta referenser till de element vi behöver manipulera i HTML-filen
const bookForm = document.getElementById('bookForm');
const listContainer = document.getElementById('listContainer');
const toast = document.getElementById('toast');

// Kör fetchData när sidan har laddats klart
window.addEventListener('load', fetchData);


 // Hämtar alla böcker från vårt API och skickar dem vidare till render-funktionen.
 
function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then((books) => {
      renderBooks(books);
    })
    .catch(err => {
      console.error("Kunde inte hämta data:", err);
      showNotification("Ett fel uppstod när biblioteket skulle laddas.");
    });
}


 // Tar emot en array av böcker och bygger upp HTML-strukturen för listan.
 
function renderBooks(books) {
  // Om det inte finns några böcker visar vi ett meddelande istället
  if (!books || books.length === 0) {
    listContainer.innerHTML = '<p class="text-center text-slate-200">Biblioteket är tomt.</p>';
    return;
  }

  // Skapa start-taggen för vår lista med Tailwind-grid
  let html = `<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-8">`;

  books.forEach((book) => {
    // Bestäm färg baserat på kategori (Krav: grafisk aspekt styrd av data)
    const color = getCategoryColor(book.category);

    // Bygg upp varje listobjekt dynamiskt
    html += `
      <li class="bg-${color}-100 border-l-8 border-${color}-500 p-4 rounded-lg shadow-md flex flex-col justify-between text-slate-800">
        <div>
          <h3 class="text-xl font-bold mb-1">${book.title}</h3>
          <p class="text-md italic">av ${book.author}</p>
          <span class="inline-block bg-${color}-200 text-${color}-800 text-xs px-2 py-1 rounded-full mt-2">
            ${book.category}
          </span>
          <p class="text-xs text-slate-500 mt-2 italic">ISBN: ${book.isbn || 'N/A'}</p>
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
          <button onclick="setCurrentBook(${book.id})" class="text-blue-600 hover:underline text-sm font-medium">
            Ändra
          </button>
          <button onclick="deleteBook(${book.id})" class="text-red-600 hover:underline text-sm font-medium">
            Ta bort
          </button>
        </div>
      </li>`;
  });

  html += `</ul>`;
  
  // Lägga till den färdiga HTML-strängen i vår behållare
  listContainer.innerHTML = html;
}


 // Hämtar en specifik bok och fyller i formuläret så användaren kan redigera.

function setCurrentBook(id) {
  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((book) => {
      // Fyll i formulärets input-fält med bokens nuvarande data
      bookForm.title.value = book.title;
      bookForm.author.value = book.author;
      bookForm.isbn.value = book.isbn;
      bookForm.category.value = book.category;

      // Spara ID i localStorage.
      localStorage.setItem('currentId', book.id);
      showNotification("Boken har laddats in i formuläret.");
      
      // Scrolla upp till formuläret för bättre användarupplevelse
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


 // Ta bort en bok.
 
function deleteBook(id) {
  if (confirm("Är du säker på att du vill radera denna bok?")) {
    fetch(`${url}/${id}`, { method: 'DELETE' })
      .then(() => {
        // Uppdatera listan direkt utan att ladda om hela sidan (SPA-tänk)
        fetchData(); 
        showNotification("Boken raderades framgångsrikt.");
      })
      .catch(err => console.error("Fel vid borttagning:", err));
  }
}



 
bookForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Stoppa sidan från att laddas om
  
  // Kontrollera om vi redigerar en befintlig bok
  const id = localStorage.getItem('currentId');
  
  // Skapa objektet som ska skickas till servern
  const bookData = {
    title: bookForm.title.value,
    author: bookForm.author.value,
    isbn: bookForm.isbn.value,
    category: bookForm.category.value
  };

  // Om vi har ett ID, lägg till det i objektet
  if (id) {
    bookData.id = id;
  }

  // Välj metod (PUT för uppdatering, POST för ny bok)
  const method = id ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  })
  .then(() => {
    fetchData(); // Hämta den nya listan
    bookForm.reset(); // Töm formuläret
    localStorage.removeItem('currentId'); // Rensa redigerings-ID
    showNotification(id ? "Boken har uppdaterats!" : "Boken har lagts till i biblioteket!");
  })
  .catch(err => console.error("Kunde inte spara:", err));
});



// Visar en tillfällig notis uppe i hörnet
function showNotification(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Mappar kategorier till Tailwind-färger för att styla boken
function getCategoryColor(category) {
  const colors = {
    'Fantasy': 'purple',
    'Romance': 'pink',
    'Crime & Detective Fiction': 'red',
    'Science Fiction': 'emerald',
    'Horror': 'orange',
    'Novels': 'sky',
    'Dystopian / Post-Apocalyptic': 'amber',
    'Thriller & Suspense': 'rose'
  };
  // Returnera 'slate' (grå) om kategorin inte finns i listan ovan
  return colors[category] || 'slate';
}