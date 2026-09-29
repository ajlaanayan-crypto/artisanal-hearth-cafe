/* ==========================================================================
   Artisanal Hearth Cafe - SPA Interactive Global Router and Controller
   ========================================================================== */

// Cart State Management
let cart = [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Cart Drawer, Navigation Overlay, Toast, and Dialogs
    injectCartAndNavHTML();

    // 2. Load Cart from LocalStorage
    loadCart();

    // 3. Setup Navigation & Actions
    setupEventHandlers();

    // 4. Bind Menu Category Filter and Search (SPA-specific)
    setupMenuFilters();

    // 5. Bind Reservation form handler (SPA-specific)
    setupReservationForm();

    // 6. Run router to show correct view based on starting URL hash
    handleRouting();

    // 7. Update Badge Counters
    updateCartCount();
});

// Hash routing mechanism
window.addEventListener('hashchange', handleRouting);

/* ==========================================================================
   SPA Router
   ========================================================================== */
function handleRouting() {
    const hash = window.location.hash || '#home';
    
    const views = {
        '#home': 'home-view',
        '#menu': 'menu-view',
        '#story': 'story-view',
        '#contact': 'contact-view'
    };

    // Make sure we have a valid hash, fallback to home
    const activeViewId = views[hash] || 'home-view';

    // Hide all view-sections, show current active one
    Object.keys(views).forEach(key => {
        const el = document.getElementById(views[key]);
        if (el) {
            if (views[key] === activeViewId) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });

    // Update Desktop link active styles
    const desktopLinks = document.querySelectorAll('header nav a');
    desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === hash || (hash === '#home' && href === '#') || (hash === '#home' && href === 'index.html')) {
            link.className = "text-[#33210d] font-bold font-label-md text-label-md pb-1 border-b-2 border-[#33210d]";
        } else {
            link.className = "text-on-surface-variant hover:text-primary-container transition-colors duration-300 font-label-md text-label-md pb-1 border-b-2 border-transparent hover:border-primary-container/30";
        }
    });

    // Update Mobile link active styles
    const mobileLinks = document.querySelectorAll('nav.md\\:hidden a');
    mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        const icon = link.querySelector('.material-symbols-outlined');
        if (href === hash) {
            link.className = "flex flex-col items-center justify-center bg-[#33210d] text-white rounded-full px-5 py-1.5 flex-1 max-w-[80px] soft-transition";
            if (icon) icon.style.fontVariationSettings = "'FILL' 1";
        } else {
            link.className = "flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all duration-300 rounded-full px-2 py-1 flex-1 max-w-[80px]";
            if (icon) icon.style.fontVariationSettings = "'FILL' 0";
        }
    });

    // Scroll window back to top on route change
    window.scrollTo(0, 0);
}

/* ==========================================================================
   HTML Injection (Cart Drawer & Navigation Overlay)
   ========================================================================== */
