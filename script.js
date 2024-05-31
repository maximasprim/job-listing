document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.getElementById('job-listings');
    const roleFiltersContainer = document.getElementById('role-filters');
    const levelFiltersContainer = document.getElementById('level-filters');
    const languageFiltersContainer = document.getElementById('language-filters');
    const toolFiltersContainer = document.getElementById('tool-filters');

    let filters = {
        role: [],
        level: [],
        languages: [],
        tools: []
    };

    // Fetch data from data.json file
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Once data is fetched, loop through each job listing and create job cards
            data.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.classList.add('job-card');

                const newTag = job.new ? `<span class="new">New!</span>` : '';
                const featuredTag = job.featured ? `<span class="featured">Featured</span>` : '';

                jobCard.innerHTML = `
                    <div class="job-header">
                        <img src="${job.logo}" alt="${job.company}">
                        <div class="company-name">${job.company}</div>
                        <div class="new-featured">
                            ${newTag}
                            ${featuredTag}
                        </div>
                    </div>
                    <div class="job-details">
                        <div class="job-title">${job.position}</div>
                        <div class="tags-container">
                            <div class="tags">
                                <button class="tag" data-type="role" data-value="${job.role}">${job.role}</button>
                                <button class="tag" data-type="level" data-value="${job.level}">${job.level}</button>
                                ${job.languages.map(language => `<button class="tag" data-type="language" data-value="${language}">${language}</button>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="job-info">
                        <span>${job.postedAt}</span>
                        <span>${job.contract}</span>
                        <span>${job.location}</span>
                    </div>
                `;

                jobListingsContainer.appendChild(jobCard);
            });

            // Render filter buttons
            renderFilters(data);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });

    function renderFilters(data) {
        // Get unique values for each category
        const roles = [...new Set(data.map(job => job.role))];
        const levels = [...new Set(data.map(job => job.level))];
        const languages = data.reduce((acc, job) => acc.concat(job.languages), []);
        const tools = data.reduce((acc, job) => acc.concat(job.tools), []);

        // Create filter buttons for each category
        roles.forEach(role => createFilterButton(role, roleFiltersContainer, 'role'));
        levels.forEach(level => createFilterButton(level, levelFiltersContainer, 'level'));
        [...new Set(languages)].forEach(language => createFilterButton(language, languageFiltersContainer, 'language'));
        [...new Set(tools)].forEach(tool => createFilterButton(tool, toolFiltersContainer, 'tool'));
    }

    function createFilterButton(value, container, type) {
        const button = document.createElement('button');
        button.textContent = value;
        button.dataset.type = type;
        button.dataset.value = value;
        button.addEventListener('click', () => toggleFilter(type, value));
        container.appendChild(button);
    }

    function toggleFilter(type, value) {
        if (filters[type].includes(value)) {
            filters[type] = filters[type].filter(item => item !== value);
        } else {
            filters[type].push(value);
        }
        filterJobListings();
    }

    function filterJobListings() {
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const role = card.querySelector('.tag[data-type="role"]').dataset.value;
            const level = card.querySelector('.tag[data-type="level"]').dataset.value;
            const languages = [...card.querySelectorAll('.tag[data-type="language"]')].map(tag => tag.dataset.value);
            const tools = [...card.querySelectorAll('.tag[data-type="tool"]')].map(tag => tag.dataset.value);

            if (
                filters.role.length === 0 || filters.role.includes(role)
                && filters.level.length === 0 || filters.level.includes(level)
                && filters.languages.every(lang => languages.includes(lang))
                && filters.tools.every(tool => tools.includes(tool))
            ) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});
