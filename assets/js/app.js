// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== NAVEGACIÓN ====================
    
    // Toggle del menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Efecto de scroll en el header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ==================== BÚSQUEDA ====================
    
    const btnSearch = document.querySelector('.btn-search');
    
    if (btnSearch) {
        btnSearch.addEventListener('click', function() {
            // Aquí puedes agregar un modal de búsqueda o expandir un campo de búsqueda
            alert('Función de búsqueda - Próximamente');
        });
    }
    
    // ==================== CARRITO ====================
    
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    // Función para actualizar el contador del carrito
    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            
            // Animación del contador
            cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Agregar productos al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Incrementar contador
            cartCount++;
            updateCartCount();
            
            // Cambiar texto del botón temporalmente
            const originalText = this.textContent;
            this.textContent = '¡Agregado!';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1500);
            
            // Mostrar notificación
            showNotification(`${productTitle} agregado al carrito`);
            
            console.log('Producto agregado:', {
                id: productId,
                title: productTitle,
                price: productPrice
            });
        });
    });
    
    // ==================== WISHLIST ====================
    
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('.icon-heart');
            
            // Toggle estado de favorito
            if (icon.style.fontWeight === '900') {
                icon.style.fontWeight = '400';
                showNotification('Eliminado de favoritos');
            } else {
                icon.style.fontWeight = '900';
                icon.style.color = '#ef4444';
                showNotification('Agregado a favoritos');
            }
        });
    });
    
    // ==================== FILTROS DE PRODUCTOS ====================
    
    const filterCategory = document.getElementById('filter-category');
    const filterSort = document.getElementById('filter-sort');
    const productsContainer = document.getElementById('products-container');
    const productCards = document.querySelectorAll('.product-card');
    
    // Filtrar por categoría
    if (filterCategory) {
        filterCategory.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // Ordenar productos
    if (filterSort) {
        filterSort.addEventListener('change', function() {
            const sortType = this.value;
            const cardsArray = Array.from(productCards);
            
            cardsArray.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price'));
                const priceB = parseFloat(b.getAttribute('data-price'));
                
                switch(sortType) {
                    case 'price-asc':
                        return priceA - priceB;
                    case 'price-desc':
                        return priceB - priceA;
                    case 'newest':
                        return 0; // Mantener orden original
                    default:
                        return 0;
                }
            });
            
            // Reorganizar productos en el DOM
            cardsArray.forEach(card => {
                productsContainer.appendChild(card);
            });
            
            // Animación de reorganización
            productCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        });
    }
    
    // ==================== CARGAR MÁS PRODUCTOS ====================
    
    const loadMoreBtn = document.querySelector('.load-more .btn-secondary');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = 'Cargando...';
            this.disabled = true;
            
            // Simular carga de productos
            setTimeout(() => {
                this.textContent = 'Cargar más productos';
                this.disabled = false;
                showNotification('No hay más productos disponibles');
            }, 1500);
        });
    }
    
    // ==================== CAROUSEL ====================
    
    // Bootstrap maneja el carousel, pero podemos agregar funcionalidad adicional
    const carouselElement = document.getElementById('template-mo-zay-hero-carousel');
    
    if (carouselElement) {
        carouselElement.addEventListener('slide.bs.carousel', function (e) {
            console.log('Cambiando a slide:', e.to);
        });
    }
    
    // ==================== ANIMACIONES AL SCROLL ====================
    
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar secciones
    const sections = document.querySelectorAll('.categories, .products, .purchase-process');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
    
    // Observar tarjetas de categorías
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observar pasos del proceso
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // ==================== SMOOTH SCROLL ====================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces que no son anclas de sección
            if (href === '#' || href === '#login' || href === '#carrito') {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== NOTIFICACIONES ====================
    
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.background = 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
        notification.style.color = '#ffffff';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        notification.style.fontWeight = '500';
        notification.style.fontSize = '0.95rem';
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // ==================== INICIALIZACIÓN ====================
    
    console.log('MAK-PC Enterprises - Sistema inicializado correctamente');
    
    // Cargar contador del carrito desde localStorage (opcional)
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount) {
        cartCount = parseInt(savedCartCount);
        updateCartCount();
    }
    
    // Guardar contador al cerrar/refrescar página
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('cartCount', cartCount);
    });
    
});

// ==================== FUNCIONES GLOBALES ====================

// Función para validar formularios (si agregas un formulario de contacto)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Función para formatear precios
function formatPrice(price) {
    return `S/ ${parseFloat(price).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Prevenir errores de consola en producción
window.addEventListener('error', function(e) {
    console.warn('Error capturado:', e.message);
});