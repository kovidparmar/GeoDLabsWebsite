// GeoD Labs Website JavaScript
// Enhanced functionality for navigation, interactions, and user experience

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initBackToTop();
    initScrollEffects();
    initNewsCarousel();
    initFormValidation();
    initLazyLoading();
    initAccessibility();
    initTeamPage();
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && primaryNav) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle navigation visibility
            primaryNav.classList.toggle('nav-open');
            
            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            
            // Toggle body scroll lock on mobile
            document.body.classList.toggle('nav-open');
        });

        // Close mobile nav when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    primaryNav.classList.remove('nav-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                    
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !primaryNav.contains(e.target)) {
                if (primaryNav.classList.contains('nav-open')) {
                    primaryNav.classList.remove('nav-open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                    
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    }
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.focus();
            }
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('#back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Scroll Effects (Header background, animations)
function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const heroSection = document.querySelector('.hero');
    
    // Header background on scroll
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.research-area-card, .news-item, .what-we-do-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// News Section Enhancement
function initNewsCarousel() {
    const newsGrid = document.querySelector('.news-grid');
    const newsItems = document.querySelectorAll('.news-item');
    
    if (newsItems.length > 0) {
        // Add hover effects
        newsItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.classList.add('hovered');
            });
            
            item.addEventListener('mouseleave', function() {
                this.classList.remove('hovered');
            });
        });
    }
}

// Form Validation (for contact forms)
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
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
        errorMessage = 'This field is required';
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Phone validation (basic)
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = 'Please enter a valid phone number';
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
    
    const errorElement = document.createElement('span');
    errorElement.classList.add('field-error');
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

// Accessibility Enhancements
function initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Keyboard navigation for cards
    const interactiveCards = document.querySelectorAll('.research-area-card, .news-item');
    interactiveCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // Focus management for mobile menu
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');
    
    if (mobileToggle && primaryNav) {
        mobileToggle.addEventListener('click', function() {
            setTimeout(() => {
                if (primaryNav.classList.contains('nav-open')) {
                    const firstNavLink = primaryNav.querySelector('.nav-link');
                    if (firstNavLink) {
                        firstNavLink.focus();
                    }
                }
            }, 100);
        });
    }
}

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

// Performance optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-dependent functionality here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Close mobile nav on resize to desktop
    if (window.innerWidth > 768) {
        const primaryNav = document.querySelector('#primary-navigation');
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        
        if (primaryNav && primaryNav.classList.contains('nav-open')) {
            primaryNav.classList.remove('nav-open');
            document.body.classList.remove('nav-open');
            
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        }
    }
}, 250));

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileNavigation,
        initSmoothScrolling,
        initBackToTop,
        validateForm,
        validateField
    };
}


// JavaScript for GeoD Labs About Page
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');

    if (mobileToggle && primaryNav) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle navigation visibility
            primaryNav.classList.toggle('nav-open');
            
            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('#back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});



// Additional JavaScript functions for Research Page
// Add these to your existing script.js file

// Initialize research page specific functionality
function initResearchPage() {
    initResearchCardAnimations();
    initProjectCards();
    initPublicationCards();
    initCollaborationSection();
    initResearchImageGallery();
}

// Research card animations and interactions
function initResearchCardAnimations() {
    const researchCards = document.querySelectorAll('.research-detailed-card');
    
    if (researchCards.length > 0) {
        // Intersection Observer for staggered animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 200); // Staggered animation
                }
            });
        }, observerOptions);
        
        researchCards.forEach(card => {
            cardObserver.observe(card);
        });
        
        // Add hover effects for research cards
        researchCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('card-hovered');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('card-hovered');
            });
        });
    }
}

// Project cards functionality
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add click interaction for project cards
        card.addEventListener('click', function(e) {
            // Prevent default if clicking on links inside
            if (e.target.tagName !== 'A') {
                this.classList.toggle('expanded');
            }
        });
        
        // Keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('expanded');
            }
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.classList.add('project-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('project-hovered');
        });
    });
}

// Publication cards interactions
function initPublicationCards() {
    const publicationCards = document.querySelectorAll('.publication-card');
    
    publicationCards.forEach(card => {
        // Add click effect
        card.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
        });
        
        // Hover animations
        card.addEventListener('mouseenter', function() {
            this.classList.add('pub-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('pub-hovered');
        });
    });
}

