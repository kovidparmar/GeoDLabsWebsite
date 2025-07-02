// GeoD Labs Website JavaScript
// Main functionality for navigation, interactions, and user experience

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initMobileNavigation();
    initBackToTop();
    initSmoothScrolling();
    initNewsAnimations();
    initFormValidation();
    initAccessibility();
    initPerformanceOptimizations();
});

// Mobile Navigation
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navigation = document.querySelector('#primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navigation) return;

    // Toggle mobile menu
    mobileToggle.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navigation.classList.toggle('nav-open');
        document.body.classList.toggle('nav-open');

        // Update icon
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
        }

        // Focus management
        if (!isExpanded) {
            navigation.querySelector('.nav-link')?.focus();
        }
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navigation.classList.remove('nav-open');
            document.body.classList.remove('nav-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navigation.classList.contains('nav-open')) {
            navigation.classList.remove('nav-open');
            document.body.classList.remove('nav-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navigation.contains(e.target) && !mobileToggle.contains(e.target)) {
            if (navigation.classList.contains('nav-open')) {
                navigation.classList.remove('nav-open');
                document.body.classList.remove('nav-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('#back-to-top');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                toggleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Focus management
        setTimeout(() => {
            document.querySelector('#main-content')?.focus();
        }, 500);
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();

            const headerOffset = 80; // Adjust based on your header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update focus for accessibility
            setTimeout(() => {
                targetElement.focus();
            }, 500);
        });
    });
}

// News and Content Animations
function initNewsAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.research-area-card, .news-item, .what-we-do-content, .hero-content'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Form Validation (for contact forms)
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required.';
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number.';
            isValid = false;
        }
    }

    // Display error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.id = field.id + '-error';

    field.setAttribute('aria-describedby', errorDiv.id);
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');

    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Accessibility Enhancements
function initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#main-content');
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function (e) {
        // Tab key navigation enhancements
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('using-keyboard');
    });

    // ARIA live regions for dynamic content
    createLiveRegion();
}

function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
    const liveRegion = document.querySelector('#live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images (if not natively supported)
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Preload critical resources
    preloadCriticalResources();
}

function preloadCriticalResources() {
    const criticalImages = [
        'images/geod-labs-hero-bg.jpg',
        'images/iitgn-logo.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Research Areas Interactive Features
function initResearchInteractions() {
    const researchCards = document.querySelectorAll('.research-area-card');

    researchCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.classList.add('hovered');
        });

        card.addEventListener('mouseleave', function () {
            this.classList.remove('hovered');
        });

        // Keyboard navigation
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.btn');
                if (link) link.click();
            }
        });
    });
}

// News Filtering and Search (if needed)
function initNewsFiltering() {
    const newsItems = document.querySelectorAll('.news-item');
    const searchInput = document.querySelector('#news-search');

    if (searchInput && newsItems.length > 0) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();

            newsItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const content = item.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Announce results to screen readers
            const visibleItems = Array.from(newsItems).filter(item =>
                item.style.display !== 'none'
            ).length;
            announceToScreenReader(`${visibleItems} news items found`);
        });
    }
}

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts if needed
window.GeoD = {
    announceToScreenReader,
    debounce,
    throttle
};


// Publications Page Functionality
// Add this to your existing script.js file

// Initialize publications page features when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the publications page
    if (document.querySelector('.publications-page')) {
        initPublicationsSearch();
        initPublicationsFilter();
        initViewToggle();
        initPublicationsInteractions();
    }
});

