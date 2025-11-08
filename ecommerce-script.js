// Shopping Cart
let cart = [];
let cartTotal = 0;

// DOM Elements
const cartModal = document.getElementById('cart-modal');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.close-cart');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    enhanceProductImages();
});

function initializeApp() {
    // Cart functionality
    setupCart();
    
    // Product filtering
    setupProductFiltering();
    
    // Search functionality
    setupSearch();
    
    // Newsletter form
    setupNewsletter();
    
    // Smooth scrolling
    setupSmoothScrolling();
    
    // Animations
    setupAnimations();
    
    // Loading animation
    document.body.classList.add('loaded');
}

// Cart Functions
function setupCart() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            addToCart(productName, productPrice);
            // Open cart and focus delivery form for convenience
            cartModal.classList.add('active');
            const firstNameInput = document.getElementById('first-name');
            if (firstNameInput) firstNameInput.focus();
        });
    });

    // Cart icon click
    cartIcon.addEventListener('click', function() {
        cartModal.classList.add('active');
        updateCartDisplay();
    });

    // Close cart modal
    closeCartBtn.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

    // Close cart when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
}

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${productName} savatga qo'shildi!`, 'success');
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Savat bo\'sh</p>';
        cartTotalElement.textContent = formatUZS(0);
        return;
    }
    
    cartTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Miqdor: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">${formatUZS(itemTotal)} so'm</div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')">O'chirish</button>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = `${formatUZS(cartTotal)}`;
}

// Product Filtering
function setupProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    const productCards = () => document.querySelectorAll('.product-card');
    const productsSection = document.querySelector('#products');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let debounceTimer;

    // Create or get no-results message node
    let noResultsNode = document.querySelector('#no-results');
    if (!noResultsNode) {
        noResultsNode = document.createElement('div');
        noResultsNode.id = 'no-results';
        noResultsNode.style.cssText = 'text-align:center;color:#6b7280;padding:1.5rem;display:none;';
        const grid = document.querySelector('.products-grid');
        grid.parentNode.insertBefore(noResultsNode, grid.nextSibling);
    }

    const normalize = (t) => (t || '').toString().toLowerCase().trim();

    const clearHighlights = (card) => {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('.product-description');
        if (titleEl && titleEl.dataset.originalText) titleEl.innerHTML = titleEl.dataset.originalText;
        if (descEl && descEl.dataset.originalText) descEl.innerHTML = descEl.dataset.originalText;
    };

    const highlight = (el, term) => {
        if (!el) return;
        if (!el.dataset.originalText) el.dataset.originalText = el.innerHTML;
        const raw = el.textContent;
        const idx = raw.toLowerCase().indexOf(term);
        if (term && idx !== -1) {
            const before = raw.slice(0, idx);
            const match = raw.slice(idx, idx + term.length);
            const after = raw.slice(idx + term.length);
            el.innerHTML = `${before}<mark style="background:#fde68a;color:inherit;padding:0 2px;border-radius:3px;">${match}</mark>${after}`;
        } else if (!term && el.dataset.originalText) {
            el.innerHTML = el.dataset.originalText;
        }
    };

    const runSearch = (term) => {
        const cards = productCards();
        let visibleCount = 0;

        // When typing, deactivate category filter and show all to search across
        if (term) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
        }

        cards.forEach(card => {
            clearHighlights(card);
            const titleEl = card.querySelector('h3');
            const descEl = card.querySelector('.product-description');
            const name = normalize(titleEl ? titleEl.textContent : '');
            const desc = normalize(descEl ? descEl.textContent : '');

            const match = !term || name.includes(term) || desc.includes(term);
            card.style.display = match ? 'block' : 'none';

            if (match && term) {
                highlight(titleEl, term);
                highlight(descEl, term);
            }

            if (match) visibleCount++;
        });

        noResultsNode.textContent = visibleCount === 0 ? 'Mos mahsulot topilmadi.' : '';
        noResultsNode.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    searchInput.addEventListener('input', function() {
        const term = normalize(this.value);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => runSearch(term), 200);
    });

    // Press Enter to jump to products
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const term = normalize(this.value);
            runSearch(term);
            if (productsSection) {
                const offsetTop = productsSection.offsetTop - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }
    });
}