// Collaboration section animations
function initCollaborationSection() {
    const collabCategories = document.querySelectorAll('.collab-category');
    
    // Animate collaboration categories on scroll
    const collabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('collab-visible');
                
                // Animate list items with delay
                const listItems = entry.target.querySelectorAll('li');
                listItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('item-visible');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.3 });
    
    collabCategories.forEach(category => {
        collabObserver.observe(category);
    });
}

// Research image gallery functionality
function initResearchImageGallery() {
    const imageGrids = document.querySelectorAll('.research-image-grid');
    
    imageGrids.forEach(grid => {
        const images = grid.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Add click to expand functionality
            img.addEventListener('click', function() {
                createImageModal(this);
            });
            
            // Add keyboard navigation
            img.setAttribute('tabindex', '0');
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    createImageModal(this);
                }
            });
            
            // Staggered loading animation
            img.addEventListener('load', function() {
                setTimeout(() => {
                    this.classList.add('image-loaded');
                }, index * 150);
            });
        });
    });
}

// Create image modal for expanded view
function createImageModal(imgElement) {
    // Remove existing modal if present
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Expanded image view');
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close modal');
    
    const modalImg = document.createElement('img');
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    modalImg.className = 'modal-image';
    
    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalImg);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners
    closeBtn.addEventListener('click', closeImageModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleModalKeydown);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    closeBtn.focus();
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('modal-open');
    }, 10);
}

// Close image modal
function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.add('modal-closing');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleModalKeydown);
        }, 300);
    }
}

// Handle modal keyboard navigation
function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
}

// Research tags interaction
function initResearchTags() {
    const tags = document.querySelectorAll('.research-tags .tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('tag-selected');
            // Here you could add filtering functionality
        });
    });
}

// Smooth reveal for research content sections
function initContentReveal() {
    const contentSections = document.querySelectorAll('.research-content, .research-details');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('content-revealed');
            }
        });
    }, { threshold: 0.1 });
    
    contentSections.forEach(section => {
        revealObserver.observe(section);
    });
}

// Initialize all research page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the research page
    if (document.querySelector('.research-areas') || document.querySelector('.current-projects')) {
        initResearchPage();
        initResearchTags();
        initContentReveal();
    }
});

// Export functions for potential reuse
if (typeof window !== 'undefined') {
    window.ResearchPageJS = {
        initResearchPage,
        initResearchCardAnimations,
        initProjectCards,
        initPublicationCards,
        createImageModal,
        closeImageModal
    };
}

// Publications Page JavaScript
// Add this to your existing script.js file

// Initialize publications page functionality
function initPublicationsPage() {
    initPublicationSearch();
    initPublicationFilters();
    initViewToggle();
    initPublicationAnimations();
}

// Publication search functionality
function initPublicationSearch() {
    const searchInput = document.querySelector('#publication-search');
    const searchButton = document.querySelector('.search-button');
    const publicationItems = document.querySelectorAll('.publication-item');
    const noResultsMessage = document.querySelector('#no-results');
    const resetButton = document.querySelector('#reset-search');

    if (!searchInput) return;

    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        publicationItems.forEach(item => {
            const title = item.querySelector('.publication-title').textContent.toLowerCase();
            const authors = item.querySelector('.authors').textContent.toLowerCase();
            const year = item.querySelector('.year').textContent.toLowerCase();
            
            const isVisible = title.includes(searchTerm) || 
                            authors.includes(searchTerm) || 
                            year.includes(searchTerm);

            if (isVisible) {
                item.style.display = '';
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm !== '') {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }

        // Animate visible items
        animateVisiblePublications();
    }

    // Event listeners for search
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // Reset search functionality
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            searchInput.value = '';
            clearAllFilters();
            performSearch();
        });
    }
}

