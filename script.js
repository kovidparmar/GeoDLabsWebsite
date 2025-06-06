/**
 * GeoD Labs Website JavaScript
 * IIT Gandhinagar
 * 
 * This file contains interactive functionality for the GeoD Labs website,
 * including navigation, animations, filtering for publications/projects,
 * and other user experience enhancements.
 */

// Wait for DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // ---- Configuration ----
  const config = {
    navbarHeight: 80, // Height of navbar in pixels for scroll offset
    scrollThreshold: 50, // Pixels scrolled before header style changes
    scrollDuration: 1000, // Duration of smooth scroll in milliseconds
    publicationsPerPage: 10, // Number of publications to show per page
    animationDelay: 50, // Delay between each item animation in milliseconds
  };

  // ---- DOM Elements Cache ----
  const elements = {
    header: document.querySelector('header'),
    mobileNavToggle: document.querySelector('.mobile-nav-toggle'),
    navMenu: document.querySelector('nav ul'),
    navLinks: document.querySelectorAll('a[href^="#"]'),
    publicationFilters: document.querySelectorAll('.publication-filter'),
    publicationItems: document.querySelectorAll('.publication-item'),
    researchProjects: document.querySelectorAll('.research-project'),
    teamMembers: document.querySelectorAll('.team-member'),
    contactForm: document.querySelector('#contact-form'),
    backToTopBtn: document.querySelector('.back-to-top'),
    searchInput: document.querySelector('#search-input'),
    darkModeToggle: document.querySelector('#dark-mode-toggle'),
  };

  // ---- Mobile Navigation ----
  function initMobileNavigation() {
    if (!elements.mobileNavToggle || !elements.navMenu) return;
    
    elements.mobileNavToggle.addEventListener('click', () => {
      elements.navMenu.classList.toggle('active');
      elements.mobileNavToggle.setAttribute(
        'aria-expanded', 
        elements.navMenu.classList.contains('active')
      );
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('nav') && 
          !e.target.closest('.mobile-nav-toggle') && 
          elements.navMenu.classList.contains('active')) {
        elements.navMenu.classList.remove('active');
        elements.mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Smooth Scrolling ----
  function initSmoothScrolling() {
    if (!elements.navLinks.length) return;

    elements.navLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate position accounting for header height
          const headerHeight = elements.header ? elements.header.offsetHeight : config.navbarHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (elements.navMenu && elements.navMenu.classList.contains('active')) {
            elements.navMenu.classList.remove('active');
            if (elements.mobileNavToggle) {
              elements.mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
          }
          
          // Update URL hash without scrolling
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ---- Header Scroll Effect ----
  function initHeaderScrollEffect() {
    if (!elements.header) return;
    
    // Create throttle function to limit scroll event firing
    const throttle = (callback, delay) => {
      let lastCall = 0;
      return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return callback(...args);
      };
    };

    // Apply header style changes on scroll with throttling
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > config.scrollThreshold) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    }, 100));
  }

  // ---- Publication Filtering ----
  function initPublicationFilters() {
    if (!elements.publicationFilters.length || !elements.publicationItems.length) return;
    
    elements.publicationFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Remove active class from all filters
        elements.publicationFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Show/hide publications based on filter
        elements.publicationItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // Match this with CSS transition time
          }
        });
      });
    });
  }

  // ---- Search Functionality ----
  function initSearchFunctionality() {
    if (!elements.searchInput) return;
    
    elements.searchInput.addEventListener('input', debounce(function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      // If we have publications, search through them
      if (elements.publicationItems.length) {
        elements.publicationItems.forEach(item => {
          const title = item.querySelector('.publication-title')?.textContent.toLowerCase() || '';
          const authors = item.querySelector('.publication-authors')?.textContent.toLowerCase() || '';
          const abstract = item.querySelector('.publication-abstract')?.textContent.toLowerCase() || '';
          
          if (title.includes(searchTerm) || authors.includes(searchTerm) || abstract.includes(searchTerm)) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; }, 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      }
      
      // If we have research projects, search through them too
      if (elements.researchProjects.length) {
        elements.researchProjects.forEach(project => {
          const title = project.querySelector('h3')?.textContent.toLowerCase() || '';
          const description = project.querySelector('p')?.textContent.toLowerCase() || '';
          
          if (title.includes(searchTerm) || description.includes(searchTerm)) {
            project.style.display = 'block';
            setTimeout(() => { project.style.opacity = '1'; }, 10);
          } else {
            project.style.opacity = '0';
            setTimeout(() => { project.style.display = 'none'; }, 300);
          }
        });
      }
    }, 300));
  }

  // ---- Scroll Animation ----
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }, index * config.animationDelay);
        }
      });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(el => observer.observe(el));
  }

  // ---- Back to Top Button ----
  function initBackToTopButton() {
    if (!elements.backToTopBtn) return;
    
    // Create the button if it doesn't exist
    if (!elements.backToTopBtn) {
      const button = document.createElement('button');
      button.className = 'back-to-top';
      button.innerHTML = '<span class="arrow-up">↑</span>';
      button.setAttribute('aria-label', 'Back to top');
      document.body.appendChild(button);
      elements.backToTopBtn = button;
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > window.innerHeight / 2) {
        elements.backToTopBtn.classList.add('visible');
      } else {
        elements.backToTopBtn.classList.remove('visible');
      }
    }, 200));
    
    // Scroll to top when clicked
    elements.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---- Dark Mode Toggle ----
  function initDarkModeToggle() {
    if (!elements.darkModeToggle) return;
    
    // Check for saved user preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark-mode');
      elements.darkModeToggle.setAttribute('aria-pressed', 'true');
    }
    
    // Toggle theme on button click
    elements.darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      
      const isDarkMode = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      elements.darkModeToggle.setAttribute('aria-pressed', isDarkMode.toString());
    });
  }

  // ---- Contact Form Validation ----
  function initContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = this.querySelector('[name="name"]');
      const emailInput = this.querySelector('[name="email"]');
      const messageInput = this.querySelector('[name="message"]');
      let isValid = true;
      
      // Simple form validation
      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      } else if (nameInput) {
        clearError(nameInput);
      }
      
      if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
          showError(emailInput, 'Please enter a valid email address');
          isValid = false;
        } else {
          clearError(emailInput);
        }
      }
      
      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message');
        isValid = false;
      } else if (messageInput) {
        clearError(messageInput);
      }
      
      // If form is valid, submit it (in a real implementation, you would send data to server)
      if (isValid) {
        const submitButton = this.querySelector('[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
        }
        
        // Simulate form submission - replace with actual API call
        setTimeout(() => {
          this.reset();
          showFormSuccess();
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
          }
        }, 1500);
      }
    });
    
    function showError(input, message) {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
          formGroup.appendChild(errorElement);
        }
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('invalid');
      }
    }
    
    function clearError(input) {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
          formGroup.removeChild(errorElement);
        }
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('invalid');
      }
    }
    
    function showFormSuccess() {
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Thank you! Your message has been sent successfully.';
      
      elements.contactForm.parentNode.insertBefore(successMessage, elements.contactForm.nextSibling);
      
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }
  }

  // ---- Image Gallery Lightbox ----
  function initImageLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (!galleryImages.length) return;
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-prev" aria-label="Previous image">&lt;</button>
        <button class="lightbox-next" aria-label="Next image">&gt;</button>
        <div class="lightbox-image-container">
          <img class="lightbox-image" src="" alt="">
        </div>
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Open lightbox when gallery image is clicked
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        currentIndex = index;
        const imgSrc = this.getAttribute('data-full-img') || this.src;
        const caption = this.getAttribute('alt') || '';
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        
        // Set focus to the lightbox for keyboard navigation
        lightbox.setAttribute('tabindex', '-1');
        lightbox.focus();
      });
    });
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    lightbox.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });
    
    function showPrevImage() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    }
    
    function showNextImage() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightboxImage();
    }
    
    function updateLightboxImage() {
      const img = galleryImages[currentIndex];
      const imgSrc = img.getAttribute('data-full-img') || img.src;
      const caption = img.getAttribute('alt') || '';
      
      // Fade effect
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightboxImg.style.opacity = '1';
      }, 300);
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
      
      // Return focus to the clicked image
      if (galleryImages[currentIndex]) {
        galleryImages[currentIndex].focus();
      }
    }
  }

  // ---- Team Member Details Modal ----
  function initTeamMemberModals() {
    if (!elements.teamMembers.length) return;
    
    elements.teamMembers.forEach(member => {
      member.addEventListener('click', function() {
        const memberId = this.getAttribute('data-member-id');
        if (!memberId) return;
        
        // You could fetch member details from an API or use data attributes
        const memberDetails = {
          name: this.querySelector('h3')?.textContent || 'Team Member',
          role: this.querySelector('.member-role')?.textContent || 'Researcher',
          bio: this.getAttribute('data-bio') || 'Biography information will be added soon.',
          publications: this.getAttribute('data-publications')?.split('|') || [],
          email: this.getAttribute('data-email') || '',
          website: this.getAttribute('data-website') || '',
          image: this.querySelector('img')?.src || ''
        };
        
        showMemberModal(memberDetails);
      });
    });
    
    function showMemberModal(details) {
      // Create modal if it doesn't exist
      let modal = document.getElementById('member-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'member-modal';
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-body">
              <div class="member-profile">
                <img src="" alt="" class="member-image">
                <div class="member-info">
                  <h2 class="member-name"></h2>
                  <p class="member-role"></p>
                  <div class="member-contacts"></div>
                </div>
              </div>
              <div class="member-bio"></div>
              <div class="member-publications">
                <h3>Selected Publications</h3>
                <ul class="publications-list"></ul>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal events
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
        
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      }
      
      // Update modal with member details
      modal.querySelector('.member-name').textContent = details.name;
      modal.querySelector('.member-role').textContent = details.role;
      modal.querySelector('.member-bio').textContent = details.bio;
      
      const memberImage = modal.querySelector('.member-image');
      memberImage.src = details.image;
      memberImage.alt = details.name;
      
      // Add contact information
      const contactsContainer = modal.querySelector('.member-contacts');
      contactsContainer.innerHTML = '';
      
      if (details.email) {
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${details.email}`;
        emailLink.className = 'member-contact email';
        emailLink.innerHTML = `<span class="icon">✉</span> ${details.email}`;
        contactsContainer.appendChild(emailLink);
      }
      
      if (details.website) {
        const websiteLink = document.createElement('a');
        websiteLink.href = details.website;
        websiteLink.target = '_blank';
        websiteLink.rel = 'noopener noreferrer';
        websiteLink.className = 'member-contact website';
        websiteLink.innerHTML = `<span class="icon">🔗</span> Personal Website`;
        contactsContainer.appendChild(websiteLink);
      }
      
      // Add publications
      const publicationsList = modal.querySelector('.publications-list');
      publicationsList.innerHTML = '';
      
      if (details.publications.length > 0) {
        details.publications.forEach(pub => {
          if (pub.trim()) {
            const li = document.createElement('li');
            li.textContent = pub;
            publicationsList.appendChild(li);
          }
        });
        modal.querySelector('.member-publications').style.display = 'block';
      } else {
        modal.querySelector('.member-publications').style.display = 'none';
      }
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }

  // ---- Dataset Visualization ----
  function initDatasetVisualizations() {
    const datasetItems = document.querySelectorAll('.dataset-item');
    if (!datasetItems.length) return;
    
    datasetItems.forEach(item => {
      const visualizeBtn = item.querySelector('.visualize-btn');
      if (visualizeBtn) {
        visualizeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const datasetId = this.closest('.dataset-item').getAttribute('data-dataset-id');
          
          // In a real implementation, fetch dataset data from an API
          // For demo, we'll use placeholder data
          const demoData = generateDemoData(datasetId);
          
          // Create or update visualization container
          let visContainer = item.querySelector('.visualization-container');
          if (!visContainer) {
            visContainer = document.createElement('div');
            visContainer.className = 'visualization-container';
            item.appendChild(visContainer);
          }
          
          // Create visualization (in a real implementation, use appropriate library like D3.js)
          renderVisualization(visContainer, demoData);
          
          // Toggle button text
          this.textContent = visContainer.style.display !== 'none' ? 'Hide Visualization' : 'Visualize Data';
        });
      }
    });
    
    function generateDemoData(datasetId) {
      // Generate different sample data based on dataset ID
      const dataPoints = 12;
      const data = [];
      
      for (let i = 0; i < dataPoints; i++) {
        data.push({
          label: `Sample ${i+1}`,
          value: Math.floor(Math.random() * 100)
        });
      }
      
      return data;
    }
    
    function renderVisualization(container, data) {
      // Simple bar chart rendering
      // In a real implementation, use D3.js or another visualization library
      
      // Clear previous visualization
      container.innerHTML = '';
      
      const chart = document.createElement('div');
      chart.className = 'simple-bar-chart';
      
      // Find max value for scaling
      const maxValue = Math.max(...data.map(d => d.value));
      
      data.forEach(item => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        
        const barInner = document.createElement('div');
        barInner.className = 'bar-inner';
        barInner.style.height = `${(item.value / maxValue) * 100}%`;
        barInner.setAttribute('title', `${item.label}: ${item.value}`);
        
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = item.label;
        
        bar.appendChild(barInner);
        bar.appendChild(barLabel);
        chart.appendChild(bar);
      });
      
      container.appendChild(chart);
      
      // Add note about the visualization
      const note = document.createElement('p');
      note.className = 'visualization-note';
      note.textContent = 'This is a sample visualization. In a production environment, connect to actual dataset API.';
      container.appendChild(note);
      
      // Toggle visibility
      if (container.style.display === 'none') {
        container.style.display = 'block';
      } else {
        container.style.display = 'none';
      }
    }
  }

  // ---- Utility Functions ----
  
  // Debounce function to limit how often a function runs
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Throttle function to limit rate of function execution
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ---- Initialize All Features ----
  initMobileNavigation();
  initSmoothScrolling();
  initHeaderScrollEffect();
  initPublicationFilters();
  initSearchFunctionality();
  initScrollAnimations();
  initBackToTopButton();
  initDarkModeToggle();
  initContactForm();
  initImageLightbox();
  initTeamMemberModals();
  initDatasetVisualizations();

  // ---- Handle Initial Page State ----
  
  // If page loaded with a hash, scroll to that section
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      // Slight delay to ensure page is fully loaded
      setTimeout(() => {
        const headerHeight = elements.header ? elements.header.offsetHeight : config.navbarHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }

  // Log that initialization is complete
  console.log('GeoD Labs website scripts initialized');
});