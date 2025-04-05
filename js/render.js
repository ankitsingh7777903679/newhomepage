import { escapeHtmlForAttribute } from './utils.js';

const QUESTIONS_PER_PAGE = 10;
const subjectPages = new Map(); // Track current page for each subject

function getCurrentPage(subject) {
    if (!subjectPages.has(subject)) {
        subjectPages.set(subject, 1);
    }
    return subjectPages.get(subject);
}

function setCurrentPage(subject, page) {
    subjectPages.set(subject, page);
}

function formatAnswer(answer) {
    if (!answer) return '';
    
    // Split answer into points if it contains bullet points or numbers
    const points = answer.split(/(?:\r\n|\r|\n|•)/g)
        .map(point => point.trim())
        .filter(point => point.length > 0);
    
    if (points.length > 1) {
        // Process each point to highlight section titles
        const formattedPoints = points.map(point => {
            const sectionPattern = /(Applications of|Types of|Features of|Components of|Characteristics of).*?:/i;
            if (sectionPattern.test(point)) {
                return `<li><div class="section-title">${point}</div></li>`;
            }
            return `<li>${point}</li>`;
        });
        
        return `<ul class="answer-points">
            ${formattedPoints.join('')}
        </ul>`;
    }
    
    // For single-line answers, check if it's a section title
    const sectionPattern = /(Applications of|Types of|Features of|Components of|Characteristics of).*?:/i;
    if (sectionPattern.test(answer)) {
        return `<div class="section-title">${answer}</div>`;
    }
    
    return `<p class="answer-text">${answer}</p>`;
}

function formatQuestion(question) {
    // Keep questions as normal text
    return question;
}

