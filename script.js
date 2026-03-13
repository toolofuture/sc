document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const appForm = document.getElementById('app-form');
    const modal = document.getElementById('entry-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const itemCountSpan = document.getElementById('item-count');

    let applications = JSON.parse(localStorage.getItem('museum_apps')) || [];

    // Initial Render
    renderGallery();

    // Modal Control
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Form Submission
    appForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newApp = {
            id: Date.now(),
            title: document.getElementById('title').value,
            type: document.getElementById('type').value,
            date: document.getElementById('date').value,
            location: document.getElementById('location').value,
            note: document.getElementById('note').value,
            timestamp: new Date().toISOString()
        };

        applications.push(newApp);
        saveAndRender();
        
        appForm.reset();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    function saveAndRender() {
        // Sort by date before saving
        applications.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('museum_apps', JSON.stringify(applications));
        renderGallery();
    }

    function renderGallery() {
        if (applications.length === 0) {
            galleryGrid.innerHTML = '<div class="empty-gallery">갤러리가 비어 있습니다. 당신의 일정을 예술처럼 기록해보세요.</div>';
            itemCountSpan.textContent = '0';
            return;
        }

        itemCountSpan.textContent = applications.length;
        galleryGrid.innerHTML = '';

        applications.forEach(app => {
            const card = document.createElement('div');
            card.className = 'artwork-card';
            
            const typeLabels = {
                seminar: 'Seminar / Conference',
                education: 'Offline Training',
                recruitment: 'Recruitment / Exam',
                online: 'Online Course',
                other: 'Other'
            };

            card.innerHTML = `
                <div class="artwork-type">${typeLabels[app.type] || 'Collection'}</div>
                <h3 class="artwork-title">${app.title}</h3>
                <div class="artwork-date">${formatDate(app.date)}</div>
                <div class="artwork-location">${app.location || 'Unknown Location'}</div>
                ${app.note ? `<p style="font-size: 0.8rem; color: #888; margin-top: 15px; border-top: 0.5px solid #eee; padding-top: 10px;">${app.note}</p>` : ''}
                <button onclick="deleteEntry(${app.id})" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; color: #ddd; font-size: 0.8rem;">Remove</button>
            `;

            galleryGrid.appendChild(card);
        });
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
        return new Date(dateStr).toLocaleDateString('ko-KR', options);
    }

    // Global delete function for simplicity
    window.deleteEntry = function(id) {
        if(confirm('이 기록을 파기하시겠습니까?')) {
            applications = applications.filter(app => app.id !== id);
            saveAndRender();
        }
    };
});