// Publications Search Functionality
function initPublicationsSearch() {
    const searchInput = document.querySelector('#publication-search');
    const searchButton = document.querySelector('.search-button');
    const publicationItems = document.querySelectorAll('.publication-item');
    const noResultsMessage = document.querySelector('#no-results');
    const resetButton = document.querySelector('#reset-search');

    if (!searchInput || !publicationItems.length) return;

    // Debounced search function
    const debouncedSearch = debounce(performSearch, 300);

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        publicationItems.forEach(item => {
            const title = item.querySelector('.publication-title').textContent.toLowerCase();
            const authors = item.querySelector('.authors').textContent.toLowerCase();
            const year = item.querySelector('.year').textContent.toLowerCase();

            const isVisible = !searchTerm ||
                title.includes(searchTerm) ||
                authors.includes(searchTerm) ||
                year.includes(searchTerm);

            if (isVisible) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }

        // Announce results to screen readers
        if (searchTerm) {
            announceToScreenReader(`${visibleCount} publications found for "${searchTerm}"`);
        }
    }

    // Event listeners
    searchInput.addEventListener('input', debouncedSearch);
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (resetButton) {
        resetButton.addEventListener('click', function () {
            searchInput.value = '';
            clearAllFilters();
            performSearch();
            searchInput.focus();
        });
    }
}

// Publications Filter Functionality
function initPublicationsFilter() {
    const yearFilter = document.querySelector('#year-filter');
    const authorFilter = document.querySelector('#author-filter');
    const clearFiltersBtn = document.querySelector('#clear-filters');
    const publicationItems = document.querySelectorAll('.publication-item');

    if (!yearFilter || !authorFilter || !publicationItems.length) return;

    function applyFilters() {
        const selectedYear = yearFilter.value;
        const selectedAuthor = authorFilter.value;
        const searchTerm = document.querySelector('#publication-search').value.toLowerCase().trim();

        let visibleCount = 0;

        publicationItems.forEach(item => {
            const itemYear = item.dataset.year;
            const itemAuthors = item.dataset.authors;
            const title = item.querySelector('.publication-title').textContent.toLowerCase();
            const authors = item.querySelector('.authors').textContent.toLowerCase();
            const year = item.querySelector('.year').textContent.toLowerCase();

            // Check year filter
            const yearMatch = selectedYear === 'all' || itemYear === selectedYear;

            // Check author filter
            // Check author filter
            const authorMatch = selectedAuthor === 'all' ||
                (itemAuthors && itemAuthors.toLowerCase().split(',').includes(selectedAuthor.toLowerCase()));
            // Check search term
            const searchMatch = !searchTerm ||
                title.includes(searchTerm) ||
                authors.includes(searchTerm) ||
                year.includes(searchTerm);

            const isVisible = yearMatch && authorMatch && searchMatch;

            if (isVisible) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });

        // Show/hide no results message
        const noResultsMessage = document.querySelector('#no-results');
        if (visibleCount === 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }

        // Announce filter results
        const filterText = [];
        if (selectedYear !== 'all') filterText.push(`year ${selectedYear}`);
        if (selectedAuthor !== 'all') filterText.push(`author filter applied`);
        if (searchTerm) filterText.push(`search "${searchTerm}"`);

        const filterDescription = filterText.length > 0 ? ` with filters: ${filterText.join(', ')}` : '';
        announceToScreenReader(`${visibleCount} publications shown${filterDescription}`);
    }

    // Event listeners
    yearFilter.addEventListener('change', applyFilters);
    authorFilter.addEventListener('change', applyFilters);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    function clearAllFilters() {
        yearFilter.value = 'all';
        authorFilter.value = 'all';
        document.querySelector('#publication-search').value = '';
        applyFilters();
        announceToScreenReader('All filters cleared');
    }
}

