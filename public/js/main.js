/*  ---------------------------------------------------
    Template Name: Violet 
    Description: Violet ecommerce Html Template
    Author: Colorlib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Product filter & Dynamic Fetching
        --------------------*/
        if ($('#product-list').length > 0) {
            // Check for search query parameter
            var urlParams = new URLSearchParams(window.location.search);
            var searchQuery = urlParams.get('search');
            
            // Show search heading if searching
            if (searchQuery) {
                var searchHeading = '<div class="col-12 text-center search-heading-banner" style="margin-bottom: 30px;"><h3 style="font-family: Playfair Display, serif; color: #f5f5f5;">Search results for "<span style="color: #c9a96e;">' + searchQuery + '</span>"</h3></div>';
                $('#product-list').before(searchHeading);
            }
            
            // Load products initially
            loadProducts(searchQuery);
        }
    });

    /*------------------
        Product Loading Function (reusable)
    --------------------*/
    window.loadProducts = function(searchQuery, sort, category) {
        var fetchUrl;
        
        if (searchQuery) {
            fetchUrl = '/api/search?q=' + encodeURIComponent(searchQuery);
        } else {
            var params = [];
            if (sort) params.push('sort=' + sort);
            if (category && category !== 'all') params.push('category=' + category);
            fetchUrl = '/api/products' + (params.length > 0 ? '?' + params.join('&') : '');
        }
        
        fetch(fetchUrl)
            .then(res => res.json())
            .then(products => {
                const container = $('#product-list');
                container.empty();
                
                // Update product count
                if ($('#product-count').length > 0) {
                    $('#product-count').text(products.length + ' Product' + (products.length !== 1 ? 's' : ''));
                }
                
                products.forEach(p => {
                    const mixClass = (p.category || 'accessories').toLowerCase();
                    
                    const html = `
                    <div class="col-lg-3 col-sm-6 mix ${mixClass}">
                        <div class="single-product-item">
                            <figure>
                                <a href="product-page.html?id=${p._id}"><img src="${p.image_url}" alt="${p.name}"></a>
                                <div class="p-status">new</div>
                                <div class="product-hover">
                                    <a href="product-page.html?id=${p._id}" class="product-hover-btn" title="View Details"><i class="fa fa-eye"></i></a>
                                    <a href="#" class="product-hover-btn add-to-cart-quick" data-id="${p._id}" data-name="${p.name}" title="Add to Cart"><i class="fa fa-shopping-bag"></i></a>
                                </div>
                            </figure>
                            <div class="product-text">
                                <a href="product-page.html?id=${p._id}" style="color: inherit; text-decoration: none;">
                                    <h6>${p.name}</h6>
                                </a>
                                <p>$${p.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>`;
                    container.append(html);
                });

                // Bind quick add-to-cart buttons
                bindQuickAddToCart();

                // Initialize mixitup after adding items if controls exist
                if ($('.product-controls').length > 0) {
                    var containerEl = document.querySelector('#product-list');
                    if (window._mixer) window._mixer.destroy();
                    window._mixer = mixitup(containerEl);
                } else {
                    $('.single-product-item').parent().show();
                }

                // Apply scroll animation to newly added products
                applyScrollAnimations();
            })
            .catch(err => {
                console.error('Failed to load products', err);
                $('#product-list').html('<p style="text-align:center;width:100%;">Failed to load products.</p>');
            });
    };

    /*------------------
        Sort Dropdown Handler
    --------------------*/
    $(document).on('change', '#sort-select', function() {
        var sortVal = $(this).val();
        var activeCategory = $('.category-tab.active').data('category') || 'all';
        var urlParams = new URLSearchParams(window.location.search);
        var searchQuery = urlParams.get('search');
        loadProducts(searchQuery, sortVal, activeCategory);
    });

    /*------------------
        Category Tab Handler
    --------------------*/
    $(document).on('click', '.category-tab', function(e) {
        e.preventDefault();
        var category = $(this).data('category');
        
        // Update active styling
        $('.category-tab').removeClass('active').css({ 'color': '#a0a0a0', 'border-color': '#2a2a2a' });
        $(this).addClass('active').css({ 'color': '#c9a96e', 'border-color': '#c9a96e' });
        
        var sortVal = $('#sort-select').val() || '';
        var urlParams = new URLSearchParams(window.location.search);
        var searchQuery = urlParams.get('search');
        loadProducts(searchQuery, sortVal, category);
    });

    /*------------------
        Quick Add to Cart
    --------------------*/
    function bindQuickAddToCart() {
        $(document).off('click', '.add-to-cart-quick').on('click', '.add-to-cart-quick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var productId = $(this).data('id');
            var productName = $(this).data('name');
            var token = localStorage.getItem('amigo_token');
            
            if (!token) {
                showNotification('Please sign in to add items to your cart.', 'warning');
                setTimeout(function() { window.location.href = 'login.html'; }, 1500);
                return;
            }
            
            var $btn = $(this);
            $btn.find('i').removeClass('fa-shopping-bag').addClass('fa-spinner fa-spin');
            
            fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ product_id: productId, quantity: 1, size: 'M' })
            })
            .then(function(res) {
                if (res.ok) {
                    $btn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-check');
                    showNotification(productName + ' added to cart!', 'success');
                    if (window.updateCartCounter) window.updateCartCounter();
                    setTimeout(function() {
                        $btn.find('i').removeClass('fa-check').addClass('fa-shopping-bag');
                    }, 2000);
                } else {
                    $btn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-bag');
                    showNotification('Failed to add to cart', 'error');
                }
            })
            .catch(function() {
                $btn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-bag');
                showNotification('Server connection failed', 'error');
            });
        });
    }

    /*------------------
        Notification Toast
    --------------------*/
    function showNotification(message, type) {
        // Remove existing notifications
        $('.amigo-notification').remove();
        
        var bgColor = '#c9a96e'; // gold
        var icon = 'fa-check-circle';
        if (type === 'error') { bgColor = '#e74c3c'; icon = 'fa-exclamation-circle'; }
        if (type === 'warning') { bgColor = '#f39c12'; icon = 'fa-exclamation-triangle'; }
        
        var toast = $(`
            <div class="amigo-notification" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: #0a0a0a;
                padding: 15px 25px;
                border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                font-weight: 600;
                z-index: 99999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.4s ease;
            ">
                <i class="fa ${icon}"></i>
                ${message}
            </div>
        `);
        
        $('body').append(toast);
        setTimeout(function() {
            toast.fadeOut(400, function() { toast.remove(); });
        }, 3000);
    }

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
        Navigation
    --------------------*/
    $(".mobile-menu").slicknav({
        appendTo: '.header-section',
        allowParentLinks: true,
        closedSymbol: '<i class="fa fa-angle-right"></i>',
        openedSymbol: '<i class="fa fa-angle-down"></i>'
    });

    /*------------------
        Search model
    --------------------*/
    $('.search-trigger').on('click', function () {
        $('.search-model').fadeIn(400);
        setTimeout(function() { $('#search-input').focus(); }, 500);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
            $('#search-results').remove();
        });
    });

    // Search functionality - live search as user types
    var searchTimeout;
    $(document).on('input', '#search-input', function() {
        var query = $(this).val().trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            $('#search-results').remove();
            return;
        }
        
        searchTimeout = setTimeout(function() {
            fetch('/api/search?q=' + encodeURIComponent(query))
                .then(function(res) { return res.json(); })
                .then(function(products) {
                    $('#search-results').remove();
                    
                    if (products.length === 0) {
                        var noResults = $('<div id="search-results" style="text-align: center; color: #999; margin-top: 30px; font-family: Montserrat, sans-serif;">No products found for "' + query + '"</div>');
                        $('.search-model-form').after(noResults);
                        return;
                    }
                    
                    var resultsHtml = '<div id="search-results" style="max-width: 600px; margin: 30px auto 0; max-height: 400px; overflow-y: auto;">';
                    products.forEach(function(p) {
                        resultsHtml += `
                            <a href="product-page.html?id=${p._id}" style="
                                display: flex;
                                align-items: center;
                                gap: 15px;
                                padding: 12px 15px;
                                border-bottom: 1px solid rgba(255,255,255,0.1);
                                text-decoration: none;
                                color: #f5f5f5;
                                transition: background 0.3s;
                                border-radius: 6px;
                            " onmouseover="this.style.background='rgba(201,169,110,0.15)'" onmouseout="this.style.background='transparent'">
                                <img src="${p.image_url}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #333;">
                                <div>
                                    <div style="font-family: Playfair Display, serif; font-size: 16px; font-weight: 600;">${p.name}</div>
                                    <div style="font-family: Montserrat, sans-serif; font-size: 14px; color: #c9a96e;">$${p.price.toFixed(2)} &middot; ${p.category || 'Luxury'}</div>
                                </div>
                            </a>
                        `;
                    });
                    resultsHtml += '</div>';
                    
                    $('.search-model-form').after(resultsHtml);
                })
                .catch(function(err) {
                    console.error('Search error:', err);
                });
        }, 300);
    });

    // Submit search form on Enter
    $(document).on('submit', '.search-model-form', function(e) {
        e.preventDefault();
        var query = $('#search-input').val().trim();
        if (query.length >= 2) {
            window.location.href = 'categories.html?search=' + encodeURIComponent(query);
        }
    });

    /*------------------
        Carousel Slider
    --------------------*/
    $(".hero-items").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        smartSpeed: 1200,
        autoplayHoverPause: true,
        mouseDrag: false,
        autoplay: true,
        autoplayTimeout: 5000,
    });

    /*------------------
        Carousel Slider
    --------------------*/
    $(".logo-items").owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        margin: 40,
        autoplay: true,
        responsive: {
            0: {
                items: 2
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 5
            }
        }
    });


    /*------------------
        Carousel Slider
    --------------------*/
    $(".product-slider").owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        items: 1,
        dots: true,
        autoplay: true,
    });


    /*------------------
        Magnific Popup
    --------------------*/
    $('.pop-up').magnificPopup({
        type: 'image'
    });

    /*-------------------
        Sort Select
    --------------------- */
    $('.sort').niceSelect();

    /*-------------------
        Cart Select
    --------------------- */
    $('.cart-select').niceSelect();

    /*-------------------
        Quantity change
    --------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    /*-------------------
        Radio Btn
    --------------------- */
    $(".shipping-info .cs-item label").on('click', function () {
        $(".shipping-info .cs-item label").removeClass('active');
        $(this).addClass('active');
    });

    $(".checkout-form .diff-addr label").on('click', function () {
        $(this).toggleClass('active');
    });

    $(".payment-method ul li label").on('click', function () {
        $(this).toggleClass('active');
    });

    /*-------------------
        Scroll Animations
    --------------------- */
    function applyScrollAnimations() {
        var observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe product items, feature boxes, and section titles
        document.querySelectorAll('.single-product-item, .single-features-ads, .single-box-item, .section-title, .footer-widget .single-footer-widget, .lookbok-left, .lookbok-pic').forEach(function (el) {
            if (!el.classList.contains('fade-in-up')) {
                el.classList.add('fade-in-up');
                observer.observe(el);
            }
        });

        // Stagger product cards
        document.querySelectorAll('.single-product-item').forEach(function (el, i) {
            el.style.transitionDelay = (i % 4) * 0.1 + 's';
        });
    }

    // Run initial scroll animations
    applyScrollAnimations();

    // --- Amigo Backend Integration ---
    const API_BASE = '/api';

    // Utility to get auth headers
    window.getAuthHeaders = function() {
        const token = localStorage.getItem('amigo_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? 'Bearer ' + token : ''
        };
    };

    // Global: Update Cart Counter
    window.updateCartCounter = async function() {
        const token = localStorage.getItem('amigo_token');
        if (!token) return;

        try {
            const res = await fetch(API_BASE + '/cart', { headers: window.getAuthHeaders() });
            if (res.ok) {
                const cart = await res.json();
                const count = cart.reduce((acc, item) => acc + item.quantity, 0);
                
                // Update all bag counters
                const bagCounters = document.querySelectorAll('.header-right a span');
                bagCounters.forEach(span => {
                    span.innerText = count;
                });
            }
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    };

    // Global: Update UI based on auth state
    window.updateAuthStateUI = function() {
        const token = localStorage.getItem('amigo_token');
        const userAccessContainers = document.querySelectorAll('.user-access');
        const profileLinks = document.querySelectorAll('#user-profile-link');
        
        userAccessContainers.forEach(container => {
            if (token) {
                container.innerHTML = '<a href="#" onclick="logout(event)">Log out</a>';
            } else {
                container.innerHTML = '<a href="register.html">Register</a><a href="login.html" class="in">Sign in</a>';
            }
        });

        profileLinks.forEach(link => {
            if (token) {
                link.href = 'profile.html';
            } else {
                link.href = 'login.html';
            }
        });
    };

    window.logout = function(e) {
        if(e) e.preventDefault();
        localStorage.removeItem('amigo_token');
        localStorage.removeItem('amigo_user');
        window.location.reload();
    };

    $(document).ready(function() {
        window.updateAuthStateUI();
        window.updateCartCounter();
    });

})(jQuery);