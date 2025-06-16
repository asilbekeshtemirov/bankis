// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = null;
let currentLanguage = 'en';
let translations = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            await loadUserProfile();
            showMainApp();
        } catch (error) {
            console.error('Failed to load user profile:', error);
            showLogin();
        }
    } else {
        showLogin();
    }
    
    // Load languages
    await loadLanguages();
    
    // Load translations
    await loadTranslations(currentLanguage);
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Transfer form
    document.getElementById('transferForm').addEventListener('submit', handleTransfer);
    
    // Verification form
    document.getElementById('verificationForm').addEventListener('submit', handleVerification);
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
}

// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading('Logging in...');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            currentUser = data.user;
            
            showToast('Login successful!', 'success');
            showMainApp();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('phone').value;
    
    try {
        showLoading('Creating account...');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                phone: phone || undefined,
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Registration successful! Please check your email for verification.', 'success');
            // Switch to login tab
            document.getElementById('login-tab').click();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    currentUser = null;
    showLogin();
    showToast('Logged out successfully', 'info');
}

// Main App Functions
function showLogin() {
    document.getElementById('loginSection').classList.remove('d-none');
    document.getElementById('dashboardSection').classList.add('d-none');
    document.getElementById('accountsSection').classList.add('d-none');
    document.getElementById('transferSection').classList.add('d-none');
    document.getElementById('historySection').classList.add('d-none');
    document.getElementById('profileSection').classList.add('d-none');
}

function showMainApp() {
    document.getElementById('loginSection').classList.add('d-none');
    showSection('dashboard');
    updateUserInfo();
    loadDashboardData();
}

