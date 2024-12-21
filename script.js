const searchbar = document.getElementById('searchbar');
const mkt_sort_btn = document.getElementById('mkt-sort-btn');
const percentage_sort_btn = document.getElementById('percentage-sort-btn');

let cryptoData; // To store the fetched data

// Fetch data using async/await
async function fetchDataAsync() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');

        if (!response.ok) {
            alert("Error Fetching Data");
            return;
        }

        const data = await response.json();
        cryptoData = data;

        renderData(cryptoData); // Render the fetched data
    } catch (err) {
        console.error("Error:", err);
    }
}

// Fetch data using .then
function fetchDataThen() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error Fetching Data");
            }
            return response.json();
        })
        .then((data) => {
            cryptoData = data;
            renderData(cryptoData); // Render the fetched data
        })
        .catch((err) => {
            console.error("Error:", err);
        });
}

// Function to render data in the DOM
function renderData(data) {
    const dataList = document.getElementById('dataList'); // Ensure this exists in your HTML
    dataList.innerHTML = ''; // Clear previous content

    data.forEach((item) => {
        const dataContainer = document.createElement('tr');
        dataContainer.className = 'dataContainer';
        dataContainer.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" width="50">
            </td>
            <td>${item.name}</td>
            <td>${item.symbol.toUpperCase()}</td>
            <td>$${item.current_price.toLocaleString()}</td>
            <td>$${item.total_volume.toLocaleString()}</td>
            <td class="${item.price_change_percentage_24h < 0 ? 'red' : 'green'}">
                ${item.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>Mkt Cap : $${item.market_cap.toLocaleString()}</td>
        `;

        dataList.appendChild(dataContainer);

        // Add a dividing line
        const line = document.createElement('tr');
        line.className = 'line';
        dataList.appendChild(line);
    });
}

// Function to search data
function searchCrypto() {
    const searchInput = searchbar.value.toLowerCase(); // Search input
    const filteredData = cryptoData.filter((item) =>
        item.name.toLowerCase().includes(searchInput) || item.symbol.toLowerCase().includes(searchInput)
    );
    renderData(filteredData); // Re-render the filtered data
}

// Function to sort data by market cap
function sortByMarketCap() {
    const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
    renderData(sortedData);
}

// Function to sort data by percentage change
function sortByPercentageChange() {
    const sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    renderData(sortedData);
}

// Using async/await to fetch and initialize data when the window loads
searchbar.addEventListener('input', searchCrypto);
mkt_sort_btn.addEventListener('click', sortByMarketCap);
percentage_sort_btn.addEventListener('click', sortByPercentageChange);
window.onload = fetchDataAsync;
