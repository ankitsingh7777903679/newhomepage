import { initializeAuth } from './auth.js';
import { initializeQuestions } from './questions.js';
import { initializeSearch } from './search.js';
import { initializeComments } from './comments.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentUserFn = initializeAuth();
    const { allQuestions, questionMap, tokenizedCache } = initializeQuestions();
    initializeSearch(allQuestions, questionMap, tokenizedCache);
    initializeComments(currentUserFn);

    const backToTopBtn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});