document.addEventListener('DOMContentLoaded', () => {
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    const createCategoryModal = document.getElementById('createCategoryModal');
    const closeModal = document.querySelector('.close');
    const createCategoryForm = document.getElementById('createCategoryForm');
    const categoryTableBody = document.getElementById('categoryTableBody');

    // Show category creation modal on button click
    createCategoryBtn.addEventListener('click', () => {
        createCategoryModal.style.display = 'block';
    });

    // Close modal when close button or outside modal is clicked
    closeModal.onclick = function() {
        createCategoryModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === createCategoryModal) {
            createCategoryModal.style.display = 'none';
        }
    };

    // Handle form submission for creating category
    createCategoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(createCategoryForm);
        const payload = {
            others:{'userName':"user"}
        };

        // Manually add form data to payload
        formData.forEach((value, key) => {
            payload[key] = value;
        });

        // Add autogenerated fields
        // payload['entryId'] = generateEntryId(); // Example function to generate entryId
        // payload['timestamp'] = Date.now(); // Use current timestamp

        console.log('Form Payload:', payload); // Debugging line

        try {
            const response = await fetch('https://acutiva.duckdns.org/createCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Create Category Response:', data); // Debugging line

            if (data.status) {
                alert('Category created successfully');
                fetchAllCategories(); // Update category list
                createCategoryModal.style.display = 'none';
            } else {
                alert('Error creating category: ' + data.log);
            }
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Error creating category. Please check console for details.');
        }
    });

    // Function to fetch all categories and populate the table
    function fetchAllCategories() {
        fetch('https://acutiva.duckdns.org/fetchAllCategories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                displayCategories(data.log); // Update to use data.log
            } else {
                alert('Error fetching categories: ' + data.log);
            }
        })
        .catch(error => console.error('Error fetching categories:', error));
    }

    // Function to display categories in the table
    function displayCategories(categories) {
        categoryTableBody.innerHTML = ''; // Clear previous data
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.category}</td>
            `;
            categoryTableBody.appendChild(row);
        });
    }

    // Initial fetch to populate the category table
    fetchAllCategories();
});