function renderQuestions(containerId, questions, isMcq = false, isOneMarks = false, subject, section) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found.`);
        return;
    }
    if (!questions || questions.length === 0) {
        container.innerHTML = '<p class="no-questions">No questions available.</p>';
        return;
    }

    // Only show loading state for question sections, not papers
    if (!containerId.includes('papers')) {
        container.innerHTML = '<div class="questions-container loading"></div>';
    }

    // Get current page for this subject
    const currentPage = getCurrentPage(subject);

    // Calculate pagination
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
    const currentQuestions = questions.slice(startIndex, endIndex);

    // Simulate loading delay for smooth transition
    setTimeout(() => {
        // Create questions container
        const questionsContainer = document.createElement('div');
        questionsContainer.className = 'questions-container';

        currentQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('card', 'question', 'animate-in');
            const questionId = `${subject}-${section}-${startIndex + index}`;
            questionDiv.setAttribute('id', questionId);
            const questionKey = `${subject}-${section}-${startIndex + index}`;
            if (window.questionMap && window.questionMap[questionKey]) {
                window.questionMap[questionKey].element = questionDiv;
            }

            let imagesHtml = '';
            if (q.images && Array.isArray(q.images) && q.images.length > 0) {
                imagesHtml = `
                    <div class="image-gallery">
                        ${q.images.map(img => `
                            <img src="${img}" alt="Diagram for ${q.question}" class="img-fluid" width="200" height="200" loading="lazy">
                        `).join('')}
                    </div>
                `;
            }

            const codeBlock = q.code ? `
                <div class="code-section">
                    <div class="code-header">
                        <div class="code-title">
                            <i class="fas fa-code"></i>
                            <h4>Code Example</h4>
                        </div>
                        <button class="copy-btn" data-code="${escapeHtmlForAttribute(q.code)}" aria-label="Copy code">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="code-content">
                        <pre><code class="language-javascript">${q.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                    </div>
                </div>
            ` : '';

            const formattedQuestion = formatQuestion(q.question.replace(/</g, '&lt;').replace(/>/g, '&gt;'));

            if (isOneMarks) {
                questionDiv.innerHTML = `
                    <div class="card-body">
                        <div class="question-header">
                            <span class="question-number">Q${startIndex + index + 1}</span>
                            <div class="question-content">
                                <h3 class="question-text">${formattedQuestion}</h3>
                            </div>
                        </div>
                        <div class="answer-section">
                            <div class="answer-header">
                                <i class="fas fa-lightbulb"></i>
                                <h4>Answer</h4>
                                <button class="toggle-answer-btn" aria-label="Toggle answer visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="answer-content" style="display: none;">
                                ${formatAnswer(q.answer)}
                                ${q.explanation ? `
                                    <div class="explanation-section">
                                        <div class="explanation-header">
                                            <i class="fas fa-info-circle"></i>
                                            <h5>Explanation</h5>
                                        </div>
                                        <div class="explanation-text">
                                            ${q.explanation}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        ${imagesHtml}
                        ${codeBlock}
                    </div>
                `;
            } else if (isMcq) {
                questionDiv.innerHTML = `
                    <div class="card-body">
                        <div class="question-header">
                            <span class="question-number">Q${startIndex + index + 1}</span>
                            <h3 class="question-text">${formattedQuestion}</h3>
                        </div>
                        <div class="options-container">
                            ${q.options.map((option, idx) => `
                                <div class="option-item">
                                    <input type="radio" name="${q.id || questionId}" value="${String.fromCharCode(97 + idx)}" id="${q.id || questionId}-option-${idx}">
                                    <label for="${q.id || questionId}-option-${idx}">${option.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mcq-actions">
                            <button class="btn btn-primary submit-btn" data-question-id="${q.id || questionId}" data-correct-answer="${q.correctAnswer}">
                                <i class="fas fa-check"></i> Submit
                            </button>
                            <button class="btn btn-secondary try-again-btn" data-question-id="${q.id || questionId}" style="display: none;">
                                <i class="fas fa-redo"></i> Try Again
                            </button>
                            <div id="${q.id || questionId}-feedback" class="feedback-text"></div>
                        </div>
                        ${codeBlock}
                    </div>
                `;
            } else {
                questionDiv.innerHTML = `
                    <div class="card-body">
                        <div class="question-header">
                            <span class="question-number">Q${startIndex + index + 1}</span>
                            <h3 class="question-text">${formattedQuestion}</h3>
                        </div>
                        <div class="answer-section">
                            <div class="answer-header">
                                <i class="fas fa-lightbulb"></i>
                                <h4>Answer</h4>
                                <button class="toggle-answer-btn" aria-label="Toggle answer visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="answer-content" style="display: none;">
                                ${formatAnswer(q.answer)}
                                ${q.explanation ? `
                                    <div class="explanation-section">
                                        <div class="explanation-header">
                                            <i class="fas fa-info-circle"></i>
                                            <h5>Explanation</h5>
                                        </div>
                                        <div class="explanation-text">
                                            ${q.explanation}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        ${imagesHtml}
                        ${codeBlock}
                    </div>
                `;
            }
            questionsContainer.appendChild(questionDiv);
            
            // Trigger animation after a small delay
            setTimeout(() => {
                questionDiv.classList.add('visible');
            }, index * 100);
        });

        // Clear loading state and add questions
        container.innerHTML = '';
        container.appendChild(questionsContainer);

        // Add pagination controls if there are multiple pages
        if (totalPages > 1) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-controls';
            paginationDiv.innerHTML = `
                <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                    <span>Previous</span>
                </button>
                <div class="page-info">
                    <span>Page ${currentPage} of ${totalPages}</span>
                    <small>(Questions ${startIndex + 1}-${endIndex} of ${questions.length})</small>
                </div>
                <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                    <span>Next</span>
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
            container.appendChild(paginationDiv);

            // Add event listeners for pagination
            const prevBtn = paginationDiv.querySelector('.prev-btn');
            const nextBtn = paginationDiv.querySelector('.next-btn');

            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    setCurrentPage(subject, currentPage - 1);
                    container.firstChild.classList.add('loading');
                    setTimeout(() => {
                        renderQuestions(containerId, questions, isMcq, isOneMarks, subject, section);
                        // Scroll to the current section
                        const sectionElement = document.getElementById(`${subject}-${section}`);
                        if (sectionElement) {
                            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 300);
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    setCurrentPage(subject, currentPage + 1);
                    container.firstChild.classList.add('loading');
                    setTimeout(() => {
                        renderQuestions(containerId, questions, isMcq, isOneMarks, subject, section);
                        // Scroll to the current section
                        const sectionElement = document.getElementById(`${subject}-${section}`);
                        if (sectionElement) {
                            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 300);
                }
            });
        }

        // Add event listeners for copy buttons and answer toggles
        addEventListeners(container);
    }, 500); // Loading delay
}

function addEventListeners(container) {
    // Copy buttons
    const copyButtons = container.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-text') || this.getAttribute('data-code');
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.classList.add('copied');
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        this.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    fallbackCopyText(textToCopy, this);
                });
            } else {
                fallbackCopyText(textToCopy, this);
            }
        });
    });

    // Toggle buttons for non-MCQ questions
    const toggleButtons = container.querySelectorAll('.toggle-answer-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const answerContent = this.closest('.answer-section').querySelector('.answer-content');
            const isHidden = answerContent.style.display === 'none';
            answerContent.style.display = isHidden ? 'block' : 'none';
            this.querySelector('i').className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
            this.setAttribute('aria-label', isHidden ? 'Hide answer' : 'Show answer');
        });
    });

    // Submit buttons for MCQ questions
    const submitButtons = container.querySelectorAll('.submit-btn');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionId = this.getAttribute('data-question-id');
            const correctAnswer = this.getAttribute('data-correct-answer');
            const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
            const feedbackDiv = document.getElementById(`${questionId}-feedback`);
            const tryAgainBtn = this.parentElement.querySelector('.try-again-btn');
            
            if (!selectedOption) {
                feedbackDiv.textContent = 'Please select an answer';
                feedbackDiv.style.color = '#FF5555';
                return;
            }

            const selectedAnswer = selectedOption.value;
            if (selectedAnswer === correctAnswer) {
                feedbackDiv.textContent = 'Correct!';
                feedbackDiv.style.color = '#4CAF50';
                this.disabled = true;
                selectedOption.disabled = true;
            } else {
                feedbackDiv.textContent = `Incorrect. The correct answer is ${correctAnswer.toUpperCase()}`;
                feedbackDiv.style.color = '#FF5555';
                this.style.display = 'none';
                tryAgainBtn.style.display = 'inline-block';
            }
        });
    });

    // Try Again buttons for MCQ questions
    const tryAgainButtons = container.querySelectorAll('.try-again-btn');
    tryAgainButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionId = this.getAttribute('data-question-id');
            const feedbackDiv = document.getElementById(`${questionId}-feedback`);
            const submitBtn = this.parentElement.querySelector('.submit-btn');
            const options = document.querySelectorAll(`input[name="${questionId}"]`);
            
            // Reset the question state
            feedbackDiv.textContent = '';
            this.style.display = 'none';
            submitBtn.style.display = 'inline-block';
            submitBtn.disabled = false;
            options.forEach(option => {
                option.disabled = false;
                option.checked = false;
            });
        });
    });
}

function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy text.');
    }
    document.body.removeChild(textArea);
}

export { renderQuestions, fallbackCopyText };