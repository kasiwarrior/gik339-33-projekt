const url = 'http://localhost:3000/books';

// Hämta referenser till HTML-elementen (synkade med index.html)
const bookForm = document.getElementById('bookForm'); // Matchar id i index.html
const listContainer = document.getElementById('listContainer');
const toast = document.getElementById('toast');

window.addEventListener('load', fetchData);

// 1. Hämta alla böcker (R i CRUD) [cite: 156, 228]
function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then((books) => {
      renderBooks(books);
    })
    .catch(err => console.error("Kunde inte hämta data:", err));
}

// 2. Rendera listan dynamiskt (Krav: Får inte finnas i HTML från början) [cite: 232, 234]
function renderBooks(books) {
  if (books.length > 0) {
    let html = `<ul class="w-3/4 my-3 mx-auto flex flex-wrap gap-2 justify-center">`;
    books.forEach((book) => {
      // Bestäm färg baserat på kategori (Krav: Grafisk aspekt styrd av data) 
      const color = getCategoryColor(book.category);

      html += `
        <li
          class="bg-${color}-200 basis-1/4 text-${color}-900 p-2 rounded-md border-2 border-${color}-400 flex flex-col justify-between shadow-sm">
          <h3 class="font-bold">${book.title}</h3>
          <p class="text-sm italic">av ${book.author}</p>
          <p class="text-xs mt-1">ISBN: ${book.isbn || 'Saknas'}</p>
          <div class="flex gap-2">
            <button
              class="border border-${color}-300 hover:bg-white/100 rounded-md bg-white/50 p-1 text-xs mt-2" 
              onclick="setCurrentBook(${book.id})">
              Ändra
            </button>
            <button 
              class="border border-${color}-300 hover:bg-white/100 rounded-md bg-white/50 p-1 text-xs mt-2" 
              onclick="deleteBook(${book.id})">
              Ta bort
            </button>
          </div>
        </li>`;
    });
    html += `</ul>`;

    listContainer.innerHTML = html;
  } else {
    listContainer.innerHTML = '<p class="text-center">Biblioteket är tomt.</p>';
  }
}

// 3. Förbered för uppdatering (Fyll formulär med befintlig data) [cite: 253, 255]
function setCurrentBook(id) {
  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((book) => {
      // Fyller i formulärets fält baserat på deras 'name'-attribut
      bookForm.title.value = book.title;
      bookForm.author.value = book.author;
      bookForm.isbn.value = book.isbn;
      bookForm.category.value = book.category;

      // Sparar id dolt i localStorage (Krav: ID får inte synas i gränssnittet) [cite: 260, 262, 263]
      localStorage.setItem('currentId', book.id);
      showNotification("Boken har laddats in i formuläret.");
    });
}

// 4. Ta bort en resurs (D i CRUD) [cite: 159, 264]
function deleteBook(id) {
  if (confirm("Vill du verkligen ta bort denna bok?")) {
    fetch(`${url}/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchData(); // Uppdatera listan dynamiskt utan omladdning [cite: 270]
        showNotification("Boken har tagits bort.");
      });
  }
}

// 5. Skapa eller Uppdatera (C och U i CRUD) [cite: 285, 286]
bookForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault(); // Förhindrar sidomladdning (SPA-krav) [cite: 225, 286]
  
  const id = localStorage.getItem('currentId');
  
  // Skapa objektet som ska skickas till servern [cite: 288]
  const bookData = {
    title: bookForm.title.value,
    author: bookForm.author.value,
    isbn: bookForm.isbn.value,
    category: bookForm.category.value
  };

  // Om ett id finns i localStorage, lägg till det för att köra en PUT [cite: 188, 260]
  if (id) {
    bookData.id = id;
  }

  const request = new Request(url, {
    method: id ? 'PUT' : 'POST', // Välj metod baserat på om vi ändrar eller skapar [cite: 157, 158]
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(bookData)
  });

  fetch(request).then((response) => {
    fetchData(); // Uppdatera listan [cite: 290]
    localStorage.removeItem('currentId'); // Rensa id efter skickat formulär
    bookForm.reset();
    showNotification(id ? "Boken har uppdaterats!" : "Boken har lagts till!");
  });
}

// Hjälpfunktioner
function showNotification(message) {
  toast.textContent = message;
  toast.classList.remove('hidden'); // Visa rutan [cite: 293, 295]
  setTimeout(() => {
    toast.classList.add('hidden'); // Dölj efter 3 sekunder
  }, 3000);
}

function getCategoryColor(category) {
  // Mappar kategorier till Tailwind-färger (grafisk aspekt) [cite: 214, 237]
  const colors = {
    'Fantasy': 'purple',
    'Romance': 'pink',
    'Crime & Detective Fiction': 'red',
    'Science Fiction': 'emerald',
    'Horror': 'orange',
    'Novels': 'sky'
  };
  return colors[category] || 'slate';
}



  // JUST NU: Använd Mock-data för att testa din design
  const mockBooks = [
    { id: 1, title: "Exempelbok 1", author: "Författare A", category: "Fantasy" },
    { id: 2, title: "Exempelbok 2", author: "Författare B", category: "Romance" },
    { id: 3, title: "Exempelbok 3", author: "Författare C", category: "Novels" }
  ];
  
  renderBooks(mockBooks); 

// 2. Render-funktionen: Ansvarar ENDAST för att rita ut HTML
function renderBooks(books) {
  // Krav: Listan får inte finnas i HTML från början [cite: 232]
  if (!books || books.length === 0) {
    listContainer.innerHTML = '<p class="text-center text-slate-200">Inga böcker att visa.</p>';
    return;
  }

  // Skapa basen för listan
  let html = `<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-8">`;

  books.forEach((book) => {
    // Krav: En egenskap ska styra en grafisk aspekt (här: färg baserat på kategori) 
    const color = getCategoryColor(book.category);

    html += `
      <li class="bg-${color}-100 border-l-8 border-${color}-500 p-4 rounded-lg shadow-md flex flex-col justify-between text-slate-800">
        <div>
          <h3 class="text-xl font-bold mb-1">${book.title}</h3>
          <p class="text-md italic">av ${book.author}</p>
          <span class="inline-block bg-${color}-200 text-${color}-800 text-xs px-2 py-1 rounded-full mt-2">
            ${book.category}
          </span>
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
  
  // Krav: HTML skapas och läggas till i DOM-trädet dynamiskt [cite: 234, 235]
  listContainer.innerHTML = html;
}



// Starta appen
window.addEventListener('load', fetchData);

function setCurrentBook(id) {
  // SIMULERAT SVAR (Istället för fetch)
  const dummyBook = {
    id: id,
    title: "Simulerad Titel",
    author: "Test Författare",
    isbn: "123-456",
    category: "Fantasy"
  };

  // Fyll formuläret
  bookForm.title.value = dummyBook.title;
  bookForm.author.value = dummyBook.author;
  bookForm.isbn.value = dummyBook.isbn;
  bookForm.category.value = dummyBook.category;

  // Spara ID för att veta att nästa submit ska vara en PUT
  localStorage.setItem('currentId', dummyBook.id);
  showNotification("Test-data laddad i formuläret!");
}