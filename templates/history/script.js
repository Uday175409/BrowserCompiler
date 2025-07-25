// History Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const languageFilter = document.getElementById('languageFilter');
    const submissionItems = document.querySelectorAll('.submission-item');

    function filterSubmissions() {
        const selectedStatus = statusFilter ? statusFilter.value : '';
        const selectedLanguage = languageFilter ? languageFilter.value : '';
        
        submissionItems.forEach(item => {
            const itemStatus = item.dataset.status || '';
            const itemLanguage = item.dataset.language || '';
            
            const statusMatch = !selectedStatus || itemStatus.toLowerCase().includes(selectedStatus.toLowerCase());
            const languageMatch = !selectedLanguage || itemLanguage.toLowerCase() === selectedLanguage.toLowerCase();
            
            if (statusMatch && languageMatch) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.3s ease-out forwards';
            } else {
                item.style.display = 'none';
            }
        });

        // Update results count
        const visibleItems = Array.from(submissionItems).filter(item => item.style.display !== 'none');
        updateResultsCount(visibleItems.length);
    }

    function updateResultsCount(count) {
        let resultCountElement = document.getElementById('resultsCount');
        if (!resultCountElement) {
            resultCountElement = document.createElement('small');
            resultCountElement.id = 'resultsCount';
            resultCountElement.className = 'text-muted';
            const filterSection = document.querySelector('.history-filter-section');
            if (filterSection) {
                filterSection.appendChild(resultCountElement);
            }
        }
        resultCountElement.textContent = `Showing ${count} submissions`;
    }

    // Attach filter event listeners
    if (statusFilter) {
        statusFilter.addEventListener('change', filterSubmissions);
    }
    if (languageFilter) {
        languageFilter.addEventListener('change', filterSubmissions);
    }

    // Toggle code visibility
    window.toggleCode = function(submissionIndex, codeIndex) {
        const codeContainer = document.getElementById(`code-${submissionIndex}-${codeIndex}`);
        const toggleButton = event.target.closest('button');
        
        if (codeContainer) {
            if (codeContainer.style.display === 'none' || !codeContainer.style.display) {
                codeContainer.style.display = 'block';
                codeContainer.classList.add('history-code-slide-down');
                toggleButton.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Hide Code';
            } else {
                codeContainer.style.display = 'none';
                codeContainer.classList.remove('history-code-slide-down');
                toggleButton.innerHTML = '<i class="bi bi-code-slash me-1"></i>View Code';
            }
        }
    };

    // Copy code functionality
    window.copyCode = function(submissionIndex, codeIndex) {
        const codeElement = document.getElementById(`code-content-${submissionIndex}-${codeIndex}`);
        const copyButton = event.target.closest('button');
        
        if (codeElement) {
            const codeText = codeElement.textContent || codeElement.innerText;
            
            // Use modern clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(codeText).then(() => {
                    showCopySuccess(copyButton);
                }).catch(() => {
                    fallbackCopyTextToClipboard(codeText, copyButton);
                });
            } else {
                fallbackCopyTextToClipboard(codeText, copyButton);
            }
        }
    };

    // Fallback copy method for older browsers
    function fallbackCopyTextToClipboard(text, button) {
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
            showCopySuccess(button);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            showCopyError(button);
        }
        
        document.body.removeChild(textArea);
    }

    // Show copy success feedback
    function showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check2 me-1"></i>Copied!';
        button.classList.add('btn-success');
        button.classList.remove('btn-outline-secondary');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-secondary');
        }, 2000);
    }

    // Show copy error feedback
    function showCopyError(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-x me-1"></i>Failed';
        button.classList.add('btn-danger');
        button.classList.remove('btn-outline-secondary');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('btn-danger');
            button.classList.add('btn-outline-secondary');
        }, 2000);
    }

    // Animate submission cards on load
    const submissionCards = document.querySelectorAll('.history-submission-card');
    submissionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Initialize results count
    filterSubmissions();

    // Add CSS for animations
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
    `;
    document.head.appendChild(style);
});
