const courseCategories = {
    development: {
        id: 288,
        name: "Development",
        subcategories: [
            { id: 8, name: "Web Development" },
            { id: 588, name: "Data Science" },
            { id: 10, name: "Mobile Apps" },
            // ...other development categories
        ]
    },
    design: {
        id: 269,
        name: "Design",
        subcategories: [
            { id: 6, name: "Web Design" },
            { id: 110, name: "Graphic Design" },
            // ...other design categories
        ]
    },
    // Add other main categories
};

class CourseService {
    constructor() {
        this.categories = courseCategories;
        this.currentCategory = null;
    }

    async searchCourses(query, category = null) {
        const searchParams = new URLSearchParams({
            q: `${query} ${category ? 'category:' + category : ''}`,
            maxResults: 12,
            part: 'snippet',
            type: 'video',
            key: API_KEY
        });

        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
        return await response.json();
    }

    getCategoryPath(categoryId) {
        // Helper to get category breadcrumb path
        return Object.values(this.categories).find(cat => 
            cat.id === categoryId || cat.subcategories.some(sub => sub.id === categoryId)
        );
    }
}
