// Admin credentials
const ADMIN_EMAIL = "dzoldybaevaldiar@gmail.com";
const ADMIN_PASSWORD = "Astana2001";

// Sample Data (Empty to start)
let currentUser = null;
let tasks = [];

// User settings data
let userSettings = {
    cardNumber: '#1234 5678 9023 4567',
    nameUpdated: null,
    phoneUpdated: null,
    emailUpdated: null,
    cardUpdated: null,
    passwordUpdated: null
};

// Platform settings
let platformSettings = {
    commissionRate: 5,
    minTaskPayment: 5,
    withdrawalFee: 1.50,
    platformName: "Local Task Kz",
    platformBalance: 0
};

// All users storage
let allUsers = [];

// DOM Elements
const authPage = document.getElementById('authPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const customerDashboard = document.getElementById('customerDashboard');
const workerDashboard = document.getElementById('workerDashboard');
const adminPanel = document.getElementById('adminPanel');
const postTaskView = document.getElementById('postTaskView');
const reviewsView = document.getElementById('reviewsView');
const walletView = document.getElementById('walletView');
const settingsView = document.getElementById('settingsView');
const customerTasks = document.getElementById('customerTasks');
const workerTasks = document.getElementById('workerTasks');
const newTaskForm = document.getElementById('newTaskForm');
const postTaskBtn = document.getElementById('postTaskBtn');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const reviewModal = document.getElementById('reviewModal');
const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
const customerReviewModal = document.getElementById('customerReviewModal');
const closeCustomerReviewModalBtn = document.getElementById('closeCustomerReviewModalBtn');
const reviewForm = document.getElementById('reviewForm');
const customerReviewForm = document.getElementById('customerReviewForm');
const ratingStars = document.querySelectorAll('.star');
const customerRatingStars = document.querySelectorAll('#customerRatingStars .star');
const selectedRating = document.getElementById('selectedRating');
const customerSelectedRating = document.getElementById('customerSelectedRating');
const reviewsList = document.getElementById('reviewsList');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');
const workerAvatar = document.getElementById('workerAvatar');
const workerName = document.getElementById('workerName');
const adminAvatar = document.getElementById('adminAvatar');
const adminName = document.getElementById('adminName');
const filterBtns = document.querySelectorAll('.filter-btn');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const editSettingsModal = document.getElementById('editSettingsModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const editSettingsForm = document.getElementById('editSettingsForm');
const editModalTitle = document.getElementById('editModalTitle');
const editFieldLabel = document.getElementById('editFieldLabel');
const editFieldValue = document.getElementById('editFieldValue');
const editFieldType = document.getElementById('editFieldType');
const passwordRequirements = document.getElementById('passwordRequirements');
const adminMenuItem = document.getElementById('adminMenuItem');

// Current task for review
let currentTaskForReview = null;
let currentTaskForCustomerReview = null;
let currentEditField = null;

// Initialize data
function initializeData() {
    // Check if platform settings exist
    const savedSettings = localStorage.getItem('platformSettings');
    if (savedSettings) {
        platformSettings = JSON.parse(savedSettings);
    } else {
        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
    }
    
    // Check if all users exist
    const savedUsers = localStorage.getItem('allUsers');
    if (savedUsers) {
        allUsers = JSON.parse(savedUsers);
    } else {
        // Create admin user if not exists
        const adminUser = {
            id: 1,
            name: "Admin",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            phone: "+7 700 000 0000",
            type: "admin",
            avatar: "A",
            balance: 10000.00,
            joinDate: new Date().toISOString(),
            lastLogin: null
        };
        
        // Create demo users
        const demoUsers = [
            {
                id: 2,
                name: "John Customer",
                email: "customer@example.com",
                password: "password",
                phone: "7701234567",
                type: "customer",
                avatar: "J",
                balance: 100.00,
                joinDate: "2023-12-01T10:00:00Z",
                lastLogin: new Date().toISOString()
            },
            {
                id: 3,
                name: "Alex Worker",
                email: "worker@example.com",
                password: "password",
                phone: "7707654321",
                type: "worker",
                avatar: "A",
                balance: 50.00,
                joinDate: "2023-12-02T11:00:00Z",
                lastLogin: new Date().toISOString()
            },
            {
                id: 4,
                name: "Sarah Johnson",
                email: "sarah@example.com",
                password: "password",
                phone: "7709876543",
                type: "customer",
                avatar: "S",
                balance: 200.00,
                joinDate: "2023-12-03T12:00:00Z",
                lastLogin: null
            }
        ];
        
        allUsers = [adminUser, ...demoUsers];
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
    
    // Check if tasks exist
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    initializeData();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    const savedUserSettings = localStorage.getItem('userSettings');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (savedUserSettings) {
            userSettings = JSON.parse(savedUserSettings);
        }
        
        if (currentUser.type === 'admin') {
            showAdminPanel();
        } else {
            showDashboard();
        }
    }
    
    // Auth tabs
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    signupTab.addEventListener('click', () => switchAuthTab('signup'));
    
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Signup form
    signupForm.addEventListener('submit', handleSignup);
    
    // Post task button
    postTaskBtn.addEventListener('click', () => showView('postTask'));
    
    // Back to dashboard button
    backToDashboardBtn.addEventListener('click', () => showDashboard());
    
    // Modal close buttons
    closeModalBtn.addEventListener('click', () => taskDetailsModal.classList.remove('active'));
    closeReviewModalBtn.addEventListener('click', () => reviewModal.classList.remove('active'));
    closeCustomerReviewModalBtn.addEventListener('click', () => customerReviewModal.classList.remove('active'));
    closeEditModalBtn.addEventListener('click', () => editSettingsModal.classList.remove('active'));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === taskDetailsModal) {
            taskDetailsModal.classList.remove('active');
        }
        if (e.target === reviewModal) {
            reviewModal.classList.remove('active');
        }
        if (e.target === customerReviewModal) {
            customerReviewModal.classList.remove('active');
        }
        if (e.target === editSettingsModal) {
            editSettingsModal.classList.remove('active');
        }
    });
    
    // Rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            selectedRating.value = rating;
            
            ratingStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    customerRatingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            customerSelectedRating.value = rating;
            
            customerRatingStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // Review forms
    reviewForm.addEventListener('submit', handleReviewSubmit);
    customerReviewForm.addEventListener('submit', handleCustomerReviewSubmit);
    
    // New task form
    newTaskForm.addEventListener('submit', handleNewTask);
    
    // Settings form
    editSettingsForm.addEventListener('submit', handleEditSettings);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (currentUser.type === 'customer') {
                loadCustomerTasks(filter);
            } else {
                loadWorkerTasks(filter);
            }
        });
    });
    
    // Sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            
            if (currentUser.type === 'admin') {
                if (view === 'adminPanel') {
                    showAdminPanel();
                } else {
                    showView(view);
                }
            } else {
                if (view === 'myTasks' || view === 'availableTasks') {
                    showDashboard();
                } else {
                    showView(view);
                }
            }
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Edit buttons for settings
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-btn')) {
            const editBtn = e.target.closest('.edit-btn');
            const field = editBtn.getAttribute('data-field');
            openEditModal(field);
        }
    });
    
    // Admin panel event listeners
    document.getElementById('refreshUsersBtn')?.addEventListener('click', () => {
        loadUsersTable('all');
    });
    
    document.getElementById('refreshTasksBtn')?.addEventListener('click', () => {
        loadTasksTable();
    });
    
    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
        savePlatformSettings();
    });
    
    document.getElementById('resetSettingsBtn')?.addEventListener('click', () => {
        resetPlatformSettings();
    });
    
    document.getElementById('withdrawPlatformBtn')?.addEventListener('click', () => {
        withdrawPlatformFunds();
    });
    
    document.getElementById('createUserBtn')?.addEventListener('click', () => {
        createNewUser();
    });
    
    document.getElementById('exportUsersBtn')?.addEventListener('click', () => {
        exportUsers();
    });
    
    document.getElementById('viewAllTransactionsBtn')?.addEventListener('click', () => {
        viewAllTransactions();
    });
    
    // User filter buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.user-filters .filter-btn')) {
            const filterBtn = e.target.closest('.filter-btn');
            const filter = filterBtn.getAttribute('data-user-filter');
            
            document.querySelectorAll('.user-filters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            filterBtn.classList.add('active');
            
            loadUsersTable(filter);
        }
    });
});

