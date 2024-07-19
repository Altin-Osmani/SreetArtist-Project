// DOM Elements
const artistItemsPage = document.getElementById("artists/items");
const allCardsWrapper = document.getElementById("artist_cards");
const overlay = document.querySelector(".confirm-screen-overlay");
const confirmPopUp = document.querySelector(".confirm-popup");
const addNewItemButton = document.querySelector(".add-new-item");

let editingItem = "";
let editingItemNode;
let editingItemIndex;
let editingFlag = false;

// Helper Functions
const showAlert = (message) => {
    alertScreenOverlay.classList.add("active");
    alertPopup.classList.add("active");
    alertText.textContent = message;
    alertReadBtn.addEventListener("click", () => {
        alertScreenOverlay.classList.remove("active");
        alertPopup.classList.remove("active");
    });
};

const checkUrl = async (url) => {
    const res = await fetch(url);
    const buff = await res.blob();
    return buff.type.startsWith('image/');
};

const clearItemInputs = () => {
    newTitle.value = "";
    newDesc.value = "";
    newType.value = "";
    newPrice.value = "";
    newImgUrl.value = "";
    newUploadedImg.value = "";
    newImgDisplayed.src = "";
    dispImgWrapper.style.display = "none";
    ImgBase64 = "";
    addItemH1.textContent = "Add new Item";
    addBtn.textContent = "Add new Item";
    editingFlag = false;
};

// Card Rendering Functions
const createCardElements = () => {
    const cardWrapper = document.createElement("div");
    const card = document.createElement("div");
    const cardButtons = document.createElement("div");
    const sendToAucBtn = document.createElement("button");
    const publishBtn = document.createElement("button");
    const removeBtn = document.createElement("button");
    const editBtn = document.createElement("button");

    cardWrapper.classList.add("card-wrapper");
    card.classList.add("card", "light");
    cardButtons.classList.add("card-btns");
    sendToAucBtn.classList.add("send-to-auc");
    removeBtn.classList.add("remove");
    editBtn.classList.add("edit");

    sendToAucBtn.textContent = "Send to Auction";
    removeBtn.textContent = "Remove";
    editBtn.textContent = "Edit";

    cardButtons.append(sendToAucBtn, publishBtn, removeBtn, editBtn);
    card.append(cardButtons);
    cardWrapper.append(card);

    return { cardWrapper, card, cardButtons, sendToAucBtn, publishBtn, removeBtn, editBtn };
};

const setCardContent = (card, cardInner) => {
    card.innerHTML += cardInner;
};

const renderArtistCard = (id, imgUrl, itemTitle, date, price, desc, published) => {
    const { cardWrapper, card, cardButtons, sendToAucBtn, publishBtn, removeBtn, editBtn } = createCardElements();

    cardWrapper.setAttribute("id", id);

    const cardInner = `
        <img src="${imgUrl}" alt="art-image">
        <div class="card-text">
            <div class="name-price">
                <div>
                    <h5 class="item-title">${itemTitle}</h5>
                    <p class="datum">${date}</p>
                </div>
                <span class="price">$${price}</span>
            </div>
            <p class="desc">${desc}</p>
        </div>
    `;

    setCardContent(card, cardInner);

    allCardsWrapper.append(cardWrapper);

    if (!published) {
        publishBtn.classList.add("publish");
        publishBtn.textContent = "Publish";
    } else {
        publishBtn.classList.add("unpublish");
        publishBtn.textContent = "Unpublish";
    }

     items_LS = getItem("itemsLS");
    const onAuctionItems = items_LS.filter(item => item.isAuctioning);

    if (items_LS.filter(item => item.priceSold).length > 0) {
        sendToAucBtn.setAttribute("disabled", "true");
    } else {
        sendToAucBtn.removeAttribute("disabled");
        sendToAucBtn.style.background = "#188DE6";
    }

    sendToAucBtn.addEventListener('click', () => {
        const idx = items_LS.findIndex(item => item.id == sendToAucBtn.id);
        items_LS[idx].isPublished = !items_LS[idx].isPublished;
        updateItemsLS(items_LS);
    });

    addCardButtonEventListeners(cardWrapper, removeBtn, publishBtn, editBtn, sendToAucBtn);
};


const renderAllArtistCards = () => {
    allCardsWrapper.innerHTML = "";
    const artistName = localStorage.getItem("artist");
     items_LS = getItem("itemsLS");

    const artistItems = items_LS ? items_LS.filter(item => item.artist === artistName) : items.filter(item => item.artist === artistName);

    artistItems.forEach(item => {
        const date = new Date(item.dateCreated).toLocaleDateString("en-GB");
        renderArtistCard(item.id, item.image, item.title, date, item.price, item.description, item.isPublished);
    });
};



// Event Handling Functions
const addCardButtonEventListeners = (cardWrapper, removeBtn, publishBtn, editBtn, sendToAucBtn) => {
    cardWrapper.addEventListener('click', (e) => {
        const { target } = e;
        if (target === removeBtn) {
            showConfirmPopup(cardWrapper.id);
        } else if (target === publishBtn) {
            togglePublishStatus(target, cardWrapper.id);
        } else if (target === editBtn) {
            initEdit(cardWrapper.id);
        } else if (target === sendToAucBtn) {
            sendToAuction(cardWrapper.id);
        }
    });
};

const showConfirmPopup = (itemId) => {
    overlay.classList.add("active");
    confirmPopUp.classList.add("active");
    localStorage.setItem("itemID", itemId);
};

const togglePublishStatus = (publishBtn, itemId) => {
    const itemIndex = items_LS.findIndex(item => item.id === +itemId);
    const item = items_LS[itemIndex];
    item.isPublished = !item.isPublished;
    if (item.isPublished) {
        publishBtn.classList.remove("publish");
        publishBtn.classList.add("unpublish");
        publishBtn.textContent = "Unpublish";
    } else {
        publishBtn.classList.add("publish");
        publishBtn.classList.remove("unpublish");
        publishBtn.textContent = "Publish";
    }
    updateItemsLS(items_LS);
};

const initEdit = (itemId) => {
    editingFlag = true;
    editingItemIndex = items_LS.findIndex(item => item.id === +itemId);
    editingItem = items_LS[editingItemIndex];
    location.hash = "artists/add-new-item";
    initEditMode();
};

const sendToAuction = (itemId) => {
    const itemIndex = items_LS.findIndex(item => item.id === +itemId);
    items_LS[itemIndex].isAuctioning = true;
    updateItemsLS(items_LS);
};

// Confirmation Popup Event Handling
confirmPopUp.addEventListener("click", (e) => {
    const { target } = e;
    const itemID = localStorage.getItem("itemID");
    const itemToRemove = document.getElementById(itemID);
    const itemIndex = items_LS.findIndex(item => item.id === +itemID);

    if (target.matches(".cancel")) {
        overlay.classList.remove("active");
        confirmPopUp.classList.remove("active");
    } else if (target.matches(".confirm")) {
        overlay.classList.remove("active");
        confirmPopUp.classList.remove("active");
        itemToRemove.remove();
        items_LS.splice(itemIndex, 1);
        updateArrIds(items_LS);
        updateItemsLS(items_LS);
        renderAllArtistCards();
    }
});

addNewItemButton.addEventListener("click", clearItemInputs);

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    renderAllArtistCards();
});
