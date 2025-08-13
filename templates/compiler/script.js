// Compiler Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Monaco Editor instance
    let editor = null;
    let currentLanguage = 'python';
    let isRunning = false;
    
    // Initialize language from editorConfig if available
    if (typeof editorConfig !== 'undefined' && editorConfig.language) {
        currentLanguage = editorConfig.language;
    }
    
    // Initialize Monaco Editor
    if (typeof require !== 'undefined') {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            initializeEditor();
        });
    } else if (typeof monaco !== 'undefined') {
        initializeEditor();
    } else {
        console.error('Monaco Editor not loaded');
    }

    function initializeEditor() {
        console.log('Initializing editor with language:', currentLanguage);
        
        // Get initial code from editorConfig or saved localStorage or starter code
        let initialCode = '';
        if (typeof editorConfig !== 'undefined' && editorConfig.code) {
            initialCode = editorConfig.code;
            console.log('Using code from editorConfig');
        } else {
            const savedCode = loadCodeFromStorage(currentLanguage);
            initialCode = savedCode || getStarterCode(currentLanguage);
            console.log('Using saved or starter code');
        }

        console.log('Initial code:', initialCode.substring(0, 50) + '...');

        editor = monaco.editor.create(document.getElementById('editor'), {
            value: initialCode,
            language: getMonacoLanguage(currentLanguage),
            theme: 'vs-dark',
            fontSize: 14,
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 4,
            insertSpaces: true,
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            scrollbar: {
                useShadows: false,
                verticalHasArrows: true,
                horizontalHasArrows: true,
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 17,
                horizontalScrollbarSize: 17,
                arrowSize: 30
            }
        });

        console.log('Editor created successfully');

        // Auto-save code
        editor.onDidChangeModelContent(() => {
            saveCodeToStorage();
        });

        // Keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            runCode();
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            saveCode();
        });

        // Initialize UI with current language
        updateLanguageUI(currentLanguage);
    }

    // Language selection
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        // Set initial language from editorConfig or current selection
        if (typeof editorConfig !== 'undefined' && editorConfig.language) {
            languageSelect.value = editorConfig.language;
            currentLanguage = editorConfig.language;
        }
        
        languageSelect.addEventListener('change', function() {
            currentLanguage = this.value;
            changeLanguage(currentLanguage);
        });
    } else {
        console.warn('Language select element not found');
    }

    // Form submission handling
    const codeForm = document.getElementById('codeForm');
    if (codeForm) {
        codeForm.addEventListener('submit', function(e) {
            // Sync editor content with form
            if (editor) {
                const hiddenCode = document.getElementById('hiddenCode');
                if (hiddenCode) {
                    hiddenCode.value = editor.getValue();
                }
                const hiddenLanguage = document.getElementById('hiddenLanguage');
                if (hiddenLanguage) {
                    hiddenLanguage.value = currentLanguage;
                }
            }
        });
    }

    function changeLanguage(language) {
        console.log('Changing language to:', language);
        if (!editor) {
            console.error('Editor not initialized');
            return;
        }
        
        const newCode = getStarterCode(language);
        const monacoLang = getMonacoLanguage(language);
        
        console.log('New code:', newCode.substring(0, 50) + '...');
        console.log('Monaco language:', monacoLang);
        
        // Save current code before switching
        saveCodeToStorage();
        
        // Load saved code for new language or use starter code
        const savedCode = loadCodeFromStorage(language);
        const codeToSet = savedCode || newCode;
        
        // Update editor
        monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
        editor.setValue(codeToSet);
        
        // Update UI
        updateLanguageUI(language);
        
        console.log('Language changed successfully to:', language);
    }

    function updateLanguageUI(language) {
        // Update the language selector if it exists
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect && languageSelect.value !== language) {
            languageSelect.value = language;
        }

        // Update the hidden language field for form submission
        const hiddenLanguage = document.getElementById('hiddenLanguage');
        if (hiddenLanguage) {
            hiddenLanguage.value = language;
        }

        // Update current language variable
        currentLanguage = language;
    }

    function getMonacoLanguage(language) {
        const mapping = {
            'python': 'python',
            'javascript': 'javascript',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'csharp': 'csharp',
            'go': 'go',
            'rust': 'rust'
        };
        return mapping[language] || 'python';
    }

    function getStarterCode(language) {
        // Use editorConfig from HTML template if available
        if (typeof editorConfig !== 'undefined' && editorConfig.templates && editorConfig.templates[language]) {
            return editorConfig.templates[language];
        }

        // Fallback to hardcoded starters
        const starters = {
            'python': `# Write your solution here
def solution():
    # Your code goes here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
            'javascript': `// Write your solution here
function solution() {
    // Your code goes here
    return null;
}

// Test your solution
console.log(solution());`,
            'java': `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println(sol.solution());
    }
    
    public Object solution() {
        // Your code goes here
        return null;
    }
}`,
            'cpp': `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    // Write your solution here
    auto solution() {
        // Your code goes here
        return 0;
    }
};