// View Toggle Functionality (Grid/List)
function initViewToggle() {
    const gridViewBtn = document.querySelector('#grid-view');
    const listViewBtn = document.querySelector('#list-view');
    const publicationList = document.querySelector('.publication-list');

    if (!gridViewBtn || !listViewBtn || !publicationList) return;

    function setView(viewType) {
        // Update buttons
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.classList.remove('active');
        });

        // Update list container
        publicationList.classList.remove('grid-view', 'list-view');
        publicationList.classList.add(viewType);

        // Update active button
        if (viewType === 'grid-view') {
            gridViewBtn.classList.add('active');
            announceToScreenReader('Grid view selected');
        } else {
            listViewBtn.classList.add('active');
            announceToScreenReader('List view selected');
        }

        // Save preference to localStorage if available
        try {
            localStorage.setItem('publications-view', viewType);
        } catch (e) {
            // Handle cases where localStorage is not available
            console.log('Unable to save view preference');
        }
    }

    // Event listeners
    gridViewBtn.addEventListener('click', () => setView('grid-view'));
    listViewBtn.addEventListener('click', () => setView('list-view'));

    // Keyboard navigation
    [gridViewBtn, listViewBtn].forEach(btn => {
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Load saved preference
    try {
        const savedView = localStorage.getItem('publications-view');
        if (savedView && (savedView === 'grid-view' || savedView === 'list-view')) {
            setView(savedView);
        }
    } catch (e) {
        // Use default grid view if localStorage is not available
        console.log('Unable to load view preference');
    }
}

// Publications Interactive Features
function initPublicationsInteractions() {
    const publicationItems = document.querySelectorAll('.publication-item');

    publicationItems.forEach(item => {
        // Add hover effects for better UX
        item.addEventListener('mouseenter', function () {
            this.classList.add('hovered');
        });

        item.addEventListener('mouseleave', function () {
            this.classList.remove('hovered');
        });

        // Keyboard navigation for publication items
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const link = this.querySelector('.btn');
                if (link) {
                    e.preventDefault();
                    link.click();
                }
            }
        });

        // Handle publication link clicks
        const publicationLink = item.querySelector('.btn');
        if (publicationLink) {
            publicationLink.addEventListener('click', function (e) {
                // Track publication clicks (analytics could be added here)
                const title = item.querySelector('.publication-title').textContent;
                console.log(`Publication accessed: ${title}`);

                // Announce to screen readers
                announceToScreenReader(`Opening publication: ${title}`);
            });
        }
    });

    // Add animation on scroll for publication items
    initPublicationAnimations();
}

// Animation for publication items
function initPublicationAnimations() {
    const publicationItems = document.querySelectorAll('.publication-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for better visual effect
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    publicationItems.forEach(item => {
        item.classList.add('animate-on-scroll');
        observer.observe(item);
    });
}

// Utility function to clear all filters (used by both search and filter functions)
function clearAllFilters() {
    const yearFilter = document.querySelector('#year-filter');
    const authorFilter = document.querySelector('#author-filter');
    const searchInput = document.querySelector('#publication-search');

    if (yearFilter) yearFilter.value = 'all';
    if (authorFilter) authorFilter.value = 'all';
    if (searchInput) searchInput.value = '';

    // Trigger filter application
    const publicationItems = document.querySelectorAll('.publication-item');
    publicationItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('hidden');
    });

    const noResultsMessage = document.querySelector('#no-results');
    if (noResultsMessage) {
        noResultsMessage.classList.add('hidden');
    }
}

