document.addEventListener("DOMContentLoaded", () => {
  const productListEl = document.getElementById("product-list");
  const featuredListEl = document.getElementById("featured-list");
  const bestsellersListEl = document.getElementById("bestsellers-list");
  const newArrivalsListEl = document.getElementById("newarrivals-list");
  const categoriesContainer = document.getElementById("categories-container");
  const cartButton = document.getElementById("cart-button");
  const cartPanel = document.getElementById("cart-panel");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsEl = document.getElementById("cart-items");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-button");
  const filtersCategoriesEl = document.getElementById("filters-categories");
  const filtersTagsEl = document.getElementById("filters-tags");
  const productSkeletons = document.getElementById("product-skeletons");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const viewGridBtn = document.getElementById("view-grid");
  const viewListBtn = document.getElementById("view-list");
  const resetFiltersBtn = document.getElementById("reset-filters");
  const tagsToggleBtn = document.getElementById("tags-toggle");
  const activeFiltersLabel = document.getElementById("active-filters");
  const loadMoreBtn = document.getElementById("load-more-button");
  const mobileSearchOverlay = document.getElementById("mobile-search-overlay");
  const mobileSearchInput = document.getElementById("mobile-search-input");
  const mobileSearchClose = document.getElementById("mobile-search-close");
  const mobileSearchToggle = document.getElementById("mobile-search-toggle");
  const quickViewModal = document.getElementById("quick-view-modal");
  const quickViewContent = document.getElementById("quick-view-content");
  const quickViewClose = document.getElementById("quick-view-close");
  const newsletterForm = document.getElementById("newsletter-form");

  const API_PRODUCTS = "/api/products";
  const API_CHECKOUT = "/api/checkout";

  let cart = JSON.parse(sessionStorage.getItem("cart_v1") || "{}");
  let allProducts = [];
  let filteredProducts = [];
  let viewMode = "grid";
  let tagsExpanded = false;
  let pageSize = 12;
  let currentPage = 1;

  let activeCategory = null;
  let activeTag = null;
  let searchQuery = "";
  let currentSort = "new";

  function saveCart() {
    sessionStorage.setItem("cart_v1", JSON.stringify(cart));
    renderCart();
  }

  function formatPrice(p) {
    return Number(p).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function tryParseJSON(val) {
    try {
      const parsed = typeof val === "string" ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function showLoading(show) {
    productSkeletons.style.display = show ? "grid" : "none";
    productListEl.style.display = show ? "none" : "grid";
  }

  function createProductCardElement(p) {
    const article = document.createElement("article");
    article.className = "card product-card product-item";
    article.setAttribute("data-id", p.id);
    article.setAttribute("aria-labelledby", `product-title-${p.id}`);

    const tagsArr = tryParseJSON(p.tags);
    const imgSrc =
      p.image?.trim() || "https://via.placeholder.com/600x400?text=Product";

    const figure = document.createElement("figure");
    figure.className = "image-wrapper";
    const img = document.createElement("img");
    img.src = encodeURI(imgSrc);
    img.alt = p.name || "Product image";
    img.className = "product-image";
    img.width = 400;
    img.height = 320;

    const quickViewBtn = document.createElement("button");
    quickViewBtn.className = "quick-view-btn";
    quickViewBtn.setAttribute("aria-label", `Quick view ${p.name}`);
    quickViewBtn.innerHTML = `<i class="fa-solid fa-eye" aria-hidden="true"></i>`;
    quickViewBtn.onclick = () => openQuickView(p);

    figure.append(img, quickViewBtn);

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";

    const header = document.createElement("header");
    header.className = "product-header";
    const title = document.createElement("h3");
    title.id = `product-title-${p.id}`;
    title.className = "product-title";
    title.textContent = p.name;
    const desc = document.createElement("p");
    desc.className = "product-desc text-sm text-gray-600";
    desc.textContent = p.description || "";
    header.append(title, desc);

    const metaDiv = document.createElement("div");
    metaDiv.className = "product-meta";
    const priceEl = document.createElement("div");
    priceEl.className = "price";
    priceEl.textContent = `$${formatPrice(p.price)}`;
    metaDiv.appendChild(priceEl);

    const footer = document.createElement("footer");
    footer.className = "product-actions";
    const addToCartBtn = document.createElement("button");
    addToCartBtn.className = "add-to-cart";
    addToCartBtn.innerHTML = `<i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to Cart`;
    addToCartBtn.onclick = () => {
      if (!cart[p.id]) cart[p.id] = { product: p, qty: 0 };
      cart[p.id].qty += 1;
      saveCart();

      flyToCartAnimation(addToCartBtn);
    };
    footer.appendChild(addToCartBtn);

    infoDiv.append(header, metaDiv, footer);
    article.append(figure, infoDiv);

    return article;
  }

  function renderGrid(container, products) {
    container.innerHTML = "";
    products.forEach((p) => {
      const cardEl = createProductCardElement(p);
      container.appendChild(cardEl);
    });
  }

  function renderProductPage(products) {
    const start = 0;
    const end = currentPage * pageSize;
    const pageItems = products.slice(start, end);

    productListEl.innerHTML = "";
    pageItems.forEach((p) => {
      const cardEl = createProductCardElement(p);
      productListEl.appendChild(cardEl);
    });

    loadMoreBtn.style.display = products.length > end ? "block" : "none";
  }

  function renderCart() {
    const items = Object.values(cart);
    let total = 0;
    let itemCount = 0;
    cartItemsEl.innerHTML = "";

    if (items.length === 0) {
      cartItemsEl.innerHTML = `<div class="p-6 text-center text-gray-500">Your cart is empty.</div>`;
    } else {
      items.forEach(({ product, qty }) => {
        const lineTotal = product.price * qty;
        total += lineTotal;
        itemCount += qty;

        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div>
            <div class="font-medium">${product.name}</div>
            <div class="text-sm text-gray-500">$${formatPrice(
              product.price
            )} x ${qty}</div>
          </div>
          <div class="flex items-center gap-2">
            <button class="qty-decrease text-gray-500 px-2" data-id="${
              product.id
            }">-</button>
            <span>${qty}</span>
            <button class="qty-increase text-gray-500 px-2" data-id="${
              product.id
            }">+</button>
            <button class="text-sm text-red-500 remove-item" data-id="${
              product.id
            }"><i class="fa-solid fa-trash"></i></button>
          </div>
        `;
        cartItemsEl.appendChild(row);
      });
    }

    cartItemsEl
      .querySelectorAll(".qty-decrease")
      .forEach((b) => (b.onclick = () => updateCartQuantity(b.dataset.id, -1)));
    cartItemsEl
      .querySelectorAll(".qty-increase")
      .forEach((b) => (b.onclick = () => updateCartQuantity(b.dataset.id, 1)));
    cartItemsEl
      .querySelectorAll(".remove-item")
      .forEach((b) => (b.onclick = () => updateCartQuantity(b.dataset.id, 0)));

    cartCountEl.textContent = String(itemCount);
    cartTotalEl.textContent = `$${formatPrice(total)}`;
  }

  function updateCartQuantity(id, change) {
    if (!cart[id]) return;
    if (change === 0) {
      delete cart[id];
    } else {
      cart[id].qty += change;
      if (cart[id].qty <= 0) delete cart[id];
    }
    saveCart();
  }

  function renderFilters(products) {
    const categories = [
      ...new Set(products.map((p) => p.category || "Others")),
    ];
    const categoryCounts = products.reduce((acc, p) => {
      const cat = p.category || "Others";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    filtersCategoriesEl.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = `filter-pill ${!activeCategory ? "active" : ""}`;
    allBtn.innerHTML = `All <span class="filter-count">${products.length}</span>`;
    allBtn.onclick = () => {
      activeCategory = null;
      updateProductView();
    };
    filtersCategoriesEl.appendChild(allBtn);

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = `filter-pill ${activeCategory === cat ? "active" : ""}`;
      btn.innerHTML = `<span>${cat}</span><span class="filter-count">${categoryCounts[cat]}</span>`;
      btn.onclick = () => {
        activeCategory = activeCategory === cat ? null : cat;
        updateProductView();
      };
      filtersCategoriesEl.appendChild(btn);
    });

    activeFiltersLabel.textContent = activeCategory || "All";
  }

  function updateProductView() {
    currentPage = 1;
    let result = [...allProducts];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.tags?.toLowerCase().includes(lowerQuery)
      );
    }

    if (activeCategory) {
      result = result.filter(
        (p) => (p.category || "Others") === activeCategory
      );
    }

    switch (currentSort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        break;
    }

    filteredProducts = result;
    renderProductPage(filteredProducts);
    renderFilters(allProducts);
  }

  function openCart() {
    cartPanel.classList.remove("translate-x-full");
    cartPanel.classList.add("translate-x-0");
  }

  function closeCart() {
    cartPanel.classList.add("translate-x-full");
    cartPanel.classList.remove("translate-x-0");
  }

  function openQuickView(product) {
    quickViewContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <img src="${encodeURI(
          product.image?.trim() || "https://via.placeholder.com/600x400"
        )}" alt="${product.name}" class="w-full h-auto rounded-lg shadow-md">
        <div>
          <h3 class="text-2xl font-bold mb-2">${product.name}</h3>
          <p class="text-gray-600 mb-4">${
            product.description || "No description available."
          }</p>
          <div class="text-3xl font-bold text-indigo-600 mb-4">$${formatPrice(
            product.price
          )}</div>
          <button class="add-to-cart-modal w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Add to Cart</button>
        </div>
      </div>
    `;

    quickViewContent.querySelector(".add-to-cart-modal").onclick = () => {
      if (!cart[product.id]) cart[product.id] = { product, qty: 0 };
      cart[product.id].qty += 1;
      saveCart();
      closeQuickView();
    };
    quickViewModal.classList.add("open");
  }

  function closeQuickView() {
    quickViewModal.classList.remove("open");
  }

  function flyToCartAnimation(target) {
    const cardImg = target.closest(".product-card").querySelector("img");
    if (!cardImg) return;

    const clone = cardImg.cloneNode(true);
    clone.className = "cart-fly";
    const rect = cardImg.getBoundingClientRect();
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    document.body.appendChild(clone);

    const cartBtnRect = cartButton.getBoundingClientRect();
    requestAnimationFrame(() => {
      clone.style.transform = `translate(${
        cartBtnRect.left - rect.left + 10
      }px, ${cartBtnRect.top - rect.top + 10}px) scale(0.1)`;
      clone.style.opacity = "0.5";
    });
    setTimeout(() => clone.remove(), 800);
  }

  // --- EVENT HANDLERS ---

  const debouncedSearch = debounce((query) => {
    searchQuery = query;
    updateProductView();
  }, 350);

  searchInput.addEventListener("input", (e) => debouncedSearch(e.target.value));
  mobileSearchInput.addEventListener("input", (e) =>
    debouncedSearch(e.target.value)
  );

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    updateProductView();
  });

  loadMoreBtn.addEventListener("click", () => {
    currentPage += 1;
    renderProductPage(filteredProducts);
  });

  resetFiltersBtn.addEventListener("click", () => {
    activeCategory = null;
    activeTag = null;
    searchQuery = "";
    currentSort = "new";
    searchInput.value = "";
    sortSelect.value = "new";
    updateProductView();
  });

  // Cart panel events
  cartButton.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);

  // Modal events
  mobileSearchToggle.addEventListener("click", () =>
    mobileSearchOverlay.classList.add("open")
  );
  mobileSearchClose.addEventListener("click", () =>
    mobileSearchOverlay.classList.remove("open")
  );
  quickViewClose.addEventListener("click", closeQuickView);

  // Checkout
  checkoutBtn.addEventListener("click", async () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert("Proceeding to checkout (stub). Implement server-side logic here.");
    cart = {};
    saveCart();
    closeCart();
  });

  // Newsletter
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
      alert(`Thank you for subscribing, ${email}! (This is a demo).`);
      newsletterForm.reset();
    }
  });

  // --- INITIALIZATION ---

  async function init() {
    try {
      showLoading(true);
      const res = await fetch(API_PRODUCTS);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      allProducts = (Array.isArray(data) ? data : data.products) || [];
      allProducts.forEach((p) => (p.price = Number(p.price || 0)));

      // Initial Render
      updateProductView();

      // Render other sections
      const featured = allProducts.filter((p) => p.is_featured).slice(0, 8);
      const bestsellers = [...allProducts]
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 4);
      const newArrivals = [...allProducts]
        .sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        )
        .slice(0, 4);

      if (featured.length) renderGrid(featuredListEl, featured);
      if (bestsellers.length) renderGrid(bestsellersListEl, bestsellers);
      if (newArrivals.length) renderGrid(newArrivalsListEl, newArrivals);

      renderCart();
    } catch (err) {
      console.error("Failed to load products:", err);
      productListEl.innerHTML = `<div class="col-span-full text-center text-red-500 p-8">Failed to load products. Please try again later.</div>`;
    } finally {
      showLoading(false);
    }
  }

  init();
});