int main() {
    Solution sol;
    // Test your solution
    cout << sol.solution() << endl;
    return 0;
}`,
            'c': `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Write your solution here
int solution() {
    // Your code goes here
    return 0;
}

int main() {
    // Test your solution
    printf("%d\\n", solution());
    return 0;
}`
        };
        
        return starters[language] || starters['python'];
    }

    // Code execution
    const runButton = document.getElementById('runCode');
    const submitButton = document.getElementById('submitCode');
    
    if (runButton) {
        runButton.addEventListener('click', runCode);
    }
    
    if (submitButton) {
        submitButton.addEventListener('click', submitCode);
    }

    async function runCode() {
        if (isRunning || !editor) return;
        
        isRunning = true;
        const code = editor.getValue();
        const language = currentLanguage;
        
        // Update UI
        updateRunButton(true);
        showOutput('Running code...', 'loading');
        
        try {
            const response = await fetch('/api/run-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    code: code,
                    language: language,
                    input: getTestInput()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showOutput(result.output, 'success');
            } else {
                showOutput(result.error, 'error');
            }
            
        } catch (error) {
            console.error('Error running code:', error);
            showOutput('Error: Failed to run code. Please try again.', 'error');
        } finally {
            isRunning = false;
            updateRunButton(false);
        }
    }

    async function submitCode() {
        if (isRunning || !editor) return;
        
        const code = editor.getValue();
        const problemId = getProblemId();
        
        if (!problemId) {
            showNotification('No problem selected', 'error');
            return;
        }
        
        isRunning = true;
        updateSubmitButton(true);
        showOutput('Submitting solution...', 'loading');
        
        try {
            const response = await fetch('/api/submit-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    code: code,
                    language: currentLanguage,
                    problem_id: problemId
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showTestResults(result.test_results);
                showNotification(`Submission ${result.status}!`, result.status === 'Accepted' ? 'success' : 'warning');
            } else {
                showOutput(result.error, 'error');
                showNotification('Submission failed', 'error');
            }
            
        } catch (error) {
            console.error('Error submitting code:', error);
            showOutput('Error: Failed to submit code. Please try again.', 'error');
            showNotification('Submission failed', 'error');
        } finally {
            isRunning = false;
            updateSubmitButton(false);
        }
    }

    // UI Updates
    function updateRunButton(running) {
        if (!runButton) return;
        
        if (running) {
            runButton.innerHTML = '<div class="loading-spinner"></div>Running...';
            runButton.disabled = true;
        } else {
            runButton.innerHTML = '<i class="bi bi-play-fill me-1"></i>Run Code';
            runButton.disabled = false;
        }
    }

    function updateSubmitButton(submitting) {
        if (!submitButton) return;
        
        if (submitting) {
            submitButton.innerHTML = '<div class="loading-spinner"></div>Submitting...';
            submitButton.disabled = true;
        } else {
            submitButton.innerHTML = '<i class="bi bi-check2 me-1"></i>Submit';
            submitButton.disabled = false;
        }
    }

    function showOutput(content, type = 'default') {
        const outputContent = document.getElementById('output-content');
        if (!outputContent) return;
        
        outputContent.className = `output-content ${type}`;
        
        if (type === 'loading') {
            outputContent.innerHTML = `
                <div class="loading-spinner"></div>
                ${content}
            `;
        } else {
            outputContent.textContent = content;
        }
        
        // Scroll to bottom
        outputContent.scrollTop = outputContent.scrollHeight;
    }

    function showTestResults(testResults) {
        const testCasesContainer = document.getElementById('test-cases');
        if (!testCasesContainer || !testResults) return;
        
        testCasesContainer.innerHTML = '';
        
        testResults.forEach((test, index) => {
            const testCase = document.createElement('div');
            testCase.className = 'test-case';
            
            const status = test.passed ? 'passed' : 'failed';
            const statusText = test.passed ? 'Passed' : 'Failed';
            
            testCase.innerHTML = `
                <div class="test-case-header" onclick="toggleTestCase(${index})">
                    <span>Test Case ${index + 1}</span>
                    <span class="test-case-status ${status}">${statusText}</span>
                </div>
                <div class="test-case-content" id="test-case-${index}">
                    <div class="test-case-io">
                        <div>
                            <strong>Input:</strong>
                            <div class="test-case-input">${test.input}</div>
                        </div>
                        <div>
                            <strong>Expected:</strong>
                            <div class="test-case-expected">${test.expected}</div>
                        </div>
                    </div>
                    <div>
                        <strong>Your Output:</strong>
                        <div class="test-case-output">${test.output}</div>
                    </div>
                    ${test.error ? `
                        <div>
                            <strong>Error:</strong>
                            <div class="test-case-error">${test.error}</div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            testCasesContainer.appendChild(testCase);
        });
        
        // Show test results section
        const testSection = document.getElementById('test-results-section');
        if (testSection) {
            testSection.style.display = 'block';
        }
    }

    // Test case toggle
    window.toggleTestCase = function(index) {
        const content = document.getElementById(`test-case-${index}`);
        if (content) {
            content.classList.toggle('show');
        }
    };

    // Code saving
    function saveCodeToStorage() {
        if (!editor) return;
        
        const code = editor.getValue();
        const storageKey = `compiler_code_${currentLanguage}`;
        
        try {
            localStorage.setItem(storageKey, code);
        } catch (error) {
            console.error('Failed to save code:', error);
        }
    }

    function loadCodeFromStorage(language = currentLanguage) {
        const storageKey = `compiler_code_${language}`;
        
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            console.error('Failed to load code:', error);
            return null;
        }
    }

    async function saveCode() {
        if (!editor) return;
        
        const code = editor.getValue();
        const problemId = getProblemId();
        
        try {
            const response = await fetch('/api/save-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    code: code,
                    language: currentLanguage,
                    problem_id: problemId
                })
            });
            
            if (response.ok) {
                showNotification('Code saved successfully', 'success');
            }
            
        } catch (error) {
            console.error('Failed to save code:', error);
        }
    }

    // Utility functions
    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }

    function getProblemId() {
        return document.querySelector('[data-problem-id]')?.dataset.problemId || '';
    }

    function getTestInput() {
        const inputElement = document.getElementById('test-input');
        return inputElement ? inputElement.value : '';
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Editor settings
    const settingsButton = document.getElementById('editorSettings');
    if (settingsButton) {
        settingsButton.addEventListener('click', showEditorSettings);
    }

    function showEditorSettings() {
        // Create settings modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editor Settings</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Theme</label>
                            <select class="form-select" id="themeSelect">
                                <option value="vs-dark">Dark</option>
                                <option value="vs-light">Light</option>
                                <option value="hc-black">High Contrast</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Font Size</label>
                            <input type="range" class="form-range" id="fontSizeRange" min="10" max="24" value="14">
                            <small class="text-muted">Current: <span id="fontSizeValue">14</span>px</small>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="wordWrapCheck" checked>
                                <label class="form-check-label">Word Wrap</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="minimapCheck">
                                <label class="form-check-label">Show Minimap</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="applyEditorSettings()">Apply</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Initialize settings
        loadEditorSettings();
    }

    function loadEditorSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('editorSettings') || '{}');
            
            if (settings.theme) {
                document.getElementById('themeSelect').value = settings.theme;
            }
            if (settings.fontSize) {
                document.getElementById('fontSizeRange').value = settings.fontSize;
                document.getElementById('fontSizeValue').textContent = settings.fontSize;
            }
            if (settings.wordWrap !== undefined) {
                document.getElementById('wordWrapCheck').checked = settings.wordWrap;
            }
            if (settings.minimap !== undefined) {
                document.getElementById('minimapCheck').checked = settings.minimap;
            }
        } catch (error) {
            console.error('Failed to load editor settings:', error);
        }
    }

    window.applyEditorSettings = function() {
        if (!editor) return;
        
        const theme = document.getElementById('themeSelect').value;
        const fontSize = document.getElementById('fontSizeRange').value;
        const wordWrap = document.getElementById('wordWrapCheck').checked;
        const minimap = document.getElementById('minimapCheck').checked;
        
        // Apply settings to editor
        monaco.editor.setTheme(theme);
        editor.updateOptions({
            fontSize: parseInt(fontSize),
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: minimap }
        });
        
        // Save settings
        const settings = {
            theme,
            fontSize: parseInt(fontSize),
            wordWrap,
            minimap
        };
        
        try {
            localStorage.setItem('editorSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save editor settings:', error);
        }
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
        if (modal) {
            modal.hide();
        }
    };

    // Font size range update
    document.addEventListener('input', function(e) {
        if (e.target.id === 'fontSizeRange') {
            document.getElementById('fontSizeValue').textContent = e.target.value;
        }
    });

    // Load saved editor settings on startup
    if (editor) {
        const savedSettings = JSON.parse(localStorage.getItem('editorSettings') || '{}');
        if (Object.keys(savedSettings).length > 0) {
            editor.updateOptions(savedSettings);
            if (savedSettings.theme) {
                monaco.editor.setTheme(savedSettings.theme);
            }
        }
    }

    // Window resize handler
    window.addEventListener('resize', () => {
        if (editor) {
            editor.layout();
        }
    });
});
