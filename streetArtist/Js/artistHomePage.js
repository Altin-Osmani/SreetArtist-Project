
// using traditional  functions declaration 

// Helper Functions
function getArtistItems(artistName, items) {
  let artistItems = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].artist.toLowerCase() === artistName.toLowerCase()) {
      artistItems.push(items[i]);
    }
  }
  return artistItems;
}
function getSoldItems(items) {
  let soldItems = [];
  for (let item of items) {
    if (item.hasOwnProperty('dateSold') && item.dateSold !== null && item.dateSold !== undefined) {
      soldItems.push({...item});
    }
  }
  return soldItems;
}

function calculateTotalIncome(items) {
  let totalIncome = 0;
  for (let i = 0; i < items.length; i++) {
    if (typeof items[i].priceSold === 'number' && !isNaN(items[i].priceSold)) {
      totalIncome += items[i].priceSold;
    }
  }
  return parseFloat(totalIncome.toFixed(2));
}

function updateHTMLContent(elements, data) {
  const { itemsSoldElement, totalIncomeElement } = elements;
  const { soldCount, totalCount, income } = data;

  if (itemsSoldElement && itemsSoldElement.tagName) {
    itemsSoldElement.innerHTML = `<span class="sold">${soldCount}</span>/<span class="total">${totalCount}</span>`;
  }

  if (totalIncomeElement && totalIncomeElement.tagName) {
    const formattedIncome = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(income);
    totalIncomeElement.innerHTML = formattedIncome;
  }
}


// using  arrow functions
// Main Function
const renderArtist = () => {
  const itemsSold = document.querySelector(".items-sold-val");
  const totalIncome = document.querySelector(".total-income-val");
  const itemAuctioning = document.querySelector(".item-auctioning");
  const artistName = localStorage.getItem("artist");

  const artistItems = getArtistItems(artistName, items_LS);
  const soldItems = getSoldItems(artistItems);
  const totalIncomeVal = calculateTotalIncome(soldItems);

  updateHTMLContent(itemsSold, totalIncome, soldItems.length, artistItems.length, totalIncomeVal);
};

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  renderArtist();
});