function injectCartAndNavHTML() {
    // Inject Cart Drawer if not present
    if (!document.getElementById('cart-drawer-container')) {
        const cartContainer = document.createElement('div');
        cartContainer.id = 'cart-drawer-container';
        cartContainer.innerHTML = `
            <!-- Backdrop Overlay -->
            <div id="cart-overlay" class="cart-overlay fixed inset-0 bg-[#33210d]/40 backdrop-blur-[2px] z-50 hidden"></div>
            
            <!-- Sliding Drawer -->
            <div id="cart-drawer" class="cart-drawer fixed right-0 top-0 h-full w-full sm:w-[440px] bg-[#fbf9f4] z-50 flex flex-col p-6 border-l border-[#d2c4ba]/30">
                <!-- Header -->
                <div class="flex justify-between items-center pb-4 border-b border-[#d2c4ba]/30">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[#6b5c4a]">shopping_bag</span>
                        <h3 class="font-headline-md text-headline-md text-[#33210d] font-semibold">Your Order Bag</h3>
                    </div>
                    <button id="close-cart-btn" class="w-8 h-8 rounded-full flex items-center justify-center text-[#4e453d] hover:bg-[#f0eee9] hover:text-[#33210d] soft-transition">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Items List (Scrollable) -->
                <div id="cart-items-list" class="flex-grow overflow-y-auto py-4 divide-y divide-[#d2c4ba]/10">
                    <!-- Dynamic Cart Items Rendered Here -->
                </div>

                <!-- Footer Summary -->
                <div class="border-t border-[#d2c4ba]/30 pt-4 mt-auto space-y-4">
                    <div class="space-y-2 font-body-md">
                        <div class="flex justify-between text-sm text-[#4e453d]">
                            <span>Items Subtotal</span>
                            <span id="cart-subtotal">$0.00</span>
                        </div>
                        <div class="flex justify-between text-sm text-[#4e453d]">
                            <span>Estimated Tax (8%)</span>
                            <span id="cart-tax">$0.00</span>
                        </div>
                        <div class="flex justify-between font-label-md text-base text-[#33210d] font-bold pt-2 border-t border-[#d2c4ba]/10">
                            <span>Total Amount</span>
                            <span id="cart-total">$0.00</span>
                        </div>
                    </div>

                    <button id="checkout-btn" class="w-full bg-[#33210d] text-white font-label-md text-label-md py-3 rounded-lg hover:bg-[#4b3621] soft-transition shadow-md flex items-center justify-center gap-2">
                        <span>Place Checkout Order</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(cartContainer);
    }

    // Inject Navigation Menu Overlay if not present
    if (!document.getElementById('nav-overlay-container')) {
        const navContainer = document.createElement('div');
        navContainer.id = 'nav-overlay-container';
        navContainer.innerHTML = `
            <div id="nav-overlay" class="nav-overlay fixed inset-0 bg-[#fbf9f4] z-50 flex flex-col justify-between p-6">
                <!-- Close Button -->
                <header class="w-full flex justify-end py-4 px-4">
                    <button id="close-nav-btn" class="text-[#33210d] hover:text-[#4b3621] p-2 rounded-full hover:bg-[#eae8e3]/50 soft-transition">
                        <span class="material-symbols-outlined text-[32px] font-light">close</span>
                    </button>
                </header>

                <!-- Navigation Links -->
                <main class="flex-grow flex flex-col justify-center items-center">
                    <nav class="w-full max-w-xs flex flex-col gap-6 text-center">
                        <a href="#home" class="nav-overlay-link text-[#33210d] font-headline-md text-headline-md fade-in-up delay-75 hover:text-[#6b5c4a] soft-transition">Home</a>
                        <div class="h-px w-full bg-[#d2c4ba]/20 fade-in-up delay-75"></div>
                        
                        <a href="#menu" class="nav-overlay-link text-[#33210d] font-headline-md text-headline-md fade-in-up delay-150 hover:text-[#6b5c4a] soft-transition">Menu</a>
                        <div class="h-px w-full bg-[#d2c4ba]/20 fade-in-up delay-150"></div>
                        
                        <a href="#story" class="nav-overlay-link text-[#33210d] font-headline-md text-headline-md fade-in-up delay-225 hover:text-[#6b5c4a] soft-transition">Our Story</a>
                        <div class="h-px w-full bg-[#d2c4ba]/20 fade-in-up delay-225"></div>
                        
                        <a href="#contact" class="nav-overlay-link text-[#33210d] font-headline-md text-headline-md fade-in-up delay-300 hover:text-[#6b5c4a] soft-transition">Contact</a>
                    </nav>
                </main>

                <!-- Socials & Address -->
                <footer class="w-full pb-8 flex flex-col items-center gap-6 z-10 fade-in-up delay-375">
                    <div class="flex flex-col items-center gap-2">
                        <span class="text-[#6b5c4a] font-label-md text-xs uppercase tracking-widest">Follow Our Journey</span>
                        <div class="flex gap-6 text-[#33210d]">
                            <a href="#" class="hover:text-[#6b5c4a] soft-transition">Instagram</a>
                            <a href="#" class="hover:text-[#6b5c4a] soft-transition">Pinterest</a>
                        </div>
                    </div>
                    <p class="text-[#6b5c4a] font-body-md text-sm text-center">123 Hearth Way, Urban Center</p>
                </footer>
            </div>
        `;
        document.body.appendChild(navContainer);
    }

    // Inject Toast Notification Elements
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(toastContainer);
    }

    // Inject Global Checkout Success Dialog Modal
    if (!document.getElementById('modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.innerHTML = `
            <div id="checkout-modal" class="fixed inset-0 bg-[#33210d]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 hidden opacity-0 transition-opacity duration-300">
                <div class="bg-[#fbf9f4] w-full max-w-md rounded-xl p-8 border border-[#d2c4ba]/30 ambient-shadow-lg text-center transform scale-95 transition-transform duration-300">
                    <div class="w-16 h-16 bg-[#323f09]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#9bab6a]">
                        <span class="material-symbols-outlined text-[36px] font-bold">check_circle</span>
                    </div>
                    <h3 class="font-headline-md text-headline-md text-[#33210d] mb-2">Order Confirmed</h3>
                    <p class="font-body-md text-[#4e453d] mb-6">Thank you for roasting with us! Your artisanal treats will be freshly prepared. Present your Order ID at the counter.</p>
                    <div class="bg-[#f5f3ee] p-4 rounded-lg border border-[#d2c4ba]/20 mb-6 font-mono text-sm text-[#33210d] select-all">
                        ORDER ID: <span id="checkout-order-id" class="font-bold">AH-23849-B</span>
                    </div>
                    <button id="close-modal-btn" class="w-full bg-[#33210d] text-white font-label-md py-3 rounded-lg hover:bg-[#4b3621] soft-transition">
                        Back to Shop
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);
    }
}