// Enhanced search with highlighting (optional feature)
function highlightSearchTerms(element, searchTerm) {
    if (!searchTerm) return;

    const textNodes = getTextNodes(element);
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');

    textNodes.forEach(node => {
        if (regex.test(node.textContent)) {
            const highlightedHTML = node.textContent.replace(regex, '<mark>$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedHTML;
            node.parentNode.replaceChild(wrapper, node);
        }
    });
}

function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    return textNodes;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Publications sorting functionality (optional enhancement)
function initPublicationsSorting() {
    const sortSelect = document.querySelector('#sort-publications');
    if (!sortSelect) return;

    const publicationList = document.querySelector('.publication-list');
    const publicationItems = Array.from(document.querySelectorAll('.publication-item'));

    sortSelect.addEventListener('change', function () {
        const sortBy = this.value;
        let sortedItems;

        switch (sortBy) {
            case 'year-desc':
                sortedItems = publicationItems.sort((a, b) =>
                    b.dataset.year - a.dataset.year
                );
                break;
            case 'year-asc':
                sortedItems = publicationItems.sort((a, b) =>
                    a.dataset.year - b.dataset.year
                );
                break;
            case 'title-asc':
                sortedItems = publicationItems.sort((a, b) =>
                    a.querySelector('.publication-title').textContent.localeCompare(
                        b.querySelector('.publication-title').textContent
                    )
                );
                break;
            case 'title-desc':
                sortedItems = publicationItems.sort((a, b) =>
                    b.querySelector('.publication-title').textContent.localeCompare(
                        a.querySelector('.publication-title').textContent
                    )
                );
                break;
            default:
                sortedItems = publicationItems;
        }

        // Re-append sorted items
        sortedItems.forEach(item => {
            publicationList.appendChild(item);
        });

        announceToScreenReader(`Publications sorted by ${sortBy.replace('-', ' ')}`);
    });
}

// Export publications functions for potential use elsewhere
if (typeof window.GeoD !== 'undefined') {
    window.GeoD.publications = {
        clearAllFilters,
        highlightSearchTerms
    };
}

// Team Page Specific JavaScript Functions
// Add these functions to your existing script.js file

// Initialize team page functionality
function initTeamPage() {
    initTeamFiltering();
    initMemberCardAnimations();
    initMemberCardInteractions();
}

// Team Member Filtering
function initTeamFiltering() {
    const navButtons = document.querySelectorAll('.team-nav .nav-btn');
    const teamCategories = document.querySelectorAll('.team-category');

    if (navButtons.length === 0 || teamCategories.length === 0) return;

    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter team categories
            filterTeamMembers(category, teamCategories);

            // Announce change to screen readers
            const categoryName = this.textContent;
            announceToScreenReader(`Showing ${categoryName.toLowerCase()}`);

            // Scroll to team section smoothly
            const teamSection = document.querySelector('.team-section');
            if (teamSection) {
                const headerOffset = 100;
                const elementPosition = teamSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });

        // Keyboard navigation for filter buttons
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Filter team members based on category
function filterTeamMembers(category, teamCategories) {
    teamCategories.forEach(categoryDiv => {
        const categoryData = categoryDiv.getAttribute('data-category');

        if (category === 'all' || categoryData === category) {
            // Show category
            categoryDiv.style.display = 'block';
            categoryDiv.classList.add('fade-in');

            // Animate member cards within the category
            const memberCards = categoryDiv.querySelectorAll('.member-card');
            memberCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        } else {
            // Hide category
            categoryDiv.style.display = 'none';
            categoryDiv.classList.remove('fade-in');
        }
    });
}

// Member Card Animations
function initMemberCardAnimations() {
    // Intersection Observer for member cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all member cards
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        // Stagger the animation slightly
        card.style.animationDelay = `${index * 0.1}s`;
        cardObserver.observe(card);
    });
}

// Member Card Interactions
function initMemberCardInteractions() {
    const memberCards = document.querySelectorAll('.member-card');

    memberCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function () {
            this.classList.add('card-hovered');

            // Add subtle animation to social links
            const socialLinks = this.querySelectorAll('.social-link');
            socialLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateY(-2px)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function () {
            this.classList.remove('card-hovered');

            // Reset social links
            const socialLinks = this.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                link.style.transform = 'translateY(0)';
            });
        });

        // Focus management for accessibility
        card.addEventListener('focusin', function () {
            this.classList.add('card-focused');
        });

        card.addEventListener('focusout', function () {
            this.classList.remove('card-focused');
        });

        // Social link interactions
        const socialLinks = card.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Handle email links
                if (this.classList.contains('email')) {
                    const email = this.getAttribute('href');
                    if (email && email.startsWith('mailto:')) {
                        // Add slight delay for visual feedback
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 150);
                    }
                }

                // Handle external links
                if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
                    e.preventDefault();
                    announceToScreenReader('Link not available');
                    return;
                }

                // Add opening external link announcement
                if (!this.classList.contains('email')) {
                    announceToScreenReader('Opening external link');
                }
            });

            // Keyboard navigation for social links
            link.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    this.click();
                }
            });
        });
    });
}