// Publication filters functionality
function initPublicationFilters() {
    const yearFilter = document.querySelector('#year-filter');
    const authorFilter = document.querySelector('#author-filter');
    const clearFiltersBtn = document.querySelector('#clear-filters');
    const publicationItems = document.querySelectorAll('.publication-item');
    const noResultsMessage = document.querySelector('#no-results');

    function applyFilters() {
        const selectedYear = yearFilter ? yearFilter.value : 'all';
        const selectedAuthor = authorFilter ? authorFilter.value : 'all';
        const searchTerm = document.querySelector('#publication-search')?.value.toLowerCase().trim() || '';
        
        let visibleCount = 0;

        publicationItems.forEach(item => {
            let showItem = true;

            // Year filter
            if (selectedYear !== 'all') {
                const itemYear = item.getAttribute('data-year');
                if (itemYear !== selectedYear) {
                    showItem = false;
                }
            }

            // Author filter
            if (selectedAuthor !== 'all' && showItem) {
                const itemAuthors = item.getAttribute('data-authors') || '';
                if (!itemAuthors.includes(selectedAuthor)) {
                    showItem = false;
                }
            }

            // Search filter
            if (searchTerm && showItem) {
                const title = item.querySelector('.publication-title').textContent.toLowerCase();
                const authors = item.querySelector('.authors').textContent.toLowerCase();
                const year = item.querySelector('.year').textContent.toLowerCase();
                
                if (!title.includes(searchTerm) && 
                    !authors.includes(searchTerm) && 
                    !year.includes(searchTerm)) {
                    showItem = false;
                }
            }

            // Show/hide item
            if (showItem) {
                item.style.display = '';
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResultsMessage?.classList.remove('hidden');
        } else {
            noResultsMessage?.classList.add('hidden');
        }

        // Animate visible items
        animateVisiblePublications();
    }

    // Event listeners for filters
    if (yearFilter) {
        yearFilter.addEventListener('change', applyFilters);
    }

    if (authorFilter) {
        authorFilter.addEventListener('change', applyFilters);
    }

    // Clear filters functionality
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
            applyFilters();
        });
    }

    // Clear filters function
    function clearAllFilters() {
        if (yearFilter) yearFilter.value = 'all';
        if (authorFilter) authorFilter.value = 'all';
        const searchInput = document.querySelector('#publication-search');
        if (searchInput) searchInput.value = '';
    }

    // Make clearAllFilters available globally for reset functionality
    window.clearAllFilters = clearAllFilters;
}

// View toggle functionality (Grid/List view)
function initViewToggle() {
    const gridViewBtn = document.querySelector('#grid-view');
    const listViewBtn = document.querySelector('#list-view');
    const publicationList = document.querySelector('.publication-list');

    if (!gridViewBtn || !listViewBtn || !publicationList) return;

    // Grid view
    gridViewBtn.addEventListener('click', function() {
        publicationList.classList.remove('list-view');
        publicationList.classList.add('grid-view');
        
        // Update active states
        this.classList.add('active');
        listViewBtn.classList.remove('active');
        
        // Store preference
        localStorage.setItem('publicationsView', 'grid');
        
        // Re-animate items
        setTimeout(animateVisiblePublications, 100);
    });

    // List view
    listViewBtn.addEventListener('click', function() {
        publicationList.classList.remove('grid-view');
        publicationList.classList.add('list-view');
        
        // Update active states
        this.classList.add('active');
        gridViewBtn.classList.remove('active');
        
        // Store preference
        localStorage.setItem('publicationsView', 'list');
        
        // Re-animate items
        setTimeout(animateVisiblePublications, 100);
    });

    // Load saved preference
    const savedView = localStorage.getItem('publicationsView');
    if (savedView === 'list') {
        listViewBtn.click();
    }
}

// Animation for publication items
function initPublicationAnimations() {
    const publicationItems = document.querySelectorAll('.publication-item');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const publicationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100); // Staggered animation
            }
        });
    }, observerOptions);
    
    publicationItems.forEach(item => {
        publicationObserver.observe(item);
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.classList.add('item-hovered');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('item-hovered');
        });
        
        // Add keyboard navigation
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('.btn');
                if (link) {
                    e.preventDefault();
                    link.click();
                }
            }
        });
    });
}

// Animate visible publications (for filter/search results)
function animateVisiblePublications() {
    const visibleItems = document.querySelectorAll('.publication-item:not(.hidden)');
    
    visibleItems.forEach((item, index) => {
        item.classList.remove('animate-in');
        setTimeout(() => {
            item.classList.add('animate-in');
        }, index * 50);
    });
}

// Publication statistics
function updatePublicationStats() {
    const totalItems = document.querySelectorAll('.publication-item').length;
    const visibleItems = document.querySelectorAll('.publication-item:not(.hidden)').length;
    
    // Update stats display if element exists
    const statsElement = document.querySelector('.publication-stats');
    if (statsElement) {
        statsElement.textContent = `Showing ${visibleItems} of ${totalItems} publications`;
    }
}

