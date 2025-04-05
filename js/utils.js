function escapeHtmlForAttribute(str) {
    return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function tokenize(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);
}

function calculateRelevance(queryTokens, questionTokens, keywordTokens) {
    let score = 0;
    queryTokens.forEach(qToken => {
        questionTokens.forEach(qt => {
            if (qt.includes(qToken)) {
                score += 1;
                if (qt === qToken) score += 2;
                if (qt.startsWith(qToken)) score += 1;
            }
        });
        keywordTokens.forEach(kt => {
            if (kt.includes(qToken)) {
                score += 3;
                if (kt === qToken) score += 5;
                if (kt.startsWith(qToken)) score += 2;
            }
        });
    });
    return score;
}

export { escapeHtmlForAttribute, tokenize, calculateRelevance };