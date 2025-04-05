import { tokenize, calculateRelevance } from './utils.js';

function initializeSearch(allQuestions, questionMap, tokenizedCache) {
    const searchInput = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('suggestions');
    const clearButton = document.querySelector('.btn-clear');
    const showAllBtn = document.getElementById('showAllBtn');
    let debounceTimeout;
    let selectedSuggestionIndex = -1;

    suggestionsDiv.insertAdjacentHTML('beforeend', '<div class="suggestion-item loading" style="display: none;">Loading...</div>');
    const loadingIndicator = suggestionsDiv.querySelector('.loading');

    function getSectionName(section) {
        const sectionNames = {
            'mcq': 'MCQ',
            'onemarks': 'Short Questions',
            'long': 'Long Questions',
            'imp': 'Important Questions'
        };
        return sectionNames[section] || section;
    }

    function debounceSearch() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            const queryTokens = tokenize(query);
            const questions = document.querySelectorAll('.question');
            const activeTab = document.querySelector('.nav-pills .active').id.replace('pills-', '').replace('-tab', '');

            clearButton.style.display = query ? 'inline-block' : 'none';
            showAllBtn.style.display = 'none';
            selectedSuggestionIndex = -1;

            suggestionsDiv.innerHTML = '';
            suggestionsDiv.appendChild(loadingIndicator);
            suggestionsDiv.style.display = query ? 'block' : 'none';
            loadingIndicator.style.display = query ? 'block' : 'none';

            if (!query) {
                questions.forEach(q => {
                    const questionSubject = q.id.split('-')[0];
                    q.style.display = (questionSubject === activeTab) ? '' : 'none';
                    const questionTextElement = q.querySelector('.question-text, .card-title, .card-text');
                    if (questionTextElement) {
                        const originalText = questionTextElement.getAttribute('data-original-text') || questionTextElement.textContent;
                        questionTextElement.innerHTML = originalText;
                        questionTextElement.setAttribute('data-original-text', originalText);
                    }
                });
                suggestionsDiv.style.display = 'none';
                return;
            }

            const matchingQuestions = allQuestions
                .map(q => {
                    if (q.subject !== activeTab) return null;
                    const { questionTokens, keywordTokens } = tokenizedCache.get(q.key);
                    const relevance = calculateRelevance(queryTokens, questionTokens, keywordTokens);
                    return relevance > 0 ? { ...q, relevance } : null;
                })
                .filter(q => q !== null)
                .sort((a, b) => b.relevance - a.relevance);

            loadingIndicator.style.display = 'none';
            if (matchingQuestions.length > 0) {
                matchingQuestions.slice(0, 10).forEach((q, index) => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item');
                    if (index === selectedSuggestionIndex) {
                        suggestionItem.classList.add('selected');
                    }
                    
                    const sectionName = getSectionName(q.type);
                    suggestionItem.innerHTML = `
                        <div class="suggestion-content">
                            <div class="suggestion-text">${q.question}</div>
                            <div class="suggestion-section">${sectionName}</div>
                        </div>
                    `;
                    
                    suggestionItem.setAttribute('data-key', q.key);
                    suggestionItem.addEventListener('click', () => handleSuggestionClick(q));
                    suggestionsDiv.appendChild(suggestionItem);
                });
                suggestionsDiv.style.display = 'block';
            } else {
                suggestionsDiv.innerHTML = '<div class="suggestion-item">No suggestions found.</div>';
                suggestionsDiv.style.display = 'block';
            }

            // Show matching questions in current view
            let anyMatch = false;
            questions.forEach(q => {
                const questionSubject = q.id.split('-')[0];
                if (questionSubject !== activeTab) {
                    q.style.display = 'none';
                    return;
                }
                const { questionTokens, keywordTokens } = tokenizedCache.get(q.id) || { questionTokens: tokenize(q.textContent), keywordTokens: [] };
                const matches = queryTokens.every(token =>
                    questionTokens.some(qToken => qToken.includes(token)) ||
                    keywordTokens.some(kToken => kToken.includes(token))
                );
                if (matches) {
                    anyMatch = true;
                    q.style.display = '';
                    highlightText(q, query);
                } else {
                    q.style.display = 'none';
                }
            });
        }, 300);
    }

    function handleSuggestionClick(question) {
        searchInput.value = question.question;
        suggestionsDiv.style.display = 'none';
        
        // First, switch to the correct tab if needed
        const currentTab = document.querySelector('.nav-pills .active');
        const targetTab = document.querySelector(`#pills-${question.subject}-tab`);
        
        if (currentTab !== targetTab) {
            targetTab.click();
        }

        // Wait for tab switch to complete
        setTimeout(() => {
            // Find the question element by its ID
            const questionElement = document.getElementById(question.key);
            if (questionElement) {
                // Show all questions in the current section
                const questions = document.querySelectorAll('.question');
                questions.forEach(qq => {
                    const qqSubject = qq.id.split('-')[0];
                    if (qqSubject === question.subject) {
                        qq.style.display = '';
                    }
                });

                // Highlight the selected question
                highlightText(questionElement, question.question);

                // Scroll to the question
                questionElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });

                // Show feedback message
                const feedback = document.createElement('p');
                feedback.textContent = 'Showing selected question.';
                feedback.style.color = '#4CAF50';
                feedback.style.marginTop = '10px';
                questionElement.parentElement.insertBefore(feedback, questionElement.nextSibling);
                setTimeout(() => feedback.remove(), 3000);

                showAllBtn.style.display = 'inline-block';
                window.location.hash = question.key;
            }
        }, 300);
    }

    function highlightText(element, query) {
        const questionTextElement = element.querySelector('.question-text, .card-title, .card-text');
        if (!questionTextElement) return;
        const text = questionTextElement.textContent;
        questionTextElement.setAttribute('data-original-text', text);
        const regex = new RegExp(`(${query})`, 'gi');
        questionTextElement.innerHTML = text.replace(regex, '<span style="background-color: yellow; color: black;">$1</span>');
        element.style.transition = 'border 0.5s';
        element.style.border = '2px solid #4CAF50';
        setTimeout(() => {
            element.style.border = '1px solid #4CAF50';
        }, 2000);
    }

    // Add keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const suggestions = suggestionsDiv.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (selectedSuggestionIndex < suggestions.length - 1) {
                    selectedSuggestionIndex++;
                    suggestions.forEach((item, index) => {
                        item.classList.toggle('selected', index === selectedSuggestionIndex);
                    });
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (selectedSuggestionIndex > 0) {
                    selectedSuggestionIndex--;
                    suggestions.forEach((item, index) => {
                        item.classList.toggle('selected', index === selectedSuggestionIndex);
                    });
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0) {
                    const selectedQuestion = allQuestions.find(q => q.key === suggestions[selectedSuggestionIndex].getAttribute('data-key'));
                    if (selectedQuestion) {
                        handleSuggestionClick(selectedQuestion);
                    }
                }
                break;
            case 'Escape':
                suggestionsDiv.style.display = 'none';
                selectedSuggestionIndex = -1;
                break;
        }
    });

    searchInput.addEventListener('input', debounceSearch);

    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        const questions = document.querySelectorAll('.question');
        const activeTab = document.querySelector('.nav-pills .active').id.replace('pills-', '').replace('-tab', '');
        questions.forEach(q => {
            const questionSubject = q.id.split('-')[0];
            q.style.display = (questionSubject === activeTab) ? '' : 'none';
            const questionTextElement = q.querySelector('.question-text, .card-title, .card-text');
            if (questionTextElement) {
                const originalText = questionTextElement.getAttribute('data-original-text') || questionTextElement.textContent;
                questionTextElement.innerHTML = originalText;
                questionTextElement.setAttribute('data-original-text', originalText);
            }
        });
        clearButton.style.display = 'none';
        suggestionsDiv.style.display = 'none';
        showAllBtn.style.display = 'none';
        window.location.hash = '';
    });

    showAllBtn.addEventListener('click', function() {
        const questions = document.querySelectorAll('.question');
        const activeTab = document.querySelector('.nav-pills .active').id.replace('pills-', '').replace('-tab', '');
        questions.forEach(q => {
            const questionSubject = q.id.split('-')[0];
            q.style.display = (questionSubject === activeTab) ? '' : 'none';
            const questionTextElement = q.querySelector('.question-text, .card-title, .card-text');
            if (questionTextElement) {
                const originalText = questionTextElement.getAttribute('data-original-text') || questionTextElement.textContent;
                questionTextElement.innerHTML = originalText;
            }
        });
        showAllBtn.style.display = 'none';
        window.location.hash = '';
    });

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !suggestionsDiv.contains(event.target) && !clearButton.contains(event.target) && !showAllBtn.contains(event.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

export { initializeSearch };