// Export functionality for individual publications
function initPublicationExport() {
    const exportButtons = document.querySelectorAll('.export-btn');
    
    exportButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const publicationItem = this.closest('.publication-item');
            exportPublication(publicationItem);
        });
    });
}

function exportPublication(item) {
    const title = item.querySelector('.publication-title').textContent;
    const authors = item.querySelector('.authors').textContent.replace(/.*:\s*/, '');
    const year = item.querySelector('.year').textContent.replace(/.*:\s*/, '');
    
    // Create citation text
    const citation = `${authors} (${year}). ${title}.`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(citation).then(() => {
            showNotification('Citation copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Citation copied to clipboard!');
    }
}

// Show notification function
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Debounce function (if not already in your main JS)
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

// Initialize publications page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the publications page
    if (document.querySelector('.publications-page')) {
        initPublicationsPage();
        initPublicationExport();
        
        // Update stats on load
        setTimeout(updatePublicationStats, 100);
    }
});

// Make functions available globally if needed
if (typeof window !== 'undefined') {
    window.PublicationsPageJS = {
        initPublicationsPage,
        initPublicationSearch,
        initPublicationFilters,
        initViewToggle,
        animateVisiblePublications,
        exportPublication
    };
}

// Team Page Specific JavaScript Functions
// Add these functions to your existing script.js file

function initTeamFiltering() {
    const filterButtons = document.querySelectorAll('.team-nav .nav-btn');
    const teamCategories = document.querySelectorAll('.team-category');
    
    if (filterButtons.length === 0 || teamCategories.length === 0) {
        return; // Exit if elements don't exist (not on team page)
    }

    // Initially show all categories
    showAllCategories();

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter team categories
            filterTeamCategories(category);
            
            // Smooth scroll to team section after filtering
            setTimeout(() => {
                const teamSection = document.querySelector('.team-section');
                if (teamSection) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = teamSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });
    });
}

function filterTeamCategories(category) {
    const teamCategories = document.querySelectorAll('.team-category');
    
    teamCategories.forEach(categorySection => {
        const categoryData = categorySection.getAttribute('data-category');
        
        if (category === 'all' || categoryData === category) {
            categorySection.style.display = 'block';
            
            // Add animation class
            categorySection.classList.remove('fade-out');
            categorySection.classList.add('fade-in');
            
            // Animate member cards within the category
            const memberCards = categorySection.querySelectorAll('.member-card');
            memberCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        } else {
            categorySection.classList.remove('fade-in');
            categorySection.classList.add('fade-out');
            
            // Hide after animation
            setTimeout(() => {
                categorySection.style.display = 'none';
            }, 300);
        }
    });
}

function showAllCategories() {
    const teamCategories = document.querySelectorAll('.team-category');
    
    teamCategories.forEach(categorySection => {
        categorySection.style.display = 'block';
        categorySection.classList.add('fade-in');
        
        // Animate member cards
        const memberCards = categorySection.querySelectorAll('.member-card');
        memberCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 50);
        });
    });
}

// Enhanced member card interactions
function initMemberCardInteractions() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // Add hover effect for social links
        const socialLinks = card.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Add click effect for cards
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on social links
            if (!e.target.closest('.social-link')) {
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 200);
            }
        });
        
        // Keyboard navigation support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize team page functionality
function initTeamPage() {
    initTeamFiltering();
    initMemberCardInteractions();
    
    // Add scroll animations for team sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe team category headers
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        observer.observe(header);
    });
}

// Update the main DOMContentLoaded event listener
// Add this to your existing DOMContentLoaded function:

document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization functions
    initMobileNavigation();
    initSmoothScrolling();
    initBackToTop();
    initScrollEffects();
    initNewsCarousel();
    initFormValidation();
    initLazyLoading();
    initAccessibility();
    
    // Add team page initialization
    initTeamPage();
});

// CSS classes for animations (add these to your CSS file)
/*
.fade-in {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-out {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.member-card {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.member-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.member-card.clicked {
    transform: scale(0.98);
    transition: transform 0.2s ease;
}

.category-header {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.category-header.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.team-nav .nav-btn {
    transition: all 0.3s ease;
}

.team-nav .nav-btn:hover {
    transform: translateY(-2px);
}

.team-nav .nav-btn.active {
    transform: scale(1.05);
}
*/