// Functions
function switchAuthTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        currentUser = {
            name: "Admin",
            email: email,
            phone: "+7 700 000 0000",
            password: password,
            type: "admin",
            avatar: "A",
            balance: platformSettings.platformBalance
        };
        
        // Update admin last login
        const adminIndex = allUsers.findIndex(u => u.email === ADMIN_EMAIL);
        if (adminIndex !== -1) {
            allUsers[adminIndex].lastLogin = new Date().toISOString();
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAdminPanel();
        return;
    }
    
    // Check regular users
    const foundUser = allUsers.find(user => user.email === email && user.password === password);
    
    if (foundUser) {
        currentUser = {
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            password: foundUser.password,
            type: foundUser.type,
            avatar: foundUser.avatar,
            balance: foundUser.balance
        };
        
        // Update last login
        foundUser.lastLogin = new Date().toISOString();
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDashboard();
    } else {
        alert('Invalid email or password');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    // Simple validation
    if (!name || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }
    
    // Check if user already exists
    if (allUsers.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    // Create new user ID
    const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;
    
    // Create user object
    const newUser = {
        id: newId,
        name: name,
        email: email,
        phone: phone,
        password: password,
        type: userType,
        avatar: name.charAt(0).toUpperCase(),
        balance: 0.00,
        joinDate: new Date().toISOString(),
        lastLogin: null
    };
    
    // Add to all users
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Set as current user
    currentUser = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        type: userType,
        avatar: name.charAt(0).toUpperCase(),
        balance: 0.00
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showDashboard();
}

function showDashboard() {
    authPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    
    // Update user info
    if (currentUser) {
        userAvatar.textContent = currentUser.avatar;
        userName.textContent = currentUser.name;
        userRole.textContent = currentUser.type === 'customer' ? 'Customer' : 'Worker';
        
        // Update worker info if applicable
        if (currentUser.type === 'worker') {
            workerAvatar.textContent = currentUser.avatar;
            workerName.textContent = currentUser.name;
        }
        
        // Show appropriate dashboard
        if (currentUser.type === 'customer') {
            customerDashboard.style.display = 'block';
            workerDashboard.style.display = 'none';
            loadCustomerTasks('all');
        } else {
            customerDashboard.style.display = 'none';
            workerDashboard.style.display = 'block';
            loadWorkerTasks('all');
        }
        
        // Hide other views
        adminPanel.style.display = 'none';
        postTaskView.style.display = 'none';
        reviewsView.style.display = 'none';
        walletView.style.display = 'none';
        settingsView.style.display = 'none';
        
        // Update sidebar active link
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (currentUser.type === 'customer' && link.getAttribute('data-view') === 'myTasks') {
                link.classList.add('active');
            } else if (currentUser.type === 'worker' && link.getAttribute('data-view') === 'availableTasks') {
                link.classList.add('active');
            }
        });
        
        // Hide admin menu for non-admin users
        adminMenuItem.style.display = 'none';
    }
}

