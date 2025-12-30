const input = document.getElementById('input')
  const btn = document.getElementById('btn')
  const hasil = document.getElementById('hasil')

  let currentPage = 1;
  let currentKeyword = ''

  async function movie(page = 1) {
 try {
    const keyword = input.value.trim() || currentKeyword
    if (!keyword) {
      alert('isi input terlebiih dahulu')
      return
    }
    currentKeyword = keyword
    currentPage = page

    hasil.style.display = 'block'
    hasil.textContent = 'loading...'
    const res = await fetch(`https://www.omdbapi.com/?apikey=8ac5e916&s=${keyword}&page=${page}`)
    if (!res.ok) {
        throw new Error('gagal ngeload fetch');
        
    }
    const data = await res.json()

    if (!data.Search || data.Search.length === 0) {
        hasil.textContent = 'film tidak ditemukan'
        return;
    }

    hasil.innerHTML = data.Search.map(a => `
    <div>
      <img src="${a.Poster !== 'N/A' ? a.Poster : 'https://via.placeholder.com/150'}" alt="${a.Title}">
      <div>
        <h3>${a.Title}</h3>
        <p>Tahun: ${a.Year}</p>
        <p>Tipe: ${a.Type}</p>
        <p>IMDB ID: ${a.imdbID}</p>
      </div>
    </div>
    `).join('')
    input.value = ''

    renderPagination(data.totalResults)
 }
    catch(err) {
        console.log(err)
            hasil.textContent = 'terjadi kesalahan pada saat mengambil data film'
    }
}

function renderPagination(totalResults) {
  const totalPages = Math.ceil(Number(totalResults) / 10)
  hasil.innerHTML += `
    <div class="pagination" style="text-align: center; margin-top: 20px;">
      <button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>
        Prev
      </button>
      <button onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>
        Next
      </button>
    </div>
  `
}

function prevPage (){
  movie(currentPage - 1)
}

function nextPage (){
  movie(currentPage + 1)
}

btn.addEventListener('click', movie)
input.addEventListener('keypress', function(e){
    if (e.key === 'Enter') movie()
})