// Languages Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Languages page loaded');
    
    // Initialize language cards with enhanced interactions
    initializeLanguageCards();
    
    // Initialize comparison table interactions
    initializeComparisonTable();
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize language filtering if needed
    initializeLanguageFiltering();
});

/**
 * Initialize language card interactions
 */
function initializeLanguageCards() {
    const languageCards = document.querySelectorAll('.language-card');
    
    languageCards.forEach(card => {
        // Add click animation
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button
            if (e.target.closest('.language-btn')) return;
            
            // Add click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            // Could add sound effect here if desired
            console.log('Hovering over', card.dataset.language);
        });
        
        // Track language interest
        const languageBtn = card.querySelector('.language-btn');
        if (languageBtn) {
            languageBtn.addEventListener('click', function(e) {
                const language = card.dataset.language;
                trackLanguageInterest(language);
            });
        }
    });
}

/**
 * Track user interest in specific languages
 */
function trackLanguageInterest(language) {
    console.log(`User interested in ${language}`);
    
    // Store in localStorage for analytics
    const interests = JSON.parse(localStorage.getItem('languageInterests') || '[]');
    const timestamp = new Date().toISOString();
    
    interests.push({
        language: language,
        timestamp: timestamp
    });
    
    // Keep only last 50 interactions
    if (interests.length > 50) {
        interests.splice(0, interests.length - 50);
    }
    
    localStorage.setItem('languageInterests', JSON.stringify(interests));
}

/**
 * Initialize comparison table interactions
 */
function initializeComparisonTable() {
    const table = document.querySelector('.comparison-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        row.addEventListener('click', function() {
            // Highlight selected row
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
            
            // Get language name from the row
            const languageName = row.querySelector('td strong');
            if (languageName) {
                const language = languageName.textContent.toLowerCase();
                console.log(`Selected ${language} from comparison table`);
                
                // Optionally scroll to the corresponding card
                scrollToLanguageCard(language);
            }
        });
    });
}

/**
 * Scroll to specific language card
 */
function scrollToLanguageCard(language) {
    const card = document.querySelector(`[data-language="${language}"]`);
    if (card) {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Add temporary highlight
        card.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 2000);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize language filtering functionality
 */
function initializeLanguageFiltering() {
    // Create filter buttons if needed
    createFilterButtons();
    
    // Initialize search functionality
    initializeLanguageSearch();
}

/**
 * Create filter buttons for language categories
 */
function createFilterButtons() {
    const container = document.querySelector('.languages-content .container');
    if (!container) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'language-filters mb-4 text-center';
    filterContainer.innerHTML = `
        <div class="btn-group" role="group" aria-label="Language filters">
            <button type="button" class="btn btn-outline-primary active" data-filter="all">
                All Languages
            </button>
            <button type="button" class="btn btn-outline-primary" data-filter="beginner">
                Beginner Friendly
            </button>
            <button type="button" class="btn btn-outline-primary" data-filter="web">
                Web Development
            </button>
            <button type="button" class="btn btn-outline-primary" data-filter="systems">
                Systems Programming
            </button>
        </div>
    `;
    
    // Insert before the languages grid
    const languagesGrid = container.querySelector('.languages-grid');
    if (languagesGrid) {
        container.insertBefore(filterContainer, languagesGrid);
        
        // Add filter functionality
        const filterButtons = filterContainer.querySelectorAll('[data-filter]');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter language cards
                filterLanguageCards(filter);
            });
        });
    }
}

/**
 * Filter language cards based on category
 */
function filterLanguageCards(filter) {
    const cards = document.querySelectorAll('.language-card');
    
    cards.forEach(card => {
        const language = card.dataset.language;
        let shouldShow = true;
        
        if (filter !== 'all') {
            switch (filter) {
                case 'beginner':
                    shouldShow = ['python', 'java'].includes(language);
                    break;
                case 'web':
                    shouldShow = ['python', 'java', 'csharp', 'cpp'].includes(language);
                    break;
                case 'systems':
                    shouldShow = ['c', 'cpp', 'java'].includes(language);
                    shouldShow = ['c', 'cpp', 'rust', 'go'].includes(language);
                    break;
                default:
                    shouldShow = true;
            }
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Initialize language search functionality
 */
function initializeLanguageSearch() {
    const container = document.querySelector('.languages-content .container');
    if (!container) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'language-search mb-4';
    searchContainer.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search languages..." id="languageSearch">
                    <button class="btn btn-outline-secondary" type="button" id="clearSearch">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert at the top of the content
    const firstChild = container.firstElementChild;
    container.insertBefore(searchContainer, firstChild);
    
    // Add search functionality
    const searchInput = document.getElementById('languageSearch');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchLanguages(searchTerm);
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchLanguages('');
        });
    }
}

/**
 * Search languages by name or features
 */
function searchLanguages(searchTerm) {
    const cards = document.querySelectorAll('.language-card');
    
    cards.forEach(card => {
        const languageName = card.querySelector('.language-name').textContent.toLowerCase();
        const languageDesc = card.querySelector('.language-description').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = languageName.includes(searchTerm) || 
                       languageDesc.includes(searchTerm) ||
                       features.some(feature => feature.includes(searchTerm));
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Add CSS animations
 */
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .comparison-table tbody tr.selected {
            background: rgba(102, 126, 234, 0.1) !important;
            border-left: 4px solid #667eea;
        }
        
        .language-card {
            animation: fadeIn 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addAnimations();
