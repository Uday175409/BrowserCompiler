/**
 * Bootstrap Dropdown Implementation for Language Selector
 * ------------------------------------------------------
 * This function replaces the standard HTML select dropdown with a custom
 * Bootstrap dropdown that has better styling and icon support. It preserves
 * all the functionality of the original select element by creating a hidden
 * select that synchronizes with the custom dropdown.
 * 
 * @returns {void}
 */
function initializeBootstrapDropdown() {
  console.log('🔍 Starting Bootstrap dropdown initialization...');
  
  // Find the original select element
  const originalSelect = document.getElementById('languageSelect');
  
  // Safety check - exit if element not found
  if (!originalSelect) {
    console.log('❌ Original language select not found');
    return;
  }
  
  // Log the current state for debugging
  console.log('📝 Original select value:', originalSelect.value);
  console.log('📋 Original select options:', Array.from(originalSelect.options).map(o => o.value));
  
  // Prevent duplicate initialization
  if (originalSelect.style.display === 'none') {
    console.log('⚠️ Bootstrap dropdown already initialized');
    return;
  }
  
  console.log('🔧 Initializing Bootstrap dropdown...');
  
  // Define supported languages with their icons and labels
  const languages = [
    { value: 'python', label: 'Python', icon: 'bi-filetype-py' },
    { value: 'cpp', label: 'C++', icon: 'bi-code-square' },
    { value: 'java', label: 'Java', icon: 'bi-cup-hot' },
    { value: 'c', label: 'C', icon: 'bi-code' }
  ];
  
  // Find current language or default to first language
  const currentValue = originalSelect.value;
  const currentLanguage = languages.find(lang => lang.value === currentValue) || languages[0];
  
  console.log('🎯 Current language:', currentLanguage);
  
  // Create Bootstrap dropdown HTML
  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.className = 'dropdown';
  dropdownWrapper.innerHTML = `
    <button class="btn btn-outline-light dropdown-toggle" type="button" id="languageDropdownButton" data-bs-toggle="dropdown" aria-expanded="false" style="min-width: 140px; text-align: left;">
      <i class="bi ${currentLanguage.icon} me-2"></i>${currentLanguage.label}
    </button>
    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="languageDropdownButton">
      ${languages.map(lang => `
        <li>
          <a class="dropdown-item ${lang.value === currentValue ? 'active' : ''}" href="#" data-value="${lang.value}">
            <i class="bi ${lang.icon} me-2"></i>${lang.label}
          </a>
        </li>
      `).join('')}
    </ul>
  `;
  
  // Insert dropdown in the same container as original
  const container = originalSelect.parentElement;
  console.log('📦 Container element:', container);
  console.log('📦 Container class:', container.className);
  
  // Replace the original select completely
  console.log('🔄 Replacing original select with Bootstrap dropdown...');
  container.replaceChild(dropdownWrapper, originalSelect);
  console.log('✅ Original select replaced');
  
  // Create a hidden select for form submission
  const hiddenSelect = document.createElement('select');
  hiddenSelect.id = 'languageSelect';
  hiddenSelect.name = originalSelect.name;
  hiddenSelect.style.display = 'none';
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.textContent = lang.label;
    if (lang.value === currentValue) option.selected = true;
    hiddenSelect.appendChild(option);
  });
  container.appendChild(hiddenSelect);
  
  console.log('📦 Bootstrap dropdown HTML created and inserted');
  
  // Get elements
  const button = dropdownWrapper.querySelector('#languageDropdownButton');
  const menuItems = dropdownWrapper.querySelectorAll('.dropdown-item');
  
  console.log('🎛️ Adding event listeners...');
  
  /**
   * Handle dropdown item selection
   * -----------------------------
   * When a language is selected from the dropdown:
   * 1. Update the button UI to show the selected language
   * 2. Update the hidden select value to maintain form compatibility
   * 3. Trigger a change event to notify other components (Monaco Editor)
   */
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the selected language value and find its configuration
      const value = item.dataset.value;
      const language = languages.find(lang => lang.value === value);
      
      console.log('✅ Language selected:', language);
      
      // Update the dropdown button UI
      button.innerHTML = `<i class="bi ${language.icon} me-2"></i>${language.label}`;
      
      // Update the active state in the dropdown menu
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update the hidden select value for form submission
      hiddenSelect.value = value;
      
      // CRITICAL: Trigger the change event on the hidden select
      // This is what notifies the Monaco Editor to update the language
      hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log(`🔄 Language changed to: ${language.label}`);
    });
  });
  
  console.log('✅ Bootstrap language dropdown initialized successfully');
}