// Advanced member search functionality
function initMemberSearch() {
    const searchInput = document.querySelector('#member-search');
    const memberCards = document.querySelectorAll('.member-card');

    if (!searchInput || memberCards.length === 0) return;

    // Debounced search function
    const debouncedSearch = debounce(function (searchTerm) {
        searchMembers(searchTerm, memberCards);
    }, 300);

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        debouncedSearch(searchTerm);
    });

    // Clear search on escape
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.value = '';
            searchMembers('', memberCards);
            this.blur();
        }
    });
}

// Search through team members
function searchMembers(searchTerm, memberCards) {
    let visibleCount = 0;

    memberCards.forEach(card => {
        const name = card.querySelector('.member-name')?.textContent.toLowerCase() || '';
        const position = card.querySelector('.member-position')?.textContent.toLowerCase() || '';
        const interests = Array.from(card.querySelectorAll('.interest-tag'))
            .map(tag => tag.textContent.toLowerCase()).join(' ');
        const education = card.querySelector('.member-education')?.textContent.toLowerCase() || '';

        const searchableText = `${name} ${position} ${interests} ${education}`;

        if (!searchTerm || searchableText.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('search-match');
            visibleCount++;

            // Highlight search term if provided
            if (searchTerm) {
                highlightSearchTerm(card, searchTerm);
            } else {
                removeHighlights(card);
            }
        } else {
            card.style.display = 'none';
            card.classList.remove('search-match');
        }
    });

    // Update category visibility based on search results
    updateCategoryVisibility();

    // Announce search results
    if (searchTerm) {
        announceToScreenReader(`${visibleCount} members found for "${searchTerm}"`);
    } else {
        announceToScreenReader('Showing all members');
    }
}

// Highlight search terms in member cards
function highlightSearchTerm(card, searchTerm) {
    const elementsToSearch = card.querySelectorAll('.member-name, .member-position, .interest-tag');

    elementsToSearch.forEach(element => {
        const originalText = element.textContent;
        const highlightedText = originalText.replace(
            new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi'),
            '<mark>$1</mark>'
        );

        if (highlightedText !== originalText) {
            element.innerHTML = highlightedText;
        }
    });
}

// Remove search highlights
function removeHighlights(card) {
    const highlightedElements = card.querySelectorAll('mark');
    highlightedElements.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
        parent.normalize();
    });
}

// Update category visibility during search
function updateCategoryVisibility() {
    const categories = document.querySelectorAll('.team-category');

    categories.forEach(category => {
        const visibleCards = category.querySelectorAll('.member-card[style*="block"], .member-card:not([style*="none"])');
        const categoryHeader = category.querySelector('.category-header');

        if (visibleCards.length > 0) {
            category.style.display = 'block';
            if (categoryHeader) categoryHeader.style.display = 'block';
        } else {
            if (categoryHeader) categoryHeader.style.display = 'none';
        }
    });
}

// Utility function to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Member card lazy loading for images
function initMemberImageLazyLoading() {
    const memberImages = document.querySelectorAll('.member-photo img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Add loading state
                    img.classList.add('loading');

                    // Handle image load
                    img.addEventListener('load', function () {
                        this.classList.remove('loading');
                        this.classList.add('loaded');
                    });

                    // Handle image error
                    img.addEventListener('error', function () {
                        this.classList.remove('loading');
                        this.classList.add('error');
                        this.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
                    });

                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        memberImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize team page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the team page
    if (document.querySelector('.team-section')) {
        initTeamPage();
        initMemberSearch();
        initMemberImageLazyLoading();
    }
});

// Export team functions for external use
window.TeamPage = {
    filterTeamMembers,
    searchMembers,
    initTeamPage
};