let count = 1;
document.getElementById("radio1").checked = true;

let interval = setInterval(nextImage, 5000);

function nextImage() {
  count++;
  if (count > 4) {
    count = 1;
  }
  document.getElementById("radio" + count).checked = true;
}


const carousel = document.getElementById("carousel");

carousel.addEventListener("mouseenter", function () {
  clearInterval(interval); 
});

carousel.addEventListener("mouseleave", function () {
  interval = setInterval(nextImage, 5000); 
});





document.addEventListener("DOMContentLoaded", () => {

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menu = document.querySelector(".menu ul");
  
    hamburgerMenu.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    const carousels = document.querySelectorAll(".carousel-container");
  
    carousels.forEach((carouselContainer) => {
      const carousel = carouselContainer.querySelector(".carousel-empregos");
      const prevBtn = carouselContainer.querySelector(".prev-btn");
      const nextBtn = carouselContainer.querySelector(".next-btn");
  
      let offset = 0;
  
      prevBtn.addEventListener("click", () => {
        const cardWidth = carousel.querySelector(".card").offsetWidth + 20; 
        offset = Math.min(offset + cardWidth, 0); 
        carousel.style.transform = `translateX(${offset}px)`;
      });
  
      nextBtn.addEventListener("click", () => {
        const cardWidth = carousel.querySelector(".card").offsetWidth + 20;
        const maxOffset = -(carousel.scrollWidth - carouselContainer.offsetWidth);
        offset = Math.max(offset - cardWidth, maxOffset); 
        carousel.style.transform = `translateX(${offset}px)`;
      });
    });
  });

// Pokémon API Integration
document.addEventListener('DOMContentLoaded', () => {
  const pokemonContainer = document.getElementById('pokemonContainer');
  const prevBtn = document.getElementById('prevPokemon');
  const nextBtn = document.getElementById('nextPokemon');
  const favoritesContainer = document.getElementById('favoritesContainer');
  let currentOffset = 0;
  const pokemonPerPage = 5;
  let pokemonList = [];
  let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

  // Type colors for styling
  const typeColors = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0',
    electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
    dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
  };

  function saveFavorites() {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }

  function isFavorite(pokemonId) {
    return favorites.includes(pokemonId);
  }

  function toggleFavorite(pokemonId) {
    const index = favorites.indexOf(pokemonId);
    if (index === -1) {
      favorites.push(pokemonId);
    } else {
      favorites.splice(index, 1);
    }
    saveFavorites();
    updateFavoritesDisplay();
  }

  function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    
    const types = pokemon.types.map(type => type.type.name);
    const stats = pokemon.stats.map(stat => ({
      name: stat.stat.name,
      value: stat.base_stat
    }));
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = `favorite-btn ${isFavorite(pokemon.id) ? 'favorited' : ''}`;
    favoriteBtn.innerHTML = '❤';
    favoriteBtn.onclick = () => {
      toggleFavorite(pokemon.id);
      favoriteBtn.classList.toggle('favorited');
    };
    
    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name} (#${pokemon.id})</h3>
      <div class="pokemon-types">
        ${types.map(type => `
          <span class="pokemon-type" style="background-color: ${typeColors[type] || '#777'}">
            ${type}
          </span>
        `).join('')}
      </div>
      <div class="pokemon-stats">
        ${stats.map(stat => `
          <div class="pokemon-stat">
            ${stat.name}: ${stat.value}
          </div>
        `).join('')}
      </div>
    `;
    
    card.appendChild(favoriteBtn);
    return card;
  }

  async function updateFavoritesDisplay() {
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="empty-favorites">
          <h3>Nenhum Pokémon favorito</h3>
          <p>Adicione Pokémon aos favoritos clicando no coração ❤</p>
        </div>
      `;
      return;
    }

    for (const pokemonId of favorites) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) continue;
        const pokemon = await response.json();
        favoritesContainer.appendChild(createPokemonCard(pokemon));
      } catch (error) {
        console.error('Erro ao carregar Pokémon favorito:', error);
      }
    }
  }

  async function fetchPokemonList(offset = 0, limit = 20) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      if (!response.ok) throw new Error('Erro ao carregar Pokémon');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erro:', error);
      return [];
    }
  }

  async function fetchPokemonDetails(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar detalhes do Pokémon');
      return await response.json();
    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  }

  async function loadPokemon() {
    pokemonContainer.innerHTML = '<p>Carregando Pokémon...</p>';
    
    const pokemonUrls = await fetchPokemonList(currentOffset, pokemonPerPage);
    const pokemonDetails = await Promise.all(
      pokemonUrls.map(pokemon => fetchPokemonDetails(pokemon.url))
    );
    
    pokemonList = pokemonDetails.filter(pokemon => pokemon !== null);
    
    pokemonContainer.innerHTML = '';
    pokemonList.forEach(pokemon => {
      pokemonContainer.appendChild(createPokemonCard(pokemon));
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentOffset > 0) {
      currentOffset -= pokemonPerPage;
      loadPokemon();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentOffset += pokemonPerPage;
    loadPokemon();
  });

  // Load initial Pokémon and favorites
  loadPokemon();
  updateFavoritesDisplay();
});