/* ==========================================================================
   Event Bindings
   ========================================================================== */
function setupEventHandlers() {
    // Cart Slide Toggles
    const cartToggles = document.querySelectorAll('.cart-toggle');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    cartToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCartDrawer(true);
        });
    });

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
    }

    // Navigation Overlay Toggles
    const menuToggles = document.querySelectorAll('.mobile-menu-toggle');
    const closeNavBtn = document.getElementById('close-nav-btn');
    const navOverlay = document.getElementById('nav-overlay');

    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleNavOverlay(true);
        });
    });

    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', () => toggleNavOverlay(false));
    }

    // Close on overlay link clicks
    const overlayLinks = document.querySelectorAll('.nav-overlay-link');
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => toggleNavOverlay(false));
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', performCheckout);
    }

    // Close checkout success modal
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCheckoutModal);
    }
}

/* ==========================================================================
   Navigation Overlay Logic
   ========================================================================== */
function toggleNavOverlay(isOpen) {
    const navOverlay = document.getElementById('nav-overlay');
    if (!navOverlay) return;

    if (isOpen) {
        navOverlay.classList.remove('hidden');
        // Trigger reflow for transition
        void navOverlay.offsetHeight;
        navOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    } else {
        navOverlay.classList.remove('open');
        setTimeout(() => {
            navOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Unlock scrolling
        }, 450);
    }
}

/* ==========================================================================
   Shopping Cart State Operations
   ========================================================================== */
function toggleCartDrawer(isOpen) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;

    if (isOpen) {
        overlay.classList.remove('hidden');
        // Trigger reflow
        void overlay.offsetHeight;
        overlay.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
        renderCart();
    } else {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
        setTimeout(() => {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 450);
    }
}

function loadCart() {
    const savedCart = localStorage.getItem('ah_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem('ah_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update badge counter inside shopping bag triggers
    const bagButtons = document.querySelectorAll('.cart-toggle');
    bagButtons.forEach(btn => {
        let badge = btn.querySelector('.cart-badge');
        if (totalCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge absolute -top-1.5 -right-1.5 bg-[#1e2800] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans border-2 border-[#fbf9f4]';
                btn.style.position = 'relative';
                btn.appendChild(badge);
            }
            badge.textContent = totalCount;
        } else if (badge) {
            badge.remove();
        }
    });
}

window.addToCart = function(item) {
    const existingItem = cart.find(x => x.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image: item.image || '',
            quantity: 1
        });
    }
    saveCart();
    showToast(`${item.name} added to your bag`);
    
    // Automatically reveal cart drawer to show progress
    setTimeout(() => {
        toggleCartDrawer(true);
    }, 300);
};

function changeQuantity(id, amount) {
    const item = cart.find(x => x.id === id);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(x => x.id !== id);
    }
    saveCart();
    renderCart();
}

