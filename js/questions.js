import { renderQuestions } from './render.js';
import { tokenize } from './utils.js';

let allQuestions = [];
let questionMap = {};
let tokenizedCache = new Map();
let loadedSubjects = new Set();

const subjects = ['iot', 'java', 'wd', 'mad', 'net', 'practical'];

function loadSubjectData(subject) {
    if (loadedSubjects.has(subject)) return Promise.resolve();
    const container = document.querySelector('.con-qes');
    container.classList.add('loading');
    
    return fetch(`data/${subject}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${subject}.json`);
            return response.json();
        })
        .then(data => {
            window.subjectData = window.subjectData || {};
            window.subjectData[subject] = data;
            loadedSubjects.add(subject);

            // Process all question types
            ['mcq', 'onemarks', 'long'].forEach(section => {
                const questions = data[section] || [];
                questions.forEach((q, index) => {
                    const questionKey = `${subject}-${section}-${index}`;
                    const questionTokens = tokenize(q.question);
                    const keywordTokens = q.keywords ? tokenize(q.keywords.join(' ')) : [];
                    allQuestions.push({
                        question: q.question,
                        subject: subject,
                        key: questionKey,
                        type: section,
                        questionTokens: questionTokens,
                        keywordTokens: keywordTokens
                    });
                    tokenizedCache.set(questionKey, { questionTokens, keywordTokens });
                    questionMap[questionKey] = { subject, section: section, element: null, questionText: q.question };
                });
            });

            // Render all sections
            ['mcq', 'onemarks', 'long'].forEach(section => {
                const questions = data[section] || [];
                renderQuestions(`${subject}-${section}-questions`, questions, section === 'mcq', section === 'onemarks', subject, section);
            });

            container.classList.remove('loading');
        })
        .catch(error => {
            console.error(`Error fetching ${subject} questions:`, error);
            ['mcq', 'onemarks', 'long'].forEach(section => {
                document.getElementById(`${subject}-${section}-questions`).innerHTML = '<p>Error loading questions.</p>';
            });
            container.classList.remove('loading');
        });
}

// Add new function to load other sections on demand
function loadSectionData(subject, section) {
    if (!window.subjectData || !window.subjectData[subject]) {
        return loadSubjectData(subject).then(() => loadSectionData(subject, section));
    }

    const data = window.subjectData[subject];
    const questions = data[section] || [];
    
    // Process questions for search functionality
    questions.forEach((q, index) => {
        const questionKey = `${subject}-${section}-${index}`;
        if (!questionMap[questionKey]) {
            const questionTokens = tokenize(q.question);
            const keywordTokens = q.keywords ? tokenize(q.keywords.join(' ')) : [];
            allQuestions.push({
                question: q.question,
                subject: subject,
                key: questionKey,
                type: section,
                questionTokens: questionTokens,
                keywordTokens: keywordTokens
            });
            tokenizedCache.set(questionKey, { questionTokens, keywordTokens });
            questionMap[questionKey] = { subject, section: section, element: null, questionText: q.question };
        }
    });

    renderQuestions(`${subject}-${section}-questions`, questions, false, section === 'onemarks', subject, section);
}

function setupTabListeners() {
    const tabButtons = document.querySelectorAll('#pills-tab .btn');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', (e) => {
            const subject = e.target.getAttribute('data-bs-target').replace('#pills-', '');
            if (!loadedSubjects.has(subject)) {
                loadSubjectData(subject);
            }
        });
    });
}

function setupSectionButtons() {
    const sectionButtons = document.querySelectorAll('.q-head .btn');
    sectionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const href = button.getAttribute('href');
            const [subject, section] = href.replace('#', '').split('-');
            
            // Load section data if needed
            loadSectionData(subject, section);
            
            // Scroll to the section
            const sectionElement = document.getElementById(`${subject}-${section}`);
            if (sectionElement) {
                sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupImpButtons() {
    const impButtons = document.querySelectorAll('.q-head .btn[data-subject]');
    impButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = button.getAttribute('data-subject');
            if (!loadedSubjects.has(subject)) {
                loadSubjectData(subject).then(() => {
                    renderImpQuestions(subject);
                    // Scroll to IMP section
                    const impSection = document.getElementById(`${subject}-imp`);
                    if (impSection) {
                        impSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            } else {
                renderImpQuestions(subject);
                // Scroll to IMP section
                const impSection = document.getElementById(`${subject}-imp`);
                if (impSection) {
                    impSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function renderImpQuestions(subject) {
    const impContainerId = `${subject}-imp-questions`;
    const impContainer = document.getElementById(impContainerId);
    impContainer.innerHTML = '';

    let impQuestions = [];
    if (window.subjectData[subject].imp && window.subjectData[subject].imp.length > 0) {
        impQuestions = window.subjectData[subject].imp;
    } else {
        ['mcq', 'onemarks', 'long'].forEach(section => {
            const questions = window.subjectData[subject][section] || [];
            questions.forEach(q => {
                if (q.isImportant) impQuestions.push(q);
            });
        });
    }

    if (impQuestions.length === 0) {
        impContainer.innerHTML = '<p>No important questions available.</p>';
    } else {
        renderQuestions(impContainerId, impQuestions, false, false, subject, 'imp');
    }
    document.getElementById(`${subject}-imp`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initializeQuestions() {
    loadSubjectData('iot').then(() => {
        setupTabListeners();
        setupSectionButtons();
        setupImpButtons();
    });

    return { allQuestions, questionMap, tokenizedCache };
}

export { initializeQuestions };