function showSection(sectionName) {
    // Hide all sections
    const sections = ['dashboard', 'accounts', 'transfer', 'history', 'profile'];
    sections.forEach(section => {
        document.getElementById(`${section}Section`).classList.add('d-none');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}Section`).classList.remove('d-none');
    
    // Load section-specific data
    switch (sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'accounts':
            loadAccounts();
            break;
        case 'transfer':
            loadTransferAccounts();
            break;
        case 'history':
            loadTransactionHistory();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userName').textContent = 
            `${currentUser.firstName} ${currentUser.lastName}`;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const [statsResponse, transactionsResponse] = await Promise.all([
            apiCall('/users/stats'),
            apiCall('/transactions/my-transactions?limit=5')
        ]);
        
        // Update stats cards
        document.getElementById('totalBalance').textContent = 
            `${statsResponse.totalBalance.toLocaleString()} UZS`;
        document.getElementById('totalAccounts').textContent = statsResponse.totalAccounts;
        document.getElementById('totalTransactions').textContent = statsResponse.totalTransfers;
        
        // Load recent transactions
        displayRecentTransactions(transactionsResponse.data);
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function displayRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactions');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-inbox fa-2x mb-3"></i>
                <p>No recent transactions</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactions.map(transaction => {
        const isIncoming = transaction.toUserId === currentUser.id;
        const amount = parseFloat(transaction.amount);
        const otherUser = isIncoming ? transaction.fromUser : transaction.toUser;
        const otherAccount = isIncoming ? transaction.fromAccount : transaction.toAccount;
        
        return `
            <div class="transaction-item ${isIncoming ? 'incoming' : 'outgoing'} ${transaction.status.toLowerCase()}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">
                            ${isIncoming ? 'Received from' : 'Sent to'} ${otherUser.firstName} ${otherUser.lastName}
                        </div>
                        <small class="text-muted">Account: ${otherAccount.accountNumber}</small>
                        ${transaction.description ? `<div class="small text-muted">${transaction.description}</div>` : ''}
                    </div>
                    <div class="text-end">
                        <div class="fw-bold ${isIncoming ? 'text-success' : 'text-danger'}">
                            ${isIncoming ? '+' : '-'}${amount.toLocaleString()} UZS
                        </div>
                        <span class="status-badge status-${transaction.status.toLowerCase()}">
                            ${transaction.status}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Accounts Functions
async function loadAccounts() {
    try {
        const accounts = await apiCall('/accounts/my-accounts');
        displayAccounts(accounts);
    } catch (error) {
        console.error('Failed to load accounts:', error);
        showToast('Failed to load accounts', 'error');
    }
}

function displayAccounts(accounts) {
    const container = document.getElementById('accountsList');
    
    if (!accounts || accounts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <i class="fas fa-credit-card fa-3x text-muted mb-3"></i>
                <p class="text-muted">No accounts found</p>
                <button class="btn btn-primary" onclick="createAccount()">Create Your First Account</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = accounts.map(account => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="account-card">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h6 class="mb-1">Account</h6>
                        <div class="account-number">${account.accountNumber}</div>
                    </div>
                    <i class="fas fa-credit-card fa-2x opacity-75"></i>
                </div>
                <div class="balance-amount">${parseFloat(account.balance).toLocaleString()} ${account.currency}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <small>Balance</small>
                    <span class="badge bg-light text-dark">${account.isActive ? 'Active' : 'Inactive'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function createAccount() {
    try {
        showLoading('Creating account...');
        
        const response = await apiCall('/accounts', 'POST', {});
        
        if (response) {
            showToast('Account created successfully!', 'success');
            loadAccounts();
        }
    } catch (error) {
        console.error('Failed to create account:', error);
        showToast('Failed to create account', 'error');
    } finally {
        hideLoading();
    }
}

// Transfer Functions
async function loadTransferAccounts() {
    try {
        const accounts = await apiCall('/accounts/my-accounts');
        const select = document.getElementById('fromAccount');
        
        select.innerHTML = '<option value="">Select account...</option>';
        accounts.forEach(account => {
            select.innerHTML += `
                <option value="${account.accountNumber}">
                    ${account.accountNumber} (${parseFloat(account.balance).toLocaleString()} ${account.currency})
                </option>
            `;
        });
    } catch (error) {
        console.error('Failed to load transfer accounts:', error);
        showToast('Failed to load accounts', 'error');
    }
}

async function handleTransfer(event) {
    event.preventDefault();
    
    const fromAccountNumber = document.getElementById('fromAccount').value;
    const toAccountNumber = document.getElementById('toAccount').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    try {
        showLoading('Processing transfer...');
        
        const response = await apiCall('/transactions', 'POST', {
            fromAccountNumber,
            toAccountNumber,
            amount,
            description: description || undefined,
        });
        
        if (response) {
            // Show verification modal
            document.getElementById('transactionId').value = response.transactionId;
            document.getElementById('userEmail').value = currentUser.email;
            
            const modal = new bootstrap.Modal(document.getElementById('verificationModal'));
            modal.show();
            
            showToast('Transfer initiated. Please check your email for verification code.', 'info');
            
            // Reset form
            document.getElementById('transferForm').reset();
        }
    } catch (error) {
        console.error('Transfer error:', error);
        showToast(error.message || 'Transfer failed', 'error');
    } finally {
        hideLoading();
    }
}

async function handleVerification(event) {
    event.preventDefault();
    
    const transactionId = document.getElementById('transactionId').value;
    const verificationCode = document.getElementById('verificationCode').value;
    const email = document.getElementById('userEmail').value;
    
    try {
        showLoading('Verifying transaction...');
        
        const response = await apiCall('/transactions/verify', 'POST', {
            transactionId,
            verificationCode,
            email,
        });
        
        if (response) {
            showToast('Transaction completed successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('verificationModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('verificationForm').reset();
            
            // Refresh dashboard if visible
            if (!document.getElementById('dashboardSection').classList.contains('d-none')) {
                loadDashboardData();
            }
        }
    } catch (error) {
        console.error('Verification error:', error);
        showToast(error.message || 'Verification failed', 'error');
    } finally {
        hideLoading();
    }
}

// Transaction History Functions
async function loadTransactionHistory() {
    try {
        const response = await apiCall('/transactions/my-transactions');
        displayTransactionHistory(response.data);
    } catch (error) {
        console.error('Failed to load transaction history:', error);
        showToast('Failed to load transaction history', 'error');
    }
}

function displayTransactionHistory(transactions) {
    const container = document.getElementById('transactionHistory');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-history fa-3x mb-3"></i>
                <p>No transaction history found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Account</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map(transaction => {
                        const isIncoming = transaction.toUserId === currentUser.id;
                        const amount = parseFloat(transaction.amount);
                        const otherAccount = isIncoming ? transaction.fromAccount : transaction.toAccount;
                        
                        return `
                            <tr>
                                <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span class="badge ${isIncoming ? 'bg-success' : 'bg-danger'}">
                                        ${isIncoming ? 'Received' : 'Sent'}
                                    </span>
                                </td>
                                <td class="font-monospace">${otherAccount.accountNumber}</td>
                                <td class="fw-bold ${isIncoming ? 'text-success' : 'text-danger'}">
                                    ${isIncoming ? '+' : '-'}${amount.toLocaleString()} UZS
                                </td>
                                <td>
                                    <span class="status-badge status-${transaction.status.toLowerCase()}">
                                        ${transaction.status}
                                    </span>
                                </td>
                                <td>${transaction.description || '-'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Profile Functions
async function loadProfile() {
    try {
        const profile = await apiCall('/users/profile');
        
        document.getElementById('profileFirstName').value = profile.firstName || '';
        document.getElementById('profileLastName').value = profile.lastName || '';
        document.getElementById('profileEmail').value = profile.email || '';
        document.getElementById('profilePhone').value = profile.phone || '';
        
        // Load languages for profile
        const languages = await apiCall('/languages');
        const languageSelect = document.getElementById('profileLanguage');
        languageSelect.innerHTML = '<option value="">Select language...</option>';
        languages.forEach(lang => {
            const selected = lang.id === profile.languageId ? 'selected' : '';
            languageSelect.innerHTML += `<option value="${lang.id}" ${selected}>${lang.name}</option>`;
        });
        
    } catch (error) {
        console.error('Failed to load profile:', error);
        showToast('Failed to load profile', 'error');
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const phone = document.getElementById('profilePhone').value;
    const languageId = document.getElementById('profileLanguage').value;
    
    try {
        showLoading('Updating profile...');
        
        const response = await apiCall('/users/profile', 'PATCH', {
            firstName,
            lastName,
            phone: phone || undefined,
            languageId: languageId || undefined,
        });
        
        if (response) {
            currentUser = { ...currentUser, ...response };
            updateUserInfo();
            showToast('Profile updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        showToast('Failed to update profile', 'error');
    } finally {
        hideLoading();
    }
}

// Language Functions
async function loadLanguages() {
    try {
        const languages = await fetch(`${API_BASE_URL}/languages`).then(r => r.json());
        // Store languages for later use
        window.availableLanguages = languages;
    } catch (error) {
        console.error('Failed to load languages:', error);
    }
}

async function loadTranslations(languageCode) {
    try {
        const response = await fetch(`${API_BASE_URL}/languages/${languageCode}/translations`);
        if (response.ok) {
            translations = await response.json();
            applyTranslations();
        }
    } catch (error) {
        console.error('Failed to load translations:', error);
    }
}

function changeLanguage(languageCode) {
    currentLanguage = languageCode;
    loadTranslations(languageCode);
    
    // Update current language display
    const languageNames = { en: 'English', uz: 'O\'zbekcha', ru: 'Русский' };
    document.getElementById('currentLanguage').textContent = languageNames[languageCode];
}

function applyTranslations() {
    // Apply translations to elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Utility Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('accessToken');
    
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    };
    
    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired, try to refresh
            const refreshed = await refreshToken();
            if (refreshed) {
                // Retry the original request
                config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
                if (!retryResponse.ok) {
                    throw new Error(await retryResponse.text());
                }
                return retryResponse.json();
            } else {
                logout();
                return;
            }
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Request failed');
        }
        
        return response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    
    return false;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastBody = document.getElementById('toastBody');
    
    // Set toast color based on type
    toast.className = `toast ${type === 'success' ? 'bg-success text-white' : 
                              type === 'error' ? 'bg-danger text-white' : 
                              type === 'warning' ? 'bg-warning text-dark' : 
                              'bg-info text-white'}`;
    
    toastBody.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

function showLoading(message = 'Loading...') {
    // You can implement a loading overlay here
    console.log(message);
}

function hideLoading() {
    // Hide loading overlay
    console.log('Loading complete');
}

// Search and Filter Functions
function searchTransactions() {
    const query = document.getElementById('searchTransactions').value;
    // Implement search functionality
    console.log('Searching for:', query);
}

function filterTransactions() {
    const status = document.getElementById('statusFilter').value;
    // Implement filter functionality
    console.log('Filtering by status:', status);
}

function showForgotPassword() {
    // Implement forgot password functionality
    showToast('Forgot password functionality will be implemented', 'info');
}

// Load user profile
async function loadUserProfile() {
    const profile = await apiCall('/users/profile');
    currentUser = profile;
    return profile;
}