function removeCartItem(id) {
    cart = cart.filter(x => x.id !== id);
    saveCart();
    renderCart();
}

/* ==========================================================================
   Cart Rendering
   ========================================================================== */
function renderCart() {
    const listEl = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!listEl) return;

    if (cart.length === 0) {
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-center px-4">
                <span class="material-symbols-outlined text-[48px] text-[#80756c] mb-2 opacity-50">shopping_bag</span>
                <p class="font-headline-md text-base text-[#33210d]">Your bag is empty</p>
                <p class="font-body-md text-xs text-[#4e453d] mt-1 max-w-[200px]">Add some artisan coffee or freshly baked treats to get started.</p>
            </div>
        `;
        subtotalEl.textContent = '$0.00';
        taxEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotal = 0;
    listEl.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'py-4 flex gap-4 items-center group';
        row.innerHTML = `
            <!-- Product Thumbnail -->
            <div class="w-16 h-16 rounded-lg bg-[#f0eee9] overflow-hidden flex-shrink-0 relative border border-[#d2c4ba]/20">
                ${item.image ? `<img src="${item.image}" class="w-full h-full object-cover">` : `<span class="material-symbols-outlined text-xl text-[#80756c] absolute inset-0 m-auto flex items-center justify-center">local_cafe</span>`}
            </div>
            
            <!-- Details -->
            <div class="flex-grow min-w-0">
                <div class="flex justify-between items-start gap-2">
                    <h4 class="font-label-md text-sm text-[#33210d] font-semibold truncate pr-4">${item.name}</h4>
                    <span class="font-label-md text-sm text-[#33210d] font-semibold">$${itemTotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <!-- Quantity adjustments -->
                    <div class="flex items-center border border-[#d2c4ba]/50 rounded-full bg-[#fbf9f4]">
                        <button onclick="adjustQty('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-[#6b5c4a] hover:text-[#33210d] soft-transition">
                            <span class="material-symbols-outlined text-base">remove</span>
                        </button>
                        <span class="font-mono text-xs w-6 text-center text-[#33210d]">${item.quantity}</span>
                        <button onclick="adjustQty('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-[#6b5c4a] hover:text-[#33210d] soft-transition">
                            <span class="material-symbols-outlined text-base">add</span>
                        </button>
                    </div>
                    
                    <!-- Remove button -->
                    <button onclick="deleteItem('${item.id}')" class="text-xs text-[#80756c] hover:text-[#ba1a1a] flex items-center gap-0.5 soft-transition">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
        `;
        listEl.appendChild(row);
    });

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

window.adjustQty = function(id, change) {
    changeQuantity(id, change);
};

window.deleteItem = function(id) {
    removeCartItem(id);
};

/* ==========================================================================
   Checkout Simulation
   ========================================================================== */
function performCheckout() {
    if (cart.length === 0) return;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `AH-${randomSuffix}-B`;

    toggleCartDrawer(false);

    setTimeout(() => {
        const orderIdEl = document.getElementById('checkout-order-id');
        const modal = document.getElementById('checkout-modal');
        if (orderIdEl) orderIdEl.textContent = orderId;
        if (modal) {
            modal.classList.remove('hidden');
            void modal.offsetHeight;
            modal.classList.add('opacity-100');
            const inner = modal.querySelector('div');
            if (inner) inner.classList.remove('scale-95');
        }
        
        cart = [];
        saveCart();
    }, 450);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    const inner = modal.querySelector('div');
    if (inner) inner.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'bg-[#33210d] text-white font-label-md text-xs py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 opacity-0 transition-all duration-300';
    toast.innerHTML = `
        <span class="material-symbols-outlined text-[16px] text-[#9bab6a]">check</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    void toast.offsetHeight;
    toast.classList.remove('translate-y-4', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-[-8px]', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}

/* ==========================================================================
   Menu Category Filters (SPA Unified)
   ========================================================================== */
function setupMenuFilters() {
    const searchInput = document.getElementById('menu-search');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const sections = document.querySelectorAll('.menu-section');
    const promoCard = document.getElementById('promo-card');

    function filterMenu() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        const activeTab = document.querySelector('.filter-tab.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-filter') : 'all';

        sections.forEach(section => {
            const secCategory = section.getAttribute('data-sec-category');
            let hasVisibleItems = false;

            const items = section.querySelectorAll('.menu-item-row');
            items.forEach(item => {
                const itemName = item.getAttribute('data-name').toLowerCase();
                const itemDesc = item.getAttribute('data-desc').toLowerCase();
                
                const matchesSearch = itemName.includes(query) || itemDesc.includes(query);
                const matchesCategory = (activeCategory === 'all') || (secCategory === activeCategory);

                if (matchesSearch && matchesCategory) {
                    item.classList.remove('hidden');
                    hasVisibleItems = true;
                } else {
                    item.classList.add('hidden');
                }
            });

            if (hasVisibleItems) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        if (promoCard) {
            if (activeCategory === 'all' || activeCategory === 'coffee') {
                promoCard.classList.remove('hidden');
            } else {
                promoCard.classList.add('hidden');
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterMenu);
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => {
                t.classList.remove('active', 'bg-[#33210d]', 'text-white');
                t.classList.add('bg-[#f5f3ee]', 'text-[#6b5c4a]');
            });
            tab.classList.add('active', 'bg-[#33210d]', 'text-white');
            tab.classList.remove('bg-[#f5f3ee]', 'text-[#6b5c4a]');
            filterMenu();
        });
    });
}

/* ==========================================================================
   Reservation Form Validation & Modal (SPA Unified)
   ========================================================================== */
function setupReservationForm() {
    const form = document.querySelector('#contact-view form');
    const submitBtn = document.getElementById('res-submit-btn');
    
    const dateInput = document.getElementById('res-date');
    const timeInput = document.getElementById('res-time');
    const partyInput = document.getElementById('res-party');
    const nameInput = document.getElementById('res-name');
    const emailInput = document.getElementById('res-email');
    const requestsInput = document.getElementById('res-requests');

    const resModal = document.getElementById('reservation-modal');
    const closeResModalBtn = document.getElementById('close-res-modal-btn');

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            let isValid = true;
            
            const fields = [
                { el: dateInput, name: 'Date' },
                { el: nameInput, name: 'Name' },
                { el: emailInput, name: 'Email', isEmail: true }
            ];

            fields.forEach(field => {
                if (!field.el || !field.el.value.trim()) {
                    if (field.el) field.el.classList.add('border-[#ba1a1a]', 'ring-1', 'ring-[#ba1a1a]');
                    isValid = false;
                } else if (field.isEmail && !validateEmail(field.el.value)) {
                    if (field.el) field.el.classList.add('border-[#ba1a1a]', 'ring-1', 'ring-[#ba1a1a]');
                    isValid = false;
                } else {
                    if (field.el) field.el.classList.remove('border-[#ba1a1a]', 'ring-1', 'ring-[#ba1a1a]');
                }
            });

            if (!isValid) return;

            const resData = {
                id: 'RES-' + Math.floor(100 + Math.random() * 900) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                date: dateInput.value,
                time: timeInput.value,
                party: partyInput.value,
                name: nameInput.value,
                email: emailInput.value,
                requests: requestsInput.value
            };

            let currentResList = JSON.parse(localStorage.getItem('ah_reservations') || '[]');
            currentResList.push(resData);
            localStorage.setItem('ah_reservations', JSON.stringify(currentResList));

            document.getElementById('res-confirm-id').textContent = resData.id;
            document.getElementById('res-confirm-name').textContent = resData.name;
            document.getElementById('res-confirm-date-time').textContent = `${formatDate(resData.date)} - ${resData.time}`;
            document.getElementById('res-confirm-party').textContent = resData.party;

            if (resModal) {
                resModal.classList.remove('hidden');
                void resModal.offsetHeight;
                resModal.classList.add('opacity-100');
                const inner = resModal.querySelector('div');
                if (inner) inner.classList.remove('scale-95');
            }

            if (form) form.reset();
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
        });
    }

    if (closeResModalBtn) {
        closeResModalBtn.addEventListener('click', () => {
            if (resModal) {
                resModal.classList.remove('opacity-100');
                const inner = resModal.querySelector('div');
                if (inner) inner.classList.add('scale-95');
                setTimeout(() => {
                    resModal.classList.add('hidden');
                }, 300);
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const parts = dateStr.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-US', options);
}
