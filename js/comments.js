import { db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

function initializeComments(currentUserFn) {
    const commentInput = document.getElementById('commentInput');
    const postCommentBtn = document.getElementById('postCommentBtn');
    const commentList = document.getElementById('commentList');
    const loadMoreCommentsBtn = document.getElementById('loadMoreCommentsBtn');
    const commentSection = document.querySelector('.comment-section');
    const COMMENTS_PER_PAGE = 10;
    let lastVisible = null;

    async function fetchComments(page = 0) {
        commentSection.classList.add('loading');
        try {
            let q = query(
                collection(db, 'comments'),
                orderBy('timestamp', 'desc'),
                limit(COMMENTS_PER_PAGE)
            );
            if (page > 0 && lastVisible) {
                q = query(
                    collection(db, 'comments'),
                    orderBy('timestamp', 'desc'),
                    startAfter(lastVisible),
                    limit(COMMENTS_PER_PAGE)
                );
            }
            const snapshot = await getDocs(q);
            const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (page === 0) commentList.innerHTML = '';
            comments.forEach(comment => {
                if (!document.querySelector(`[data-comment-id="${comment.id}"]`)) {
                    const commentDiv = document.createElement('div');
                    commentDiv.classList.add('comment');
                    commentDiv.setAttribute('data-comment-id', comment.id);
                    commentDiv.innerHTML = `
                        <div class="comment-header">
                            <img src="${comment.image || 'https://via.placeholder.com/50'}" alt="${comment.name}'s profile" class="comment-image">
                            <span class="comment-name">${comment.name || 'Anonymous'}</span>
                        </div>
                        <p class="comment-text">${comment.text.replace(/</g, '<').replace(/>/g, '>')}</p>
                        <p class="comment-timestamp">${new Date(comment.timestamp).toLocaleString()}</p>
                    `;
                    commentList.appendChild(commentDiv);
                }
            });
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            loadMoreCommentsBtn.style.display = comments.length < COMMENTS_PER_PAGE ? 'none' : 'block';
        } catch (error) {
            console.error('Error fetching comments:', error);
            commentList.innerHTML = '<p>Error loading comments.</p>';
        } finally {
            commentSection.classList.remove('loading');
        }
    }

    async function postComment() {
        const commentText = commentInput.value.trim();
        if (!commentText) {
            alert('Please enter a comment.');
            return;
        }
        const currentUser = currentUserFn();
        if (!currentUser) {
            alert('Please sign in to post a comment.');
            return;
        }
        postCommentBtn.disabled = true;
        try {
            await addDoc(collection(db, 'comments'), {
                text: commentText,
                name: currentUser.displayName || "Anonymous",
                image: currentUser.photoURL || "https://via.placeholder.com/50",
                timestamp: new Date().toISOString()
            });
            commentInput.value = '';
            fetchComments(0);
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment.');
        } finally {
            postCommentBtn.disabled = false;
        }
    }

    postCommentBtn.addEventListener('click', postComment);
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postComment();
        }
    });
    loadMoreCommentsBtn.addEventListener('click', () => fetchComments(lastVisible ? 1 : 0));
    fetchComments(0);
}

export { initializeComments };