/**
 * Monaco Editor Initialization
 * ======================================
 * This script initializes the Monaco code editor with enhanced features,
 * custom keyboard shortcuts, and language switching functionality.
 * 
 * Key components:
 * 1. Bootstrap dropdown for language selection
 * 2. Monaco editor with syntax highlighting
 * 3. Code templates for different languages
 * 4. Form submission handling
 * 5. Theme toggling functionality
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Document loaded, initializing Monaco Editor");
  
  // ✅ Step 1: Initialize Bootstrap Language Dropdown 
  // This must happen FIRST before any references to languageSelect
  // A small delay ensures DOM is fully rendered
  setTimeout(() => {
    initializeBootstrapDropdown();
  }, 100);
  
  // Log environment information for debugging
  console.log("⏰ Timestamp:", new Date().toISOString());
  console.log("🌐 User Agent:", navigator.userAgent);
  console.log("📱 Screen size:", window.screen.width + "x" + window.screen.height);
  
  // Editor variables
  let editor; // Monaco editor instance
  let currentTheme = 'vs-dark'; // Default dark theme
  
  console.log("🎨 Initial theme:", currentTheme);
  
  /**
   * Step 2: Configure and Initialize Monaco Editor
   * ---------------------------------------------
   * The editor is loaded from CDN and configured with appropriate settings.
   * This approach ensures we're using the latest version with all features.
   */
  require.config({ 
    paths: { 
      vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' 
    }
  });

  require(['vs/editor/editor.main'], function () {
    // Get default language from Django context (via editorConfig)
    const defaultLang = editorConfig.language;
    
    // Determine initial code content
    // 1. Try to use code from Django context first
    // 2. Fall back to language template if no code provided
    // 3. Last resort is a generic comment
    let initialCode = editorConfig.code;
    if (!initialCode || initialCode.trim() === '') {
      // No code provided, use template for the default language
      initialCode = editorConfig.templates[defaultLang] || "# Write your code here";
      console.log("⚠️ No initial code provided, using template for", defaultLang);
    }
    
    // Debugging information
    console.log("🎯 Monaco Editor Initialization");
    console.log("🏷️ Default language:", defaultLang);
    console.log("📄 Initial code length:", initialCode.length);
    console.log("🔧 Code preview:", initialCode.substring(0, 100) + (initialCode.length > 100 ? "..." : ""));
    console.log("🎨 Theme:", currentTheme);
    
    // DEBUGGING: Log template availability
    console.log("📚 Available templates:", Object.keys(editorConfig.templates));
    console.log("📜 Default language template:", editorConfig.templates[defaultLang]);
    
    /**
     * Step 3: Create the Monaco Editor Instance
     * -----------------------------------------
     * Configure the editor with professional settings suitable for code editing:
     * - Modern code editing features (autocomplete, syntax highlighting)
     * - Developer-friendly UI (line numbers, minimap)
     * - Productivity enhancements (auto-closing brackets, format on paste)
     */
    editor = monaco.editor.create(document.getElementById('editor'), {
      // Content configuration
      value: initialCode,           // Initial code content
      language: defaultLang,        // Programming language for syntax highlighting
      theme: currentTheme,          // Color theme (vs-dark or vs-light)
      
      // Layout and appearance
      automaticLayout: true,        // Automatically resize with container
      fontSize: 14,                 // Readable font size
      fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace", // Coding fonts with fallbacks
      fontLigatures: true,          // Better visualization of code symbols
      lineNumbers: 'on',            // Show line numbers
      roundedSelection: false,      // Square text selection
      scrollBeyondLastLine: false,  // Don't allow scrolling past the end
      minimap: { enabled: true },   // Code overview on the right
      
      // Editor behavior
      readOnly: false,              // Allow editing
      folding: true,                // Code folding for functions/blocks
      wordWrap: 'on',               // Wrap long lines
      mouseWheelZoom: true,         // Ctrl+wheel to zoom
      smoothScrolling: true,        // Smooth scrolling animation
      cursorBlinking: 'smooth',     // Smooth cursor blink
      
      // Intelligence features
      renderWhitespace: 'selection', // Show whitespace in selections
      suggestOnTriggerCharacters: true, // Show suggestions when typing
      acceptSuggestionOnEnter: 'on',  // Accept suggestions with Enter
      tabCompletion: 'on',           // Tab to complete suggestions
      wordBasedSuggestions: true,     // Suggest based on document words
      parameterHints: { enabled: true }, // Show function parameter hints
      
      // Auto-formatting
      autoClosingBrackets: 'always',  // Auto-close brackets
      autoClosingQuotes: 'always',    // Auto-close quotes
      autoSurround: 'languageDefined', // Auto-surround selections
      formatOnPaste: true,            // Format code on paste
      formatOnType: true              // Format code while typing
    });

    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
      console.log("⌨️ Keyboard shortcut: Ctrl+Enter (Run Code)");
      const runBtn = document.querySelector('button[value="run"]');
      if (runBtn) {
        console.log("🏃 Triggering run button click");
        runBtn.click();
      } else {
        console.warn("⚠️ Run button not found");
      }
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, function() {
      console.log("⌨️ Keyboard shortcut: Ctrl+Shift+Enter (Submit Code)");
      const submitBtn = document.querySelector('button[value="submit"]');
      if (submitBtn) {
        console.log("📝 Triggering submit button click");
        submitBtn.click();
      } else {
        console.warn("⚠️ Submit button not found");
      }
    });

    // Language change handler
    const hiddenCode = document.getElementById("hiddenCode");
    const hiddenLanguage = document.getElementById("hiddenLanguage");
    const languageSelect = document.getElementById("languageSelect");
    
    console.log("🔍 Form Elements Found:");
    console.log("📋 Hidden Code Element:", !!hiddenCode);
    console.log("🏷️ Hidden Language Element:", !!hiddenLanguage, hiddenLanguage ? hiddenLanguage.value : 'N/A');
    console.log("🔤 Language Select Element:", !!languageSelect, languageSelect ? languageSelect.value : 'N/A');

    /**
     * Language Change Event Handler
     * -------------------------------------------------
     * This is triggered when the user selects a different language from the dropdown.
     * It updates the editor with the appropriate template code for the selected language.
     * 
     * Main functionality:
     * 1. Gets the selected language from the dropdown
     * 2. Checks if we should use a saved version from localStorage
     * 3. If no saved code exists, retrieves the template code for that language
     * 4. Creates a new Monaco editor model with the appropriate code
     * 5. Updates hidden form fields for submission
     * 6. Shows a notification to the user
     * 7. Saves the current code to localStorage before switching
     */
    languageSelect.addEventListener("change", () => {
      // Safety check - ensure all elements exist
      if (!hiddenLanguage || !languageSelect || !editor) {
        console.error("❌ Critical elements missing for language change");
        if (!hiddenLanguage) console.error("❌ Hidden language element missing");
        if (!languageSelect) console.error("❌ Language select element missing");
        if (!editor) console.error("❌ Editor not initialized");
        return;
      }
      
      const previousLang = hiddenLanguage.value || 'python';
      const selectedLang = languageSelect.value;
      const currentCode = editor.getValue();
      
      console.log("🔄 Language change detected");
      console.log("📋 Previous language:", previousLang);
      console.log("🆕 New language:", selectedLang);
      
      // IMPORTANT: Save current code to localStorage before switching languages
      // This allows users to switch back and forth between languages without losing code
      if (currentCode && currentCode.trim() !== '') {
        const storageKey = `codecompiler_${previousLang}_code`;
        console.log("💾 Saving current code for", previousLang, "to localStorage:", storageKey);
        localStorage.setItem(storageKey, currentCode);
      }
      
      // Check if we have saved code for the selected language in localStorage
      const savedCode = localStorage.getItem(`codecompiler_${selectedLang}_code`);
      
      // DEBUGGING: Log the available templates from editorConfig
      console.log("📚 Available templates:", Object.keys(editorConfig.templates));
      console.log("📜 Template for " + selectedLang + ":", editorConfig.templates[selectedLang]);
      console.log("💾 Saved code available:", !!savedCode);
      
      let newCode;
      
      // Decision process for which code to use:
      // 1. Use saved code from localStorage if available
      // 2. Otherwise use template from Django
      // 3. If that's empty, use hardcoded default template
      // 4. Last resort is a generic comment
      
      if (savedCode && savedCode.trim() !== '') {
        // Use previously saved code from localStorage
        console.log("💾 Using saved code from localStorage");
        newCode = savedCode;
      } else {
        // No saved code, use templates
        
        // First try template from Django
        let templateCode = editorConfig.templates[selectedLang];
        
        // Default templates as fallback
        const defaultTemplate = {
          "python": "# Write your Python code here\ndef solve():\n    # Your solution goes here\n    pass\n\nif __name__ == '__main__':\n    result = solve()\n    print(result)",
          "cpp": "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Your C++ code here\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}",
          "java": "public class Main {\n    public static void main(String[] args) {\n        // Your Java code here\n        System.out.println(\"Hello, World!\");\n    }\n}",
          "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    // Your C code here\n    printf(\"Hello, World!\\n\");\n    return 0;\n}"
        };
      
        if (templateCode && templateCode.trim() !== '') {
          // Use template from Django
          console.log("✅ Using template from Django");
          newCode = templateCode;
        } else if (defaultTemplate[selectedLang]) {
          // Fall back to hardcoded template
          console.log("⚠️ Django template empty, using default template");
          newCode = defaultTemplate[selectedLang];
        } else {
          // Last resort fallback
          console.log("⚠️ No template available, using generic comment");
          newCode = "// Write your code here";
        }
      }
      
      console.log("📝 Current code length:", currentCode.length);
      console.log("📄 New code length:", newCode.length);
      console.log("📄 New code preview:", newCode.substring(0, 50) + "...");
      
      try {
        // Create new model with proper language
        console.log("📝 Setting up new model with language:", selectedLang);
        const oldModel = editor.getModel();
        const newModel = monaco.editor.createModel(newCode, selectedLang);
        editor.setModel(newModel);
        if (oldModel) oldModel.dispose();
        console.log("✅ Editor model updated successfully");
      } catch (error) {
        console.error("❌ Error updating editor model:", error);
        // Fallback: Try setting the value directly if model creation fails
        try {
          monaco.editor.setModelLanguage(editor.getModel(), selectedLang);
          editor.setValue(newCode);
          console.log("⚠️ Used fallback method to update editor");
        } catch (fallbackError) {
          console.error("💥 Even fallback failed:", fallbackError);
        }
      }
      
      // Update hidden form field for submission
      hiddenLanguage.value = selectedLang;
      
      console.log("✅ Language switch completed");
      
      // Show language change notification
      showNotification(`Switched to ${selectedLang.toUpperCase()}`, 'info');
    });

    // Form submission handler
    document.getElementById("codeForm").addEventListener("submit", function (e) {
      // More robust way to detect which button was clicked
      let action = 'run'; // default
      
      // Check data attribute first (most reliable)
      const clickedAction = this.getAttribute('data-clicked-action');
      if (clickedAction) {
        action = clickedAction;
        console.log("🎯 Action from data attribute:", action);
      }
      // Check if e.submitter is available (newer browsers)
      else if (e.submitter && e.submitter.value) {
        action = e.submitter.value;
        console.log("🔍 Action from e.submitter:", action);
      } else {
        // Fallback: check which button was clicked
        const runBtn = document.querySelector('button[value="run"]');
        const submitBtn = document.querySelector('button[value="submit"]');
        
        if (document.activeElement === submitBtn) {
          action = 'submit';
          console.log("🔍 Action detected via activeElement: submit");
        } else if (document.activeElement === runBtn) {
          action = 'run';
          console.log("🔍 Action detected via activeElement: run");
        } else {
          console.warn("⚠️ Could not detect action, defaulting to 'run'");
        }
      }
      
      // Get latest code from editor
      const code = editor.getValue();
      
      // Get selected language - be very defensive here
      let language;
      const languageSelectElement = document.getElementById("languageSelect");
      if (languageSelectElement) {
        language = languageSelectElement.value;
      } else {
        // Fallback to hidden language field
        language = hiddenLanguage ? hiddenLanguage.value : 'python';
        console.warn("⚠️ Language select not found, using hidden field:", language);
      }
      
      const customInput = document.querySelector('textarea[name="input"]') ? 
                          document.querySelector('textarea[name="input"]').value : '';
      
      console.log("🚀 Form submission started");
      console.log("📝 FINAL ACTION:", action);
      console.log("💻 Language:", language);
      console.log("📄 Code length:", code.length);
      console.log("📥 Custom input:", customInput ? `"${customInput}"` : "None");
      console.log("🔧 Code preview:", code.substring(0, 100) + (code.length > 100 ? "..." : ""));
      
      // Make sure hidden code field exists and is updated
      if (hiddenCode) {
        hiddenCode.value = code;
      } else {
        console.error("❌ Hidden code element missing!");
      }
      
      // Update hidden language field
      if (hiddenLanguage) {
        hiddenLanguage.value = language;
        console.log("✅ Updated hidden language field:", language);
      } else {
        console.error("❌ Hidden language element missing!");
      }
      
      // Add a hidden input to ensure the action is sent correctly
      let actionInput = document.getElementById('hiddenAction');
      if (!actionInput) {
        actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.id = 'hiddenAction';
        document.getElementById('codeForm').appendChild(actionInput);
      }
      actionInput.value = action;
      
      console.log("🔧 Hidden action input set to:", action);
      
      // Add loading state to submit button
      const submitBtn = e.submitter || document.activeElement;
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      
      if (action === 'run') {
        console.log("▶️ Running code...");
        submitBtn.innerHTML = '<div class="loading-spinner me-2"></div>Running...';
      } else if (action === 'submit') {
        console.log("📤 Submitting solution...");
        submitBtn.innerHTML = '<div class="loading-spinner me-2"></div>Submitting...';
      }
      
      // Reset button after delay (will be reset on page reload anyway)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 5000);
    });

    // Individual button click handlers for extra safety
    const runButton = document.querySelector('button[value="run"]');
    const submitButton = document.querySelector('button[value="submit"]');
    
    if (runButton) {
      runButton.addEventListener('click', function(e) {
        console.log("🔴 RUN BUTTON CLICKED DIRECTLY");
        // Set a data attribute to track which button was clicked
        document.getElementById('codeForm').setAttribute('data-clicked-action', 'run');
      });
    }
    
    if (submitButton) {
      submitButton.addEventListener('click', function(e) {
        console.log("🟢 SUBMIT BUTTON CLICKED DIRECTLY");
        // Set a data attribute to track which button was clicked
        document.getElementById('codeForm').setAttribute('data-clicked-action', 'submit');
      });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      const previousTheme = currentTheme;
      currentTheme = currentTheme === 'vs-dark' ? 'vs-light' : 'vs-dark';
      
      console.log("🎨 Theme toggle clicked");
      console.log("🔄 Previous theme:", previousTheme);
      console.log("🆕 New theme:", currentTheme);
      
      monaco.editor.setTheme(currentTheme);
      
      const icon = themeToggle.querySelector('i');
      const previousIcon = icon.className;
      icon.className = currentTheme === 'vs-dark' ? 'bi bi-sun' : 'bi bi-moon';
      
      console.log("🎯 Icon changed from:", previousIcon, "to:", icon.className);
      
      showNotification(`Switched to ${currentTheme === 'vs-dark' ? 'dark' : 'light'} theme`, 'info');
    });

    // Fullscreen toggle
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const editorContainer = document.getElementById('editor').parentElement;
    
    fullscreenBtn.addEventListener('click', () => {
      const wasFullscreen = !!document.fullscreenElement;
      console.log("📺 Fullscreen button clicked");
      console.log("📊 Current fullscreen state:", wasFullscreen);
      
      if (!document.fullscreenElement) {
        console.log("🔄 Entering fullscreen mode");
        editorContainer.requestFullscreen().then(() => {
          console.log("✅ Successfully entered fullscreen");
          editor.layout();
          fullscreenBtn.querySelector('i').className = 'bi bi-fullscreen-exit';
          console.log("🔧 Changed icon to exit fullscreen");
        }).catch(err => {
          console.error("❌ Failed to enter fullscreen:", err);
        });
      } else {
        console.log("🔄 Exiting fullscreen mode");
        document.exitFullscreen().then(() => {
          console.log("✅ Successfully exited fullscreen");
          editor.layout();
          fullscreenBtn.querySelector('i').className = 'bi bi-fullscreen';
          console.log("🔧 Changed icon to enter fullscreen");
        }).catch(err => {
          console.error("❌ Failed to exit fullscreen:", err);
        });
      }
    });
    
    // Handle fullscreen change
    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = !!document.fullscreenElement;
      console.log("📺 Fullscreen state changed to:", isFullscreen);
      console.log("📐 Triggering editor layout resize");
      setTimeout(() => editor.layout(), 100);
    });
    
    // Auto-save to localStorage
    let saveTimeout;
    editor.onDidChangeModelContent(() => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const language = languageSelect.value;
        const code = editor.getValue();
        const key = `codecompiler_${language}_code`;
        
        console.log("💾 Auto-saving code");
        console.log("🔑 Storage key:", key);
        console.log("📝 Code length:", code.length);
        
        localStorage.setItem(key, code);
        console.log("✅ Auto-save completed");
      }, 1000);
    });
    
    // We no longer need a separate event handler to check for saved code
    // since we automatically handle this in the main language change handler
  });

  // Enhanced Leaderboard Modal
  initLeaderboardModal();

  // Utility function for notifications
  function showNotification(message, type = 'info') {
    console.log("🔔 Showing notification:");
    console.log("📝 Message:", message);
    console.log("🎨 Type:", type);
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
      <i class="bi bi-info-circle me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    console.log("✅ Notification element created and added to DOM");
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        console.log("🗑️ Auto-removing notification after 3 seconds");
        alertDiv.remove();
      }
    }, 3000);
  }

  // Add keyboard shortcuts info
  showKeyboardShortcuts();
});

// Initialize leaderboard modal functionality
function initLeaderboardModal() {
  const modal = document.getElementById("leaderboardModal");
  if (!modal) return;
  
  console.log("🏆 Leaderboard modal found and initialized");
  
  modal.addEventListener("show.bs.modal", function () {
    console.log("📊 Leaderboard modal opening");
    
    const loadingSpinner = document.getElementById("loadingSpinner");
    const chartCanvas = document.getElementById("leaderboardChart");
    const tableDiv = document.getElementById("leaderboardTable");
    
    // Show loading state
    loadingSpinner.style.display = "block";
    chartCanvas.style.display = "none";
    tableDiv.innerHTML = "";
    
    console.log("🔄 Loading leaderboard data...");
    
    // Check if we have a leaderboard URL from the configuration
    if (!window.leaderboardConfig || !window.leaderboardConfig.url) {
      console.error("❌ No leaderboard URL configured");
      loadingSpinner.style.display = "none";
      tableDiv.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
          <p class="text-danger">Leaderboard not configured.</p>
        </div>`;
      return;
    }
    
    // Fetch leaderboard data
    fetch(window.leaderboardConfig.url)
      .then(res => {
        console.log("📡 Response status:", res.status);
        console.log("📡 Response ok:", res.ok);
        
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        return res.json();
      })
      .then(data => {
        console.log("📊 Leaderboard data received:", data);
        console.log("👥 Number of entries:", data.data?.length || 0);
        console.log("✅ Success status:", data.success);
        
        if (data.error) {
          console.error("🚨 Server error:", data.error);
        }
        
        loadingSpinner.style.display = "none";
        
        // Check if we have data
        if (!data.data || data.data.length === 0) {
          chartCanvas.style.display = "none";
          tableDiv.innerHTML = `
            <div class="text-center py-4">
              <i class="bi bi-info-circle display-4 text-muted mb-3"></i>
              <h5 class="text-muted">No Leaderboard Data</h5>
              <p class="text-muted">No accepted submissions found for this problem yet.</p>
              <p class="small text-muted">Submit a successful solution to appear on the leaderboard!</p>
              ${window.leaderboardConfig.debugUrl ? 
                `<a href="${window.leaderboardConfig.debugUrl}" class="btn btn-outline-primary btn-sm mt-2" target="_blank">
                  <i class="bi bi-plus-circle me-1"></i>Add Test Data (Debug)
                </a>` : ''}
            </div>`;
          return;
        }
        
        chartCanvas.style.display = "block";
        
        // Create chart
        const ctx = chartCanvas.getContext('2d');
        const labels = data.data.map(d => d.username);
        const times = data.data.map(d => d.time_taken);
        const bgColors = data.data.map(d =>
          d.is_current_user ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.6)'
        );

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Time Taken (s)',
              data: times,
              backgroundColor: bgColors,
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Time (seconds)',
                  font: { weight: 'bold' }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });

        // Create table
        const tableRows = data.data.map((r, i) => {
          const isCurrentUser = r.is_current_user;
          const rowClass = isCurrentUser ? 'table-warning' : '';
          const userIcon = isCurrentUser ? '<i class="bi bi-person-fill me-1"></i>' : '';
          return `
            <tr class="${rowClass}">
              <td class="fw-bold">${i + 1}</td>
              <td>${userIcon}${r.username}${isCurrentUser ? ' <small>(You)</small>' : ''}</td>
              <td><span class="badge bg-primary">${r.time_taken}s</span></td>
              <td><span class="badge bg-success">${r.percentile}%</span></td>
            </tr>`;
        }).join("");

        tableDiv.innerHTML = `
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead class="table-dark">
                <tr>
                  <th><i class="bi bi-hash me-1"></i>Rank</th>
                  <th><i class="bi bi-person me-1"></i>User</th>
                  <th><i class="bi bi-clock me-1"></i>Time</th>
                  <th><i class="bi bi-percent me-1"></i>Percentile</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>`;
      })
      .catch(err => {
        console.error("❌ Leaderboard error:", err);
        console.error("🔍 Error details:", err.message);
        console.error("📍 Error stack:", err.stack);
        
        loadingSpinner.style.display = "none";
        tableDiv.innerHTML = `
          <div class="text-center py-4">
            <i class="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
            <p class="text-danger">Failed to load leaderboard data.</p>
            <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">
              <i class="bi bi-arrow-clockwise me-1"></i>Retry
            </button>
          </div>`;
      });
  });
}

// Show keyboard shortcuts helper
function showKeyboardShortcuts() {
  const shortcutsInfo = document.createElement('div');
  shortcutsInfo.className = 'position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded small';
  shortcutsInfo.style.cssText = 'z-index: 1000; opacity: 0.7; font-size: 0.8rem;';
  shortcutsInfo.innerHTML = `
    <div><strong>Shortcuts:</strong></div>
    <div>Ctrl+Enter: Run Code</div>
    <div>Ctrl+Shift+Enter: Submit</div>
  `;
  document.body.appendChild(shortcutsInfo);
  
  // Hide shortcuts info after 5 seconds
  setTimeout(() => {
    shortcutsInfo.style.opacity = '0';
    shortcutsInfo.style.transition = 'opacity 0.5s';
  }, 5000);
}