// Contact Page Specific JavaScript
// Add this to your existing script.js file

// Initialize contact page functionality
function initContactPage() {
    if (!document.querySelector('.contact')) return; // Only run on contact page
    
    initContactAnimations();
    initContactInteractions();
    initMapIntegration();
    initCopyToClipboard();
}

// Animate contact items on scroll
function initContactAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    if (contactItems.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for each contact item
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 200);
                    contactObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        contactItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease-out';
            contactObserver.observe(item);
        });
    }
}

// Add hover effects and click interactions
function initContactInteractions() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Add click to copy functionality for phone and email
        const emailLink = item.querySelector('a[href^="mailto:"]');
        const phoneLink = item.querySelector('a[href^="tel:"]');
        
        if (emailLink || phoneLink) {
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', function(e) {
                if (e.target.tagName !== 'A') {
                    const link = this.querySelector('a');
                    if (link) {
                        // For mobile devices, trigger the link
                        if (window.innerWidth <= 768) {
                            link.click();
                        } else {
                            // For desktop, copy to clipboard
                            const text = emailLink ? 
                                emailLink.textContent : 
                                phoneLink ? phoneLink.textContent : '';
                            copyToClipboard(text, this);
                        }
                    }
                }
            });
        }
    });
}

// Copy to clipboard functionality
function initCopyToClipboard() {
    // Add copy buttons to contact info
    const contactTexts = document.querySelectorAll('.contact-text');
    
    contactTexts.forEach(contactText => {
        const link = contactText.querySelector('a[href^="mailto:"], a[href^="tel:"]');
        
        if (link && window.innerWidth > 768) {
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.className = 'copy-btn';
            copyBtn.title = 'Copy to clipboard';
            copyBtn.setAttribute('aria-label', 'Copy to clipboard');
            
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(link.textContent, this);
            });
            
            contactText.style.position = 'relative';
            contactText.appendChild(copyBtn);
        }
    });
}

// Copy text to clipboard with feedback
function copyToClipboard(text, element) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern async clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(element, 'Copied!');
        }).catch(() => {
            fallbackCopyToClipboard(text, element);
        });
    } else {
        fallbackCopyToClipboard(text, element);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text, element) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(element, 'Copied!');
    } catch (err) {
        showCopyFeedback(element, 'Copy failed');
    }
    
    document.body.removeChild(textArea);
}

// Show copy feedback
function showCopyFeedback(element, message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.className = 'copy-feedback';
    feedback.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: #2c3e50;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const parent = element.closest('.contact-item') || element.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(feedback);
    
    // Trigger animation
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

// Optional: Google Maps integration
function initMapIntegration() {
    // You can add Google Maps integration here if needed
    // This is a placeholder for future map functionality
    const addressElement = document.querySelector('address');
    
    if (addressElement) {
        // Add click handler to open in maps
        addressElement.addEventListener('click', function() {
            const address = 'IIT Gandhinagar, Palaj, Gandhinagar, Gujarat 382355';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
        
        // Style cursor
        addressElement.style.cursor = 'pointer';
        addressElement.title = 'Click to open in Google Maps';
    }
}

// Add contact page initialization to your main DOMContentLoaded event
// Update your existing DOMContentLoaded event listener to include:
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initialization code ...
    initContactPage(); // Add this line
});

// CSS styles to add to your stylesheet (add these to styles.css)
const contactPageStyles = `
/* Contact Page Enhancements */
.contact-item {
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 1.5rem;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 1.5rem;
}

.contact-item.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.contact-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.contact-text {
    position: relative;
}

.copy-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    color: #7f8c8d;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
    opacity: 0;
}

.contact-item:hover .copy-btn {
    opacity: 1;
}

.copy-btn:hover {
    background: #ecf0f1;
    color: #2c3e50;
}

.copy-feedback {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
    .copy-btn {
        display: none;
    }
    
    .contact-item {
        margin-bottom: 1rem;
        padding: 1rem;
    }
}

/* Accessibility improvements */
.contact-item:focus-within {
    outline: 2px solid #3498db;
    outline-offset: 2px;
}

address {
    transition: color 0.3s ease;
}

address:hover {
    color: #3498db;
}
`;

// Function to inject styles (call this once)
function injectContactStyles() {
    if (!document.querySelector('#contact-page-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'contact-page-styles';
        styleSheet.textContent = contactPageStyles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize styles
injectContactStyles();