function showAdminPanel() {
    authPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    
    // Update user info
    if (currentUser) {
        userAvatar.textContent = currentUser.avatar;
        userName.textContent = currentUser.name;
        userRole.textContent = "Super Admin";
        userRole.style.backgroundColor = "#dc2626";
        userRole.style.color = "white";
        
        adminAvatar.textContent = currentUser.avatar;
        adminName.textContent = currentUser.name;
    }
    
    // Hide all other views
    customerDashboard.style.display = 'none';
    workerDashboard.style.display = 'none';
    postTaskView.style.display = 'none';
    reviewsView.style.display = 'none';
    walletView.style.display = 'none';
    settingsView.style.display = 'none';
    adminPanel.style.display = 'block';
    
    // Show admin menu
    adminMenuItem.style.display = 'block';
    
    // Load admin data
    loadAdminDashboard();
    
    // Update sidebar active link
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === 'adminPanel') {
            link.classList.add('active');
        }
    });
}

function showView(view) {
    // Hide all views
    customerDashboard.style.display = 'none';
    workerDashboard.style.display = 'none';
    adminPanel.style.display = 'none';
    postTaskView.style.display = 'none';
    reviewsView.style.display = 'none';
    walletView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Show requested view
    if (view === 'postTask') {
        postTaskView.style.display = 'block';
        // Set tomorrow's date as default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0);
        document.getElementById('taskTime').value = tomorrow.toISOString().slice(0, 16);
    } else if (view === 'reviews') {
        reviewsView.style.display = 'block';
        loadReviews();
    } else if (view === 'wallet') {
        walletView.style.display = 'block';
        loadWallet();
    } else if (view === 'settings') {
        settingsView.style.display = 'block';
        loadSettings();
        updateTransactionStats();
    }
}

function loadCustomerTasks(filter) {
    customerTasks.innerHTML = '';
    
    let filteredTasks = tasks;
    
    // Filter tasks based on status
    if (filter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === filter);
    }
    
    // Filter tasks for current customer
    filteredTasks = filteredTasks.filter(task => task.customer === currentUser.name);
    
    if (filteredTasks.length === 0) {
        customerTasks.innerHTML = `
            <div class="no-tasks" style="grid-column: 1 / -1;">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started!</p>
                <button class="btn btn-primary" id="postTaskFromEmptyBtn" style="margin-top: 15px;">
                    <i class="fas fa-plus"></i> Post New Task
                </button>
            </div>
        `;
        
        document.getElementById('postTaskFromEmptyBtn')?.addEventListener('click', () => showView('postTask'));
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task, 'customer');
        customerTasks.appendChild(taskCard);
    });
}

function loadWorkerTasks(filter) {
    workerTasks.innerHTML = '';
    
    let filteredTasks = tasks;
    
    // Filter tasks based on status
    if (filter === 'posted') {
        filteredTasks = tasks.filter(task => task.status === 'posted');
    } else if (filter === 'accepted') {
        filteredTasks = tasks.filter(task => task.status === 'accepted' && task.worker === currentUser.name);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.status === 'completed' && task.worker === currentUser.name);
    } else {
        // For 'all', show available tasks + worker's accepted/completed tasks
        filteredTasks = tasks.filter(task => 
            task.status === 'posted' || 
            (task.worker === currentUser.name && (task.status === 'accepted' || task.status === 'completed'))
        );
    }
    
    if (filteredTasks.length === 0) {
        workerTasks.innerHTML = `
            <div class="no-tasks" style="grid-column: 1 / -1;">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks available</h3>
                <p>${filter === 'posted' ? 'No tasks have been posted yet. Check back later!' : 'You have no tasks in this category.'}</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task, 'worker');
        workerTasks.appendChild(taskCard);
    });
}

function createTaskCard(task, userType) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.taskId = task.id;
    
    // Status badge
    let statusBadge = '';
    if (task.status === 'posted') {
        statusBadge = '<span class="task-status status-posted">Posted</span>';
    } else if (task.status === 'accepted') {
        statusBadge = '<span class="task-status status-accepted">Accepted</span>';
    } else if (task.status === 'completed') {
        statusBadge = '<span class="task-status status-completed">Completed</span>';
    } else if (task.status === 'canceled') {
        statusBadge = '<span class="task-status status-canceled">Canceled</span>';
    }
    
    // Action buttons
    let actionButtons = '';
    if (userType === 'customer') {
        if (task.status === 'posted') {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                <button class="btn btn-danger btn-cancel-task">Cancel</button>
            `;
        } else if (task.status === 'completed') {
            // Customer can review worker after task completion
            const hasCustomerReview = task.reviews.some(review => review.reviewer === currentUser.name && review.type === 'customer_review');
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                ${!hasCustomerReview ? '<button class="btn btn-primary btn-rate-worker">Rate Worker</button>' : ''}
            `;
        } else {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
            `;
        }
    } else {
        if (task.status === 'posted') {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                <button class="btn btn-success btn-accept-task">Accept</button>
            `;
        } else if (task.status === 'accepted' && task.worker === currentUser.name) {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                <button class="btn btn-success btn-complete-task">Complete Task</button>
            `;
        } else if (task.status === 'completed' && task.worker === currentUser.name) {
            // Worker can review task/experience
            const hasWorkerReview = task.reviews.some(review => review.reviewer === currentUser.name && review.type === 'worker_review');
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
                ${!hasWorkerReview ? '<button class="btn btn-primary btn-leave-review">Leave Review</button>' : ''}
            `;
        } else {
            actionButtons = `
                <button class="btn btn-secondary btn-view-details">View Details</button>
            `;
        }
    }
    
    card.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
        </div>
        <div class="task-details">
            <div class="task-detail">
                <i class="fas fa-dollar-sign"></i>
                <span class="task-price">$${task.payment}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${task.location}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-calendar-alt"></i>
                <span>${task.scheduledTime}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-user"></i>
                <span>Customer: ${task.customer}</span>
            </div>
            ${task.worker ? `
            <div class="task-detail">
                <i class="fas fa-user-check"></i>
                <span>Worker: ${task.worker}</span>
            </div>
            ` : ''}
        </div>
        <div class="task-footer">
            ${statusBadge}
            <div class="task-actions">
                ${actionButtons}
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const viewDetailsBtn = card.querySelector('.btn-view-details');
    viewDetailsBtn.addEventListener('click', () => showTaskDetails(task.id));
    
    if (userType === 'customer') {
        const cancelBtn = card.querySelector('.btn-cancel-task');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => cancelTask(task.id));
        }
        
        const rateWorkerBtn = card.querySelector('.btn-rate-worker');
        if (rateWorkerBtn) {
            rateWorkerBtn.addEventListener('click', () => openCustomerReviewModal(task.id));
        }
    } else {
        const acceptBtn = card.querySelector('.btn-accept-task');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to accept this task?')) {
                    acceptTask(task.id);
                }
            });
        }
        
        const completeBtn = card.querySelector('.btn-complete-task');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                if (confirm('Mark this task as completed?')) {
                    completeTask(task.id);
                }
            });
        }
        
        const leaveReviewBtn = card.querySelector('.btn-leave-review');
        if (leaveReviewBtn) {
            leaveReviewBtn.addEventListener('click', () => openReviewModal(task.id));
        }
    }
    
    return card;
}

function showTaskDetails(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('modalTaskTitle').textContent = task.title;
    
    let reviewsHtml = '';
    if (task.reviews.length > 0) {
        reviewsHtml = `
            <h3 style="margin-top: 20px; margin-bottom: 15px;">Reviews</h3>
            ${task.reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-name">${review.reviewer}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                    <div class="review-text">${review.comment}</div>
                </div>
            `).join('')}
        `;
    } else {
        reviewsHtml = '<p style="text-align: center; color: var(--gray); margin-top: 20px;">No reviews yet</p>';
    }
    
    document.getElementById('modalTaskBody').innerHTML = `
        <div class="task-details">
            <div class="task-detail">
                <i class="fas fa-dollar-sign"></i>
                <span class="task-price">$${task.payment}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${task.location}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-calendar-alt"></i>
                <span>${task.scheduledTime}</span>
            </div>
            <div class="task-detail">
                <i class="fas fa-user"></i>
                <span>Customer: ${task.customer}</span>
            </div>
            ${task.worker ? `
            <div class="task-detail">
                <i class="fas fa-user-check"></i>
                <span>Worker: ${task.worker}</span>
            </div>
            ` : ''}
            <div class="task-detail">
                <i class="fas fa-phone"></i>
                <span>Contact: ${task.customerPhone}</span>
            </div>
        </div>
        <div style="margin-top: 25px;">
            <h3 style="margin-bottom: 15px;">Description</h3>
            <p>${task.description}</p>
        </div>
        ${reviewsHtml}
    `;
    
    taskDetailsModal.classList.add('active');
}

function handleNewTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const category = document.getElementById('taskCategory').value;
    const payment = parseFloat(document.getElementById('taskPayment').value);
    const location = document.getElementById('taskLocation').value;
    const time = document.getElementById('taskTime').value;
    
    // Format the date
    const dateObj = new Date(time);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth()+1).toString().padStart(2, '0')}.${dateObj.getFullYear()}, ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:00`;
    
    // Create new task
    const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        category: category,
        payment: payment,
        location: location,
        scheduledTime: formattedDate,
        customer: currentUser.name,
        customerPhone: currentUser.phone,
        worker: null,
        status: 'posted',
        reviews: [],
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Reset form
    newTaskForm.reset();
    
    // Set default time for next task
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0);
    document.getElementById('taskTime').value = tomorrow.toISOString().slice(0, 16);
    
    // Show success message and return to dashboard
    alert('Task posted successfully!');
    showDashboard();
    loadCustomerTasks('all');
    
    // Update transaction stats
    updateTransactionStats();
}

function acceptTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].worker = currentUser.name;
        tasks[taskIndex].status = 'accepted';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Reload tasks
        loadWorkerTasks('all');
        alert('Task accepted successfully!');
    }
}

function completeTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = 'completed';
        tasks[taskIndex].completedAt = new Date().toISOString();
        
        // Calculate commission
        const commission = tasks[taskIndex].payment * (platformSettings.commissionRate / 100);
        tasks[taskIndex].commission = commission;
        
        // Update platform balance
        platformSettings.platformBalance += commission;
        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Reload tasks
        loadWorkerTasks('all');
        alert('Task marked as completed!');
        
        // Update transaction stats
        updateTransactionStats();
    }
}

function cancelTask(taskId) {
    if (confirm('Are you sure you want to cancel this task?')) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = 'canceled';
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Reload tasks
            loadCustomerTasks('all');
            alert('Task cancelled successfully!');
        }
    }
}

function openReviewModal(taskId) {
    currentTaskForReview = taskId;
    reviewModal.classList.add('active');
    
    // Reset stars to default
    selectedRating.value = 5;
    ratingStars.forEach((star, index) => {
        if (index < 5) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Reset comment
    document.getElementById('reviewComment').value = '';
}

function openCustomerReviewModal(taskId) {
    currentTaskForCustomerReview = taskId;
    customerReviewModal.classList.add('active');
    
    // Reset stars to default
    customerSelectedRating.value = 5;
    customerRatingStars.forEach((star, index) => {
        if (index < 5) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Reset comment
    document.getElementById('customerReviewComment').value = '';
}

function handleReviewSubmit(e) {
    e.preventDefault();
    
    const rating = parseInt(selectedRating.value);
    const comment = document.getElementById('reviewComment').value;
    
    if (!comment) {
        alert('Please write a comment');
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === currentTaskForReview);
    if (taskIndex !== -1) {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth()+1).toString().padStart(2, '0')}.${today.getFullYear()}`;
        
        tasks[taskIndex].reviews.push({
            reviewer: currentUser.name,
            rating: rating,
            comment: comment,
            date: formattedDate,
            type: 'worker_review'
        });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Close modal
        reviewModal.classList.remove('active');
        
        // Reload tasks
        loadWorkerTasks('all');
        
        alert('Review submitted successfully!');
    }
}

function handleCustomerReviewSubmit(e) {
    e.preventDefault();
    
    const rating = parseInt(customerSelectedRating.value);
    const comment = document.getElementById('customerReviewComment').value;
    
    if (!comment) {
        alert('Please write a comment');
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === currentTaskForCustomerReview);
    if (taskIndex !== -1) {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth()+1).toString().padStart(2, '0')}.${today.getFullYear()}`;
        
        tasks[taskIndex].reviews.push({
            reviewer: currentUser.name,
            rating: rating,
            comment: comment,
            date: formattedDate,
            type: 'customer_review'
        });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Close modal
        customerReviewModal.classList.remove('active');
        
        // Reload tasks
        loadCustomerTasks('all');
        
        alert('Thank you for your review!');
    }
}

function loadReviews() {
    reviewsList.innerHTML = '';
    
    // Get all reviews from tasks where current user is either customer or worker
    const userReviews = [];
    
    tasks.forEach(task => {
        // If user is customer and they posted the task
        if (currentUser.type === 'customer' && task.customer === currentUser.name) {
            task.reviews.forEach(review => {
                userReviews.push({
                    taskTitle: task.title,
                    ...review
                });
            });
        }
        
        // If user is worker and they worked on the task
        if (currentUser.type === 'worker' && task.worker === currentUser.name) {
            task.reviews.forEach(review => {
                userReviews.push({
                    taskTitle: task.title,
                    ...review
                });
            });
        }
    });
    
    if (userReviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-tasks" style="background: transparent; padding: 30px 0;">
                <i class="fas fa-star"></i>
                <h3>No reviews yet</h3>
                <p>${currentUser.type === 'customer' ? 'Tasks need to be completed by workers to receive reviews.' : 'Complete tasks to receive reviews!'}</p>
            </div>
        `;
        return;
    }
    
    userReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div>
                    <div class="reviewer-name">${review.reviewer}</div>
                    <div style="font-size: 0.9rem; color: var(--gray);">Task: ${review.taskTitle}</div>
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
            </div>
            <div class="review-text">${review.comment}</div>
        `;
        
        reviewsList.appendChild(reviewCard);
    });
}

function loadWallet() {
    // This function is not fully implemented in this example
    // You would need to add wallet functionality
}

function loadSettings() {
    if (currentUser) {
        // Load personal info
        document.getElementById('currentUserName').textContent = currentUser.name;
        document.getElementById('currentUserPhone').textContent = currentUser.phone;
        document.getElementById('currentUserEmail').textContent = currentUser.email;
        
        // Load last updated dates
        document.getElementById('nameUpdatedDate').textContent = formatUpdateDate(userSettings.nameUpdated);
        document.getElementById('phoneUpdatedDate').textContent = formatUpdateDate(userSettings.phoneUpdated);
        document.getElementById('emailUpdatedDate').textContent = formatUpdateDate(userSettings.emailUpdated);
        document.getElementById('passwordUpdatedDate').textContent = formatUpdateDate(userSettings.passwordUpdated);
    }
}

function formatUpdateDate(dateString) {
    if (!dateString || dateString === 'Never') {
        return 'Updated: Never';
    }
    return `Updated: ${dateString}`;
}

function updateTransactionStats() {
    // Calculate actual stats from tasks
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const totalTransactions = completedTasks.length;
    
    // Calculate total amount from completed tasks
    let totalAmount = 0;
    completedTasks.forEach(task => {
        totalAmount += task.payment;
    });
    
    // Calculate 5% commission
    const commission = totalAmount * 0.05;
    
    // Update the display
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('totalAmountSettings').textContent = `$${totalAmount.toFixed(2)}`;
    document.getElementById('platformCommission').textContent = `$${commission.toFixed(2)}`;
    
    // Update last updated time
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    document.getElementById('lastUpdated').textContent = formattedDate;
}

function openEditModal(field) {
    currentEditField = field;
    
    let currentValue = '';
    let label = '';
    let placeholder = '';
    let inputType = 'text';
    
    switch(field) {
        case 'name':
            label = 'Account Name';
            currentValue = currentUser ? currentUser.name : 'Mike Connor';
            placeholder = 'Enter your full name';
            break;
        case 'phone':
            label = 'Contact Number';
            currentValue = currentUser ? currentUser.phone : '+1 (555) 123-4567';
            placeholder = 'Enter your phone number';
            break;
        case 'email':
            label = 'Email Address';
            currentValue = currentUser ? currentUser.email : 'mike.connor@email.com';
            placeholder = 'Enter your email address';
            break;
        case 'password':
            label = 'Change Password';
            currentValue = '';
            placeholder = 'Enter new password (min. 8 characters)';
            inputType = 'password';
            break;
    }
    
    editModalTitle.textContent = `Edit ${label}`;
    editFieldLabel.textContent = label;
    editFieldValue.value = currentValue;
    editFieldValue.placeholder = placeholder;
    editFieldValue.type = inputType;
    editFieldType.value = field;
    
    // Show/hide password requirements
    if (field === 'password') {
        passwordRequirements.style.display = 'block';
    } else {
        passwordRequirements.style.display = 'none';
    }
    
    editSettingsModal.classList.add('active');
}

function handleEditSettings(e) {
    e.preventDefault();
    
    const newValue = editFieldValue.value;
    const field = editFieldType.value;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    if (!newValue) {
        alert('Please enter a value');
        return;
    }
    
    // Special validation for password
    if (field === 'password') {
        if (newValue.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        // Ask for current password for verification
        const currentPassword = prompt('Please enter your current password to confirm:');
        if (currentPassword !== currentUser.password) {
            alert('Current password is incorrect. Password change failed.');
            return;
        }
    }
    
    // Update in memory
    if (currentUser) {
        switch(field) {
            case 'name':
                currentUser.name = newValue;
                currentUser.avatar = newValue.charAt(0).toUpperCase();
                userSettings.nameUpdated = formattedDate;
                break;
            case 'phone':
                currentUser.phone = newValue;
                userSettings.phoneUpdated = formattedDate;
                break;
            case 'email':
                currentUser.email = newValue;
                userSettings.emailUpdated = formattedDate;
                break;
            case 'password':
                currentUser.password = newValue;
                userSettings.passwordUpdated = formattedDate;
                break;
        }
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
    }
    
    // Update the display
    if (field === 'password') {
        // Password is hidden, so we don't update display
        document.getElementById('passwordUpdatedDate').textContent = `Updated: ${formattedDate}`;
    } else {
        document.getElementById(`currentUser${field.charAt(0).toUpperCase() + field.slice(1)}`).textContent = newValue;
        document.getElementById(`${field}UpdatedDate`).textContent = `Updated: ${formattedDate}`;
    }
    
    // Update user info in header
    if (currentUser && field === 'name') {
        userName.textContent = newValue;
        userAvatar.textContent = newValue.charAt(0).toUpperCase();
        
        if (currentUser.type === 'worker') {
            workerName.textContent = newValue;
            workerAvatar.textContent = newValue.charAt(0).toUpperCase();
        }
    }
    
    // Close modal
    editSettingsModal.classList.remove('active');
    
    alert(`${field === 'password' ? 'Password' : 'Information'} updated successfully!`);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Reset forms
    loginForm.reset();
    signupForm.reset();
    
    // Show auth page
    authPage.style.display = 'flex';
    dashboardPage.style.display = 'none';
    
    // Switch to login tab
    switchAuthTab('login');
}

// Admin Panel Functions
function loadAdminDashboard() {
    // Load statistics
    loadAdminStats();
    
    // Load users
    loadUsersTable('all');
    
    // Load tasks
    loadTasksTable();
    
    // Load settings
    loadPlatformSettings();
    
    // Load financial data
    loadFinancialData();
}

function loadAdminStats() {
    // Total users
    document.getElementById('totalUsers').textContent = allUsers.length;
    
    // Total tasks
    document.getElementById('totalTasks').textContent = tasks.length;
    
    // Total earnings (platform commission from all completed tasks)
    const totalEarnings = tasks
        .filter(task => task.status === 'completed')
        .reduce((sum, task) => sum + (task.commission || 0), 0);
    document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
    
    // Active today (users who logged in today)
    const today = new Date().toDateString();
    const activeToday = allUsers.filter(user => {
        if (!user.lastLogin) return false;
        return new Date(user.lastLogin).toDateString() === today;
    }).length;
    document.getElementById('activeToday').textContent = activeToday;
}

function loadUsersTable(filter) {
    const usersTable = document.getElementById('usersTable');
    usersTable.innerHTML = '';
    
    let filteredUsers = allUsers;
    
    if (filter === 'customers') {
        filteredUsers = allUsers.filter(user => user.type === 'customer');
    } else if (filter === 'workers') {
        filteredUsers = allUsers.filter(user => user.type === 'worker');
    } else if (filter === 'admins') {
        filteredUsers = allUsers.filter(user => user.type === 'admin');
    }
    
    if (filteredUsers.length === 0) {
        usersTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 30px; color: var(--gray);">
                    No users found
                </td>
            </tr>
        `;
        return;
    }
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Format join date
        const joinDate = new Date(user.joinDate);
        const formattedDate = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="user-avatar" style="width: 30px; height: 30px; font-size: 0.9rem;">${user.avatar}</div>
                    <div>${user.name}</div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <span class="user-type ${user.type}">
                    ${user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                </span>
            </td>
            <td>$${user.balance.toFixed(2)}</td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" data-user-id="${user.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" data-user-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.email !== ADMIN_EMAIL ? `
                    <button class="action-btn delete" data-user-id="${user.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        usersTable.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            viewUserDetails(userId);
        });
    });
    
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            editUser(userId);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            deleteUser(userId);
        });
    });
}

