// Problems Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const searchInput = document.getElementById('problemSearch');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const problemCards = document.querySelectorAll('.problem-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Initialize filters
    let currentFilters = {
        search: '',
        difficulty: '',
        category: '',
        sort: 'title'
    };

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            currentFilters.search = this.value.toLowerCase();
            applyFilters();
        }, 300));
    }

    // Difficulty filter
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', function() {
            currentFilters.difficulty = this.value;
            applyFilters();
        });
    }

    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFilters();
            updateCategoryButtons();
        });
    }

    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category || '';
            currentFilters.category = category;
            
            // Update UI
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (categoryFilter) {
                categoryFilter.value = category;
            }
            
            applyFilters();
        });
    });

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyFilters();
        });
    }

    function applyFilters() {
        let visibleCards = [];
        
        problemCards.forEach(card => {
            const title = card.querySelector('.problem-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.problem-description')?.textContent.toLowerCase() || '';
            const difficulty = card.dataset.difficulty || '';
            const category = card.dataset.category || '';
            const tags = card.dataset.tags || '';
            
            // Check search filter
            const searchMatch = !currentFilters.search || 
                title.includes(currentFilters.search) || 
                description.includes(currentFilters.search) ||
                tags.toLowerCase().includes(currentFilters.search);
            
            // Check difficulty filter
            const difficultyMatch = !currentFilters.difficulty || 
                difficulty.toLowerCase() === currentFilters.difficulty.toLowerCase();
            
            // Check category filter
            const categoryMatch = !currentFilters.category || 
                category.toLowerCase() === currentFilters.category.toLowerCase();
            
            if (searchMatch && difficultyMatch && categoryMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease-out forwards';
                visibleCards.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // Sort visible cards
        sortCards(visibleCards);
        
        // Update results count
        updateResultsCount(visibleCards.length);
        
        // Show empty state if no results
        showEmptyState(visibleCards.length === 0);
    }

    function sortCards(cards) {
        const container = document.querySelector('.problems-grid');
        if (!container) return;

        cards.sort((a, b) => {
            switch (currentFilters.sort) {
                case 'difficulty':
                    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
                    const aDiff = difficultyOrder[a.dataset.difficulty] || 0;
                    const bDiff = difficultyOrder[b.dataset.difficulty] || 0;
                    return aDiff - bDiff;
                
                case 'popularity':
                    const aPopularity = parseInt(a.dataset.submissions) || 0;
                    const bPopularity = parseInt(b.dataset.submissions) || 0;
                    return bPopularity - aPopularity;
                
                case 'title':
                default:
                    const aTitle = a.querySelector('.problem-title')?.textContent || '';
                    const bTitle = b.querySelector('.problem-title')?.textContent || '';
                    return aTitle.localeCompare(bTitle);
            }
        });

        // Reorder DOM elements
        cards.forEach(card => {
            container.appendChild(card);
        });
    }

    function updateCategoryButtons() {
        categoryBtns.forEach(btn => {
            const btnCategory = btn.dataset.category || '';
            btn.classList.toggle('active', btnCategory === currentFilters.category);
        });
    }

    function updateResultsCount(count) {
        let resultsInfo = document.querySelector('.results-count');
        if (!resultsInfo) {
            resultsInfo = document.createElement('div');
            resultsInfo.className = 'results-count';
            const filtersSection = document.querySelector('.problems-filters');
            if (filtersSection) {
                filtersSection.appendChild(resultsInfo);
            }
        }
        
        const total = problemCards.length;
        resultsInfo.textContent = `Showing ${count} of ${total} problems`;
    }

    function showEmptyState(show) {
        let emptyState = document.querySelector('.problems-empty');
        
        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'problems-empty';
            emptyState.innerHTML = `
                <i class="bi bi-search"></i>
                <h3>No problems found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn btn-primary mt-3" onclick="clearAllFilters()">
                    Clear All Filters
                </button>
            `;
            
            const grid = document.querySelector('.problems-grid');
            if (grid) {
                grid.parentNode.insertBefore(emptyState, grid.nextSibling);
            }
        } else if (!show && emptyState) {
            emptyState.remove();
        }
    }

    // Clear all filters
    window.clearAllFilters = function() {
        currentFilters = {
            search: '',
            difficulty: '',
            category: '',
            sort: 'title'
        };
        
        if (searchInput) searchInput.value = '';
        if (difficultyFilter) difficultyFilter.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (sortSelect) sortSelect.value = 'title';
        
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        
        applyFilters();
    };

    // Problem card interactions
    problemCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Track clicks for analytics
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) return;
            
            const problemId = this.dataset.problemId;
            const problemTitle = this.querySelector('.problem-title')?.textContent;
            
            // Store problem interaction data
            storeInteraction('problem_view', {
                problemId: problemId,
                title: problemTitle,
                timestamp: new Date().toISOString()
            });
        });
    });

    // Store interaction data for analytics
    function storeInteraction(event, data) {
        try {
            let interactions = JSON.parse(localStorage.getItem('problemInteractions') || '[]');
            interactions.push({ event, data });
            
            // Keep only last 100 interactions
            if (interactions.length > 100) {
                interactions = interactions.slice(-100);
            }
            
            localStorage.setItem('problemInteractions', JSON.stringify(interactions));
        } catch (error) {
            console.error('Failed to store interaction:', error);
        }
    }

    // Animate cards on load
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    problemCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Stagger animations
        setTimeout(() => {
            observer.observe(card);
        }, index * 100);
    });

    // Debounce function
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

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Focus search on Ctrl+F or Cmd+F
        if ((e.ctrlKey || e.metaKey) && e.key === 'f' && searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Clear filters on Escape
        if (e.key === 'Escape') {
            clearAllFilters();
        }
    });

    // Initialize on page load
    applyFilters();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .problem-card {
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        .search-input:focus {
            animation: searchFocus 0.3s ease-out;
        }
        
        @keyframes searchFocus {
            0% {
                box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
            }
        }
    `;
    document.head.appendChild(style);
});