// Newsletter Form
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (isValidEmail(email)) {
            showNotification('Obuna muvaffaqiyatli amalga oshirildi!', 'success');
            this.reset();
        } else {
            showNotification('Iltimos, to\'g\'ri email manzil kiriting!', 'error');
        }
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .feature-card');
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Product hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Category card hover effects
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.querySelector('h3').textContent.toLowerCase();
        const sanitize = (s) => s.toLowerCase().replace(/[\s'"’`-]/g, '');
        
        // Filter products by category
        const filterButtons = document.querySelectorAll('.filter-btn');
        const targetButton = Array.from(filterButtons).find(btn => 
            sanitize(btn.getAttribute('data-filter') || '') === sanitize(category)
        );
        
        if (targetButton) {
            targetButton.click();
        }
        
        // Scroll to products section
        document.querySelector('#products').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Checkout functionality
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('Savat bo\'sh!', 'error');
        return;
    }
    // Validate delivery form
    const firstName = (document.getElementById('first-name')?.value || '').trim();
    const lastName = (document.getElementById('last-name')?.value || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const region = (document.getElementById('region')?.value || '').trim();
    const address = (document.getElementById('address')?.value || '').trim();
    const deliveryType = (document.getElementById('delivery-type')?.value || 'standard');
    const paymentMethod = (document.getElementById('payment-method')?.value || 'card');

    const phoneDigits = phone.replace(/\D/g, '');
    if (!firstName || !lastName || !phone || !region || !address) {
        showNotification('Iltimos, yetkazib berish ma\'lumotlarini to\'ldiring.', 'error');
        return;
    }
    if (phoneDigits.length < 9) {
        showNotification('Telefon raqamini to\'g\'ri kiriting.', 'error');
        return;
    }

    // Simulate checkout process with summary
    const itemsSummary = cart.map(i => `${i.name} x${i.quantity}`).join(', ');
    showNotification(`Buyurtma qabul qilindi! ${firstName} ${lastName}, ${formatUZS(cartTotal)} so'm. Mahsulotlar: ${itemsSummary}`, 'success');

    // Optionally persist order data locally
    try {
        const order = {
            items: cart,
            total: cartTotal,
            customer: { firstName, lastName, phone, region, address },
            deliveryType,
            paymentMethod,
            createdAt: new Date().toISOString()
        };
        const history = JSON.parse(localStorage.getItem('orders') || '[]');
        history.push(order);
        localStorage.setItem('orders', JSON.stringify(history));
    } catch (e) {}

    // Clear cart
    cart = [];
    updateCartCount();
    updateCartDisplay();

    // Close modal after a short delay
    setTimeout(() => cartModal.classList.remove('active'), 600);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .product-card {
        transition: all 0.3s ease;
    }
    
    .category-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize cart count
updateCartCount();

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Add mobile menu styles if needed
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
    @media (max-width: 768px) {
        .nav {
            display: none;
        }
        
        .nav.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 1rem;
        }
    }
`;
document.head.appendChild(mobileStyle);

// UZS currency formatting
function formatUZS(value) {
    try {
        const num = Number(value) || 0;
        return num.toLocaleString('uz-UZ');
    } catch (e) {
        return value;
    }
}

// Ensure product images always display
function enhanceProductImages() {
    const fallbackDataUri =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#e5e7eb"/>
                        <stop offset="100%" stop-color="#cbd5e1"/>
                    </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#g)"/>
                <g fill="#9ca3af">
                    <circle cx="400" cy="260" r="80" />
                    <rect x="260" y="360" width="280" height="20" rx="10" />
                </g>
            </svg>`
        );

    document.querySelectorAll('.product-image img').forEach(img => {
        img.loading = img.loading || 'lazy';
        img.decoding = img.decoding || 'async';
        img.setAttribute('referrerpolicy', 'no-referrer');
        img.addEventListener('error', () => {
            if (img.dataset.fallbackApplied) return;
            img.dataset.fallbackApplied = 'true';
            img.src = fallbackDataUri;
            img.removeAttribute('srcset');
            img.style.objectFit = 'contain';
            img.style.background = '#f3f4f6';
        }, { once: true });
    });
}

