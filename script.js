document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.getElementById('job-listings');

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
                        <div class="job-title-role">
                            <div class="job-title">${job.position}</div>
                            <span class="level">${job.level}</span>
                        </div>
                        <div class="tags-container">
                            <div class="tags">
                                <span class="tag">${job.position}</span>
                            </div>
                            <div class="tags">
                                <span class="tag">${job.level}</span>
                            </div>
                            <div class="tags">
                                <span class="tag">HTML</span>
                                <span class="tag">CSS</span>
                                <span class="tag">JavaScript</span>
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
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
});