function loadTasksTable() {
    const tasksTable = document.getElementById('tasksTable');
    tasksTable.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksTable.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 30px; color: var(--gray);">
                    No tasks found
                </td>
            </tr>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const row = document.createElement('tr');
        
        // Format date
        const taskDate = new Date(task.createdAt || new Date());
        const formattedDate = taskDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        row.innerHTML = `
            <td>${task.id}</td>
            <td>
                <strong>${task.title}</strong>
                <div style="font-size: 0.85rem; color: var(--gray); margin-top: 5px;">
                    ${task.category}
                </div>
            </td>
            <td>${task.customer}</td>
            <td>${task.worker || 'Not assigned'}</td>
            <td>$${task.payment.toFixed(2)}</td>
            <td>$${(task.commission || 0).toFixed(2)}</td>
            <td>
                <span class="task-status status-${task.status}">
                    ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
            </td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" data-task-id="${task.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" data-task-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tasksTable.appendChild(row);
    });
    
    // Add event listeners to task action buttons
    document.querySelectorAll('.action-btn[data-task-id].view').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = parseInt(this.getAttribute('data-task-id'));
            showTaskDetails(taskId);
        });
    });
    
    document.querySelectorAll('.action-btn[data-task-id].delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = parseInt(this.getAttribute('data-task-id'));
            deleteTask(taskId);
        });
    });
}

function loadPlatformSettings() {
    document.getElementById('commissionRate').value = platformSettings.commissionRate;
    document.getElementById('minTaskPayment').value = platformSettings.minTaskPayment;
    document.getElementById('withdrawalFee').value = platformSettings.withdrawalFee;
    document.getElementById('platformName').value = platformSettings.platformName;
}

function loadFinancialData() {
    // Calculate total platform earnings from completed tasks
    const totalEarnings = tasks
        .filter(task => task.status === 'completed')
        .reduce((sum, task) => sum + (task.commission || 0), 0);
    
    document.getElementById('totalPlatformEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
    
    // Today's earnings (tasks completed today)
    const today = new Date().toDateString();
    const todayEarnings = tasks
        .filter(task => {
            if (task.status !== 'completed') return false;
            const taskDate = new Date(task.completedAt || new Date()).toDateString();
            return taskDate === today;
        })
        .reduce((sum, task) => sum + (task.commission || 0), 0);
    
    document.getElementById('todayEarnings').textContent = `$${todayEarnings.toFixed(2)}`;
    
    // This month's earnings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthEarnings = tasks
        .filter(task => {
            if (task.status !== 'completed') return false;
            const taskDate = new Date(task.completedAt || new Date());
            return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
        })
        .reduce((sum, task) => sum + (task.commission || 0), 0);
    
    document.getElementById('monthEarnings').textContent = `$${monthEarnings.toFixed(2)}`;
    
    // Total withdrawals (calculate from transactions)
    const totalWithdrawals = 0; // You would calculate this from transaction history
    document.getElementById('totalWithdrawals').textContent = `$${totalWithdrawals.toFixed(2)}`;
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    alert(`
User Details:
-------------
ID: ${user.id}
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Type: ${user.type}
Balance: $${user.balance.toFixed(2)}
Joined: ${new Date(user.joinDate).toLocaleDateString()}
Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
    `);
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const newName = prompt('Enter new name:', user.name);
    if (newName && newName.trim() !== '') {
        user.name = newName.trim();
        user.avatar = newName.trim().charAt(0).toUpperCase();
        
        // Update current user if it's the same user
        if (currentUser && currentUser.email === user.email) {
            currentUser.name = newName.trim();
            currentUser.avatar = newName.trim().charAt(0).toUpperCase();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        loadUsersTable('all');
        alert('User updated successfully!');
    }
}

function deleteUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    if (user.email === ADMIN_EMAIL) {
        alert('Cannot delete the admin user!');
        return;
    }
    
    if (confirm(`Are you sure you want to delete user: ${user.name} (${user.email})?`)) {
        allUsers = allUsers.filter(u => u.id !== userId);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        loadAdminDashboard();
        alert('User deleted successfully!');
    }
}

function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (confirm(`Are you sure you want to delete task: "${task.title}"?`)) {
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasksTable();
        loadAdminStats();
        alert('Task deleted successfully!');
    }
}

function savePlatformSettings() {
    platformSettings.commissionRate = parseFloat(document.getElementById('commissionRate').value);
    platformSettings.minTaskPayment = parseFloat(document.getElementById('minTaskPayment').value);
    platformSettings.withdrawalFee = parseFloat(document.getElementById('withdrawalFee').value);
    platformSettings.platformName = document.getElementById('platformName').value;
    
    localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
    alert('Settings saved successfully!');
}

function resetPlatformSettings() {
    if (confirm('Reset all platform settings to default?')) {
        platformSettings = {
            commissionRate: 5,
            minTaskPayment: 5,
            withdrawalFee: 1.50,
            platformName: "Local Task Kz",
            platformBalance: platformSettings.platformBalance
        };
        
        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
        loadPlatformSettings();
        alert('Settings reset to default!');
    }
}

function withdrawPlatformFunds() {
    if (platformSettings.platformBalance <= 0) {
        alert('No funds available to withdraw');
        return;
    }
    
    const amount = parseFloat(prompt(`Enter amount to withdraw (Available: $${platformSettings.platformBalance.toFixed(2)}):`, platformSettings.platformBalance.toFixed(2)));
    
    if (!amount || amount <= 0) {
        alert('Invalid amount');
        return;
    }
    
    if (amount > platformSettings.platformBalance) {
        alert('Insufficient platform balance');
        return;
    }
    
    if (confirm(`Withdraw $${amount.toFixed(2)} from platform funds?`)) {
        platformSettings.platformBalance -= amount;
        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
        
        // Update current user balance if admin
        if (currentUser && currentUser.type === 'admin') {
            currentUser.balance = platformSettings.platformBalance;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        loadFinancialData();
        alert(`Successfully withdrew $${amount.toFixed(2)} from platform funds!`);
    }
}

function createNewUser() {
    const name = prompt('Enter user name:');
    if (!name) return;
    
    const email = prompt('Enter user email:');
    if (!email) return;
    
    const phone = prompt('Enter user phone:');
    if (!phone) return;
    
    const type = prompt('Enter user type (customer/worker/admin):');
    if (!type || !['customer', 'worker', 'admin'].includes(type.toLowerCase())) {
        alert('Invalid user type. Must be customer, worker, or admin.');
        return;
    }
    
    // Check if user already exists
    if (allUsers.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    // Create new user ID
    const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;
    
    // Create user object
    const newUser = {
        id: newId,
        name: name,
        email: email,
        phone: phone,
        password: 'password123', // Default password
        type: type.toLowerCase(),
        avatar: name.charAt(0).toUpperCase(),
        balance: 0.00,
        joinDate: new Date().toISOString(),
        lastLogin: null
    };
    
    // Add to all users
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    loadUsersTable('all');
    loadAdminStats();
    alert(`User created successfully! Default password: password123`);
}

function exportUsers() {
    const dataStr = JSON.stringify(allUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `users_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Users exported successfully!');
}

function viewAllTransactions() {
    alert('Transaction history feature would be implemented here.');
    // In a real application, you would show a modal with all transaction history
}