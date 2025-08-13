/**
 * Simple and direct Monaco language switcher script
 * This script replaces the complex implementation to focus only on making language switching work correctly
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for Monaco to be fully loaded
    if (typeof require !== 'undefined') {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' }});
        require(['vs/editor/editor.main'], initializeEditor);
    } else {
        console.error('Monaco loader not available');
    }

    function initializeEditor() {
        console.log('Initializing editor with direct implementation');
        
        // Editor instance
        let editor = null;
        
        // Get configuration from Django template
        const defaultLang = editorConfig.language || 'python';
        const initialCode = editorConfig.code || editorConfig.templates[defaultLang] || '// Write your code here';
        
        // Log configuration for debugging
        console.log('Default language:', defaultLang);
        console.log('Templates available:', Object.keys(editorConfig.templates));
        
        // Create editor with simple configuration
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: initialCode,
            language: defaultLang,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false }
        });
        
        console.log('Editor created successfully');
        
        // Set up form handler
        const codeForm = document.getElementById('codeForm');
        const hiddenCode = document.getElementById('hiddenCode');
        const hiddenLanguage = document.getElementById('hiddenLanguage');
        
        if (codeForm) {
            codeForm.addEventListener('submit', function() {
                if (editor && hiddenCode) {
                    hiddenCode.value = editor.getValue();
                    console.log('Code saved to form field');
                }
            });
        }
        
        // Set up language change handler - CRITICAL FUNCTIONALITY
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            console.log('Language select found, setting up change handler');
            
            // Initialize with correct value
            languageSelect.value = defaultLang;
            
            languageSelect.addEventListener('change', function() {
                const selectedLang = this.value;
                console.log('Language changed to:', selectedLang);
                
                // Save current code before switching
                const currentCode = editor.getValue();
                localStorage.setItem(`code_${hiddenLanguage.value}`, currentCode);
                console.log('Saved current code for', hiddenLanguage.value);
                
                // Determine code for new language
                let newCode;
                const savedCode = localStorage.getItem(`code_${selectedLang}`);
                
                if (savedCode) {
                    console.log('Using previously saved code for', selectedLang);
                    newCode = savedCode;
                } else {
                    console.log('Using template for', selectedLang);
                    newCode = editorConfig.templates[selectedLang] || '// Write your code here';
                }
                
                // Change model language
                monaco.editor.setModelLanguage(editor.getModel(), selectedLang);
                
                // Set new code
                editor.setValue(newCode);
                
                // Update hidden field
                hiddenLanguage.value = selectedLang;
                
                console.log('Language switch complete');
            });
        } else {
            console.error('Language select element not found');
        }
    }
});
