const API_KEY = 'AIzaSyBBB1Gm5z-cGJT_WuA287H6w97zAd64KQw';
const RESULTS_PER_TOPIC = 6;

class CourseAPI {
    constructor() {
        this.coursesGrid = document.getElementById('courses-grid');
        this.loading = document.getElementById('loading');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById('nav-search-input');
        this.searchButton = document.getElementById('nav-search-button');
        this.currentPage = 1;
        this.currentQuery = '';
        this.init();
        this.setupSearchRedirect();
        this.setupMobileMenu();
    }

    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveFilter(btn);
                this.fetchVideos(btn.dataset.topic);
            });
        });

        // Load initial videos
        this.fetchVideos('web development');
    }

    setActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }

    async fetchVideos(topic) {
        try {
            this.showLoading(true);
            this.coursesGrid.innerHTML = '';

            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic} tutorial&type=video&maxResults=${RESULTS_PER_TOPIC}&key=${API_KEY}`);
            const data = await response.json();

            if (data.items) {
                this.renderVideos(data.items);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            this.coursesGrid.innerHTML = '<p class="error">Error loading courses. Please try again later.</p>';
        } finally {
            this.showLoading(false);
        }
    }

    renderVideos(videos) {
        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'youtube-card';
            card.innerHTML = `
                <div class="video-container">
                    <iframe
                        src="https://www.youtube.com/embed/${video.id.videoId}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-info">
                    <h3>${video.snippet.title}</h3>
                    <div class="video-meta">
                        <span>${video.snippet.channelTitle}</span>
                        <span>${this.formatDate(video.snippet.publishedAt)}</span>
                    </div>
                    <div class="video-actions">
                        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
                           class="watch-btn" 
                           target="_blank">
                            <i class="fas fa-play"></i> Watch Course
                        </a>
                    </div>
                </div>
            `;
            this.coursesGrid.appendChild(card);
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    setupSearchRedirect() {
        // Handle search button click
        this.searchButton.addEventListener('click', () => {
            this.handleSearchRedirect();
        });

        // Handle Enter key press
        this.searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.handleSearchRedirect();
            }
        });
    }

    async fetchUdemyCourses(query, page = 1) {
        try {
            this.showLoading(true);
            this.currentQuery = query;
            this.currentPage = page;

            const response = await fetch(`https://udemyfreecourses.org/ajax/search.php?query=${encodeURIComponent(query)}&p=${page}&rand=${Math.random()}`);
            const data = await response.json();

            if (data.courses) {
                this.renderCourses(data.courses);
                this.addPagination();
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            this.coursesGrid.innerHTML = '<p class="error">Error loading courses. Please try again.</p>';
        } finally {
            this.showLoading(false);
        }
    }

    addPagination() {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.innerHTML = `
            <button class="page-btn prev" ${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span class="page-info">Page ${this.currentPage}</span>
            <button class="page-btn next">Next</button>
        `;

        paginationDiv.querySelector('.prev').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.fetchUdemyCourses(this.currentQuery, this.currentPage - 1);
            }
        });

        paginationDiv.querySelector('.next').addEventListener('click', () => {
            this.fetchUdemyCourses(this.currentQuery, this.currentPage + 1);
        });

        this.coursesGrid.appendChild(paginationDiv);
    }

    renderCourses(courses) {
        this.coursesGrid.innerHTML = '';
        
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}">
                    <span class="course-tag">${course.price}</span>
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <div class="course-meta">
                        <span><i class="fas fa-user"></i> ${course.instructor}</span>
                        <span><i class="fas fa-star"></i> ${course.rating}</span>
                    </div>
                    <a href="${course.url}" target="_blank" class="course-btn">
                        Get Course
                    </a>
                </div>
            `;
            this.coursesGrid.appendChild(card);
        });
    }

    handleSearchRedirect() {
        const query = this.searchInput.value.trim();
        if (query.length < 3) {
            alert('Search term is too short or empty.');
            return;
        }
        
        // Use internal search instead of redirect
        this.fetchUdemyCourses(query);
        document.querySelector('#courses').scrollIntoView({ behavior: 'smooth' });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const searchToggle = document.querySelector('.search-toggle');
        const navSearch = document.querySelector('.nav-search');

        mobileMenuBtn?.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
        });

        searchToggle?.addEventListener('click', () => {
            navSearch?.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks?.classList.remove('active');
                navSearch?.classList.remove('active');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks?.classList.remove('active');
                navSearch?.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CourseAPI();
});
