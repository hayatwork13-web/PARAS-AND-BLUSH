/* 
 * Paras Blush Beauty Salon - Main Script
 * Handles custom interactive features, dynamic opening hours, tab filters, and WhatsApp integration.
 * 
 * TO CHANGE THE PHONE NUMBER AND WHATSAPP NUMBER:
 * Just change the values in the SALON_CONTACT_CONFIG object below!
 * The script will automatically update all links, buttons, and text across the entire website.
 */

const SALON_CONTACT_CONFIG = {
  // The phone number shown to users on the website
  phoneDisplay: "+92 333 2757145",
  
  // The phone number used for WhatsApp links (only digits, including country code)
  whatsappNumber: "923332757145"
};

document.addEventListener('DOMContentLoaded', () => {
  // Automatically update all contact numbers and links in the HTML
  const updateContactNumbers = () => {
    // 1. Update WhatsApp links
    const waLinks = document.querySelectorAll('a[href*="wa.me"]');
    waLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('923332757343')) {
        link.setAttribute('href', href.replaceAll('923332757343', SALON_CONTACT_CONFIG.whatsappNumber));
      }
      if (href && href.includes('923332757145')) {
        link.setAttribute('href', href.replaceAll('923332757145', SALON_CONTACT_CONFIG.whatsappNumber));
      }
    });

    // 2. Update visible text numbers on the page dynamically
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.includes("+92 333 2757343")) {
        node.nodeValue = node.nodeValue.replaceAll("+92 333 2757343", SALON_CONTACT_CONFIG.phoneDisplay);
      }
      if (node.nodeValue.includes("+92 333 2757145")) {
        node.nodeValue = node.nodeValue.replaceAll("+92 333 2757145", SALON_CONTACT_CONFIG.phoneDisplay);
      }
    }
  };
  
  updateContactNumbers();

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Sticky Header Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close mobile menu on clicking any link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // Live Salon Opening Hours Status
  // Operating Hours: 11:00 AM to 8:30 PM (11:00 - 20:30) Every Day
  const statusContainer = document.getElementById('salon-status');
  if (statusContainer) {
    const checkSalonStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeDecimal = currentHour + currentMinute / 60;
      
      const openTime = 11.0; // 11:00 AM
      const closeTime = 20.5; // 8:30 PM
      
      if (currentTimeDecimal >= openTime && currentTimeDecimal < closeTime) {
        statusContainer.className = 'status-indicator status-open';
        statusContainer.innerHTML = '<i data-lucide="circle-dot"></i> Open Now (Closes at 8:30 PM)';
      } else {
        statusContainer.className = 'status-indicator status-closed';
        statusContainer.innerHTML = '<i data-lucide="circle-off"></i> Closed (Opens tomorrow at 11:00 AM)';
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };
    checkSalonStatus();
    setInterval(checkSalonStatus, 60000); // Check status every minute
  }

  // Interactive Services Filter (Tabs)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Hero Interactive Experience Planner
  const plannerItems = document.querySelectorAll('.planner-item');
  const totalDisplay = document.getElementById('planner-total');
  const selectedCountDisplay = document.getElementById('planner-count');
  const heroPlannerBtn = document.getElementById('hero-planner-btn');

  let selectedServices = [];

  plannerItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
      const serviceName = item.getAttribute('data-name');
      const servicePrice = parseInt(item.getAttribute('data-price'));

      if (item.classList.contains('active')) {
        selectedServices.push({ name: serviceName, price: servicePrice });
      } else {
        selectedServices = selectedServices.filter(s => s.name !== serviceName);
      }

      updatePlannerUI();
    });
  });

  function updatePlannerUI() {
    let total = 0;
    selectedServices.forEach(s => total += s.price);

    if (totalDisplay) {
      totalDisplay.textContent = `PKR ${total.toLocaleString()}`;
    }
    if (selectedCountDisplay) {
      selectedCountDisplay.textContent = selectedServices.length;
    }

    if (heroPlannerBtn) {
      if (selectedServices.length > 0) {
        heroPlannerBtn.disabled = false;
        heroPlannerBtn.style.opacity = '1';
        heroPlannerBtn.style.pointerEvents = 'auto';
        
        // Generate WhatsApp link dynamically
        const servicesText = selectedServices.map(s => `• ${s.name} (PKR ${s.price.toLocaleString()})`).join('%0A');
        const waMessage = `Hello Paras Blush Salon, I would like to book the following personalized package:%0A%0A${servicesText}%0A%0ATotal Price: PKR ${total.toLocaleString()}%0A%0APlease let me know your availability.`;
        heroPlannerBtn.setAttribute('href', `https://wa.me/${SALON_CONTACT_CONFIG.whatsappNumber}?text=${waMessage}`);
      } else {
        heroPlannerBtn.disabled = true;
        heroPlannerBtn.style.opacity = '0.5';
        heroPlannerBtn.style.pointerEvents = 'none';
        heroPlannerBtn.setAttribute('href', `https://wa.me/${SALON_CONTACT_CONFIG.whatsappNumber}?text=Hello Paras Blush Salon, I would like to book a luxury beauty consultation.`);
      }
    }
  }

  // Custom Interactive Budget / Custom Package Estimator (Section 5 area)
  const estimatorLabels = document.querySelectorAll('.estimator-label-item');
  const estimatorTotal = document.getElementById('estimator-total');
  const estimatorList = document.getElementById('estimator-selected-list');
  const estimatorBtn = document.getElementById('estimator-booking-btn');

  let estimatorSelected = [];

  estimatorLabels.forEach(label => {
    label.addEventListener('click', () => {
      label.classList.toggle('active');
      const name = label.getAttribute('data-name');
      const price = parseInt(label.getAttribute('data-price'));

      const checkbox = label.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      if (label.classList.contains('active')) {
        estimatorSelected.push({ name, price });
      } else {
        estimatorSelected = estimatorSelected.filter(item => item.name !== name);
      }

      updateEstimatorUI();
    });
  });

  function updateEstimatorUI() {
    let total = 0;
    
    // Clear list
    if (estimatorList) {
      estimatorList.innerHTML = '';
    }

    estimatorSelected.forEach(item => {
      total += item.price;
      
      if (estimatorList) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span><strong>PKR ${item.price.toLocaleString()}</strong>`;
        estimatorList.appendChild(li);
      }
    });

    if (estimatorSelected.length === 0 && estimatorList) {
      estimatorList.innerHTML = '<li style="color: #6F6F6F; font-style: italic;">No services selected. Choose services on the left.</li>';
    }

    if (estimatorTotal) {
      estimatorTotal.textContent = `PKR ${total.toLocaleString()}`;
    }

    if (estimatorBtn) {
      if (estimatorSelected.length > 0) {
        const servicesText = estimatorSelected.map(s => `• ${s.name} (PKR ${s.price.toLocaleString()})`).join('%0A');
        const waMessage = `Hello Paras Blush Salon, I customized my own Beauty & Bridal Package:%0A%0A${servicesText}%0A%0ATotal Estimated Price: PKR ${total.toLocaleString()}%0A%0AI'd like to book an appointment for this customized treatment package.`;
        estimatorBtn.setAttribute('href', `https://wa.me/${SALON_CONTACT_CONFIG.whatsappNumber}?text=${waMessage}`);
        estimatorBtn.style.opacity = '1';
        estimatorBtn.style.pointerEvents = 'auto';
      } else {
        estimatorBtn.setAttribute('href', '#');
        estimatorBtn.style.opacity = '0.6';
        estimatorBtn.style.pointerEvents = 'none';
      }
    }
  }

  // Initialize both package managers
  updatePlannerUI();
  updateEstimatorUI();

  // Contact Form Submission Handler
  const contactForm = document.getElementById('salon-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const service = document.getElementById('form-service').value;
      const date = document.getElementById('form-date').value;
      const notes = document.getElementById('form-notes').value.trim();

      if (!name || !phone || !service || !date) {
        alert('Please fill out all required fields.');
        return;
      }

      // Format WhatsApp Pre-filled text with details
      const waText = `Hello Paras Blush Salon, I would like to book an appointment with the following details:%0A%0A` +
                     `• *Name:* ${encodeURIComponent(name)}%0A` +
                     `• *Phone:* ${encodeURIComponent(phone)}%0A` +
                     `• *Service:* ${encodeURIComponent(service)}%0A` +
                     `• *Preferred Date:* ${encodeURIComponent(date)}%0A` +
                     `• *Message/Notes:* ${encodeURIComponent(notes || 'No specific notes')}%0A%0A` +
                     `Please confirm if this slot or time is available for booking. Thank you!`;

      const whatsappURL = `https://wa.me/${SALON_CONTACT_CONFIG.whatsappNumber}?text=${waText}`;
      
      // Redirect to WhatsApp
      window.open(whatsappURL, '_blank');
      
      // Success styling/feedback
      const formSubmitBtn = contactForm.querySelector('button[type="submit"]');
      if (formSubmitBtn) {
        const originalText = formSubmitBtn.innerHTML;
        formSubmitBtn.innerHTML = '<i data-lucide="check"></i> Redirecting to WhatsApp...';
        formSubmitBtn.style.background = '#2E7D32';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        setTimeout(() => {
          formSubmitBtn.innerHTML = originalText;
          formSubmitBtn.style.background = '';
          contactForm.reset();
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 5000);
      }
    });
  }

  // Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if (revealElements.length > 0) {
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Unobserve after animation runs once
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }
});
