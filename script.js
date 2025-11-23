// script.js

// --- 1. Constants & DOM Elements ---
const DOM = {
    // Header & Navigation
    toggleEditModeBtn: document.getElementById('toggleEditModeBtn'),
    saveChangesBtn: document.getElementById('saveChangesBtn'),
    discardChangesBtn: document.getElementById('discardChangesBtn'),
    progressBar: document.querySelector('.progress-bar'),
    toastContainer: document.getElementById('toastContainer'),

    // Profile Section
    profilePicDisplay: document.getElementById('profilePicDisplay'),
    profilePicInput: document.getElementById('profilePicInput'),
    profilePicLabel: document.getElementById('profilePicLabel'),
    profileNameDisplay: document.getElementById('profileNameDisplay'),
    profileNameInput: document.getElementById('profileNameInput'),
    profileTitleDisplay: document.getElementById('profileTitleDisplay'),
    profileTitleInput: document.getElementById('profileTitleInput'),

    // About Section
    aboutMeText: document.getElementById('aboutMeText'),
    aboutMeInput: document.getElementById('aboutMeInput'),

    // Skills Section
    skillsList: document.getElementById('skillsList'),
    addSkillContainer: document.getElementById('addSkillContainer'),
    newSkillInput: document.getElementById('newSkillInput'),
    addSkillBtn: document.getElementById('addSkillBtn'),

    // Experience Section
    experienceList: document.getElementById('experienceList'),
    addExperienceBtn: document.getElementById('addExperienceBtn'),

    // Projects Section
    projectsList: document.getElementById('projectsList'),
    addProjectBtn: document.getElementById('addProjectBtn'),

    // Contact Section
    contactEmailDisplay: document.getElementById('contactEmailDisplay'),
    contactEmailInput: document.getElementById('contactEmailInput'),
    contactLinkedinDisplay: document.getElementById('contactLinkedinDisplay'),
    contactLinkedinInput: document.getElementById('contactLinkedinInput'),
    contactGithubDisplay: document.getElementById('contactGithubDisplay'),
    contactGithubInput: document.getElementById('contactGithubInput'),
};

// --- 2. LocalStorageManager Class ---
class LocalStorageManager {
    constructor() {
        this.STORAGE_KEY = 'abdulGhaffarPortfolioData';
    }

    _getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    _saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    loadAllData() {
        let data = this._getData();
        if (!data) {
            data = this._seedData();
            this._saveData(data); // Save seed data immediately
        }
        return data;
    }

    saveAllData(data) {
        this._saveData(data);
    }

    _seedData() {
        return {
            profile: {
                name: 'Abdul Ghaffar Mahar',
                title: 'Full-Stack Developer',
                about: `Hello, I'm Abdul Ghaffar Mahar, a passionate Full-Stack Developer with expertise in crafting robust and scalable web applications. My journey in tech is driven by curiosity and a desire to build intuitive, high-performance solutions. I thrive on challenges and continuously seek to expand my knowledge in modern web technologies. From front-end user experiences to back-end architecture and database management, I enjoy bringing ideas to life across the entire stack.`,
                profilePic: 'https://scontent.fkhi30-1.fna.fbcdn.net/v/t39.30808-6/326981057_542745507921226_2604059348058694024_n.jpg?_nc_cat=106&cb2=99be929b-a592a72f&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=RD3ku0wJKnUQ7kNvwEghnUX&_nc_oc=AdlZyE3_TS7dxqa7X2-eKcOhfxzmbgNpuGTLaIS2zFe3bdqx5D1xm88-LDaJWOiSjK0&_nc_zt=23&_nc_ht=scontent.fkhi30-1.fna&_nc_gid=ark78pwryaYDr_CZRKOtMg&oh=00_AfiGBmVq5FRDoJVrldXaDELjePAfe-AG13ZxOYz2El5G0Q&oe=692929CD' // Updated Profile Picture
            },
            skills: [
                { id: this._getUniqueId(), name: 'JavaScript' },
                { id: this._getUniqueId(), name: 'HTML5' },
                { id: this._getUniqueId(), name: 'CSS3' },
                { id: this._getUniqueId(), name: 'React' },
                { id: this._getUniqueId(), name: 'Node.js' },
                { id: this._getUniqueId(), name: 'Express.js' },
                { id: this._getUniqueId(), name: 'MongoDB' },
                { id: this._getUniqueId(), name: 'SQL' },
                { id: this._getUniqueId(), name: 'Git' },
                { id: this._getUniqueId(), name: 'Responsive Design' }
            ],
            experience: [
                { id: this._getUniqueId(), title: 'Senior Software Engineer', company: 'Innovate Solutions', dates: 'Jan 2021 - Present', description: 'Led the development of scalable web applications, optimizing performance and user experience. Mentored junior developers and contributed to architectural decisions.' },
                { id: this._getUniqueId(), title: 'Software Developer', company: 'Global Tech Corp', dates: 'Jul 2018 - Dec 2020', description: 'Developed and maintained core features for enterprise-level software. Collaborated with cross-functional teams to deliver high-quality products on schedule.' }
            ],
            projects: [
                { id: this._getUniqueId(), name: 'E-commerce Platform', description: 'A full-featured e-commerce site with user authentication, product catalog, shopping cart, and payment integration.', link: 'https://github.com/yourusername/ecommerce' },
                { id: this._getUniqueId(), name: 'Task Management App', description: 'A robust task management application enabling users to create, assign, and track tasks with real-time updates.', link: 'https://github.com/yourusername/task-manager' },
                { id: this._getUniqueId(), name: 'Portfolio Website', description: 'This very portfolio website, built with modern web technologies and a focus on dynamic content management.', link: 'https://github.com/yourusername/portfolio' }
            ],
            contact: {
                email: 'abdul.ghaffar@example.com',
                linkedin: 'https://linkedin.com/in/abdulghaffar',
                github: 'https://github.com/abdulghaffar'
            }
        };
    }

    _getUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}

// --- 3. PortfolioManager Class ---
class PortfolioManager {
    constructor(localStorageManager) {
        this.lsManager = localStorageManager;
        this._data = {};
        this._originalData = {}; // To store data when edit mode starts for discard functionality
        this._isEditMode = false;
        this.setupEventListeners();
    }

    // --- Core Initialization & State Management ---
    async init() {
        this.showProgressBar();
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading delay
        this._data = this.lsManager.loadAllData();
        this._originalData = JSON.parse(JSON.stringify(this._data)); // Deep copy for discard
        this.renderAll();
        this.hideProgressBar();
    }

    setupEventListeners() {
        DOM.toggleEditModeBtn.addEventListener('click', () => this.toggleEditMode());
        DOM.saveChangesBtn.addEventListener('click', () => this.saveChanges());
        DOM.discardChangesBtn.addEventListener('click', () => this.discardChanges());
        DOM.profilePicInput.addEventListener('change', (e) => this.handleProfilePicChange(e));
        DOM.addSkillBtn.addEventListener('click', () => this.addSkill());
        DOM.addExperienceBtn.addEventListener('click', () => this.addExperienceForm());
        DOM.addProjectBtn.addEventListener('click', () => this.addProjectForm());

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-links a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    toggleEditMode() {
        this._isEditMode = !this._isEditMode;
        DOM.toggleEditModeBtn.textContent = this._isEditMode ? 'View Profile' : 'Edit Profile';
        DOM.toggleEditModeBtn.classList.toggle('primary-button', !this._isEditMode);
        DOM.toggleEditModeBtn.classList.toggle('error-button', this._isEditMode); // Use error-button style for 'View Profile' in edit mode for contrast

        DOM.saveChangesBtn.classList.toggle('hidden', !this._isEditMode);
        DOM.discardChangesBtn.classList.toggle('hidden', !this._isEditMode);

        // Update _originalData when entering edit mode
        if (this._isEditMode) {
            this._originalData = JSON.parse(JSON.stringify(this._data));
        }

        this.renderAll();
        this.showToast(this._isEditMode ? 'Edit Mode ON' : 'Edit Mode OFF', 'info');
    }

    saveChanges() {
        this.showProgressBar();
        this.showToast('Saving changes...', 'info');

        // Collect data from various inputs
        this._data.profile.name = DOM.profileNameInput.value;
        this._data.profile.title = DOM.profileTitleInput.value;
        this._data.profile.about = DOM.aboutMeInput.value;

        // Contact Info
        this._data.contact.email = DOM.contactEmailInput.value;
        this._data.contact.linkedin = DOM.contactLinkedinInput.value;
        this._data.contact.github = DOM.contactGithubInput.value;

        // Skills, Experience, Projects lists are updated in-memory during editing, so just save _data

        this.lsManager.saveAllData(this._data);
        this._originalData = JSON.parse(JSON.stringify(this._data)); // Update original data after saving

        // After saving, usually exit edit mode
        this.toggleEditMode();
        this.renderAll(); // Re-render in display mode
        this.showToast('Changes saved successfully!', 'success');
        this.hideProgressBar();
    }

    discardChanges() {
        this.showProgressBar();
        this.showToast('Discarding changes...', 'warning');
        this._data = JSON.parse(JSON.stringify(this._originalData)); // Revert to original
        this.renderAll(); // Re-render with original data
        this.toggleEditMode(); // Exit edit mode
        this.showToast('Changes discarded.', 'info');
        this.hideProgressBar();
    }

    // --- Render Functions ---
    renderAll() {
        this.renderProfile();
        this.renderAbout();
        this.renderSkills();
        this.renderExperience();
        this.renderProjects();
        this.renderContact();

        // Toggle visibility for profile pic related editable elements
        DOM.profilePicInput.classList.toggle('hidden', !this._isEditMode);
        DOM.profilePicLabel.classList.toggle('hidden', !this._isEditMode);
    }

    renderProfile() {
        const { name, title, profilePic } = this._data.profile;

        // Profile Picture
        DOM.profilePicDisplay.src = profilePic;
        DOM.profilePicDisplay.alt = name + ' Profile Picture';

        // Name & Title
        DOM.profileNameDisplay.textContent = name;
        DOM.profileTitleDisplay.textContent = title;
        DOM.profileNameInput.value = name;
        DOM.profileTitleInput.value = title;

        DOM.profileNameDisplay.classList.toggle('hidden', this._isEditMode);
        DOM.profileNameInput.classList.toggle('hidden', !this._isEditMode);
        DOM.profileTitleDisplay.classList.toggle('hidden', this._isEditMode);
        DOM.profileTitleInput.classList.toggle('hidden', !this._isEditMode);
    }

    renderAbout() {
        const { about } = this._data.profile;
        DOM.aboutMeText.textContent = about;
        DOM.aboutMeInput.value = about;

        DOM.aboutMeText.classList.toggle('hidden', this._isEditMode);
        DOM.aboutMeInput.classList.toggle('hidden', !this._isEditMode);
    }

    renderSkills() {
        DOM.skillsList.innerHTML = ''; // Clear current skills
        if (this._data.skills.length === 0 && !this._isEditMode) {
            DOM.skillsList.innerHTML = `<div class="empty-state"><span>No skills added yet.</span></div>`;
            DOM.addSkillContainer.classList.add('hidden'); // Ensure add skill section is hidden
            return;
        }

        this._data.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.dataset.id = skill.id;

            if (this._isEditMode) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'skill-input';
                input.value = skill.name;
                input.addEventListener('change', (e) => {
                    skill.name = e.target.value; // Update in-memory data
                });

                const controls = document.createElement('div');
                controls.className = 'edit-controls';

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '&#x2715;'; // X mark
                deleteBtn.title = 'Delete Skill';
                deleteBtn.addEventListener('click', () => this.deleteSkill(skill.id));

                controls.appendChild(deleteBtn);
                skillItem.append(input, controls);
            } else {
                const span = document.createElement('span');
                span.textContent = skill.name;
                skillItem.appendChild(span);
            }
            DOM.skillsList.appendChild(skillItem);
        });

        // Toggle add skill controls
        DOM.addSkillContainer.classList.toggle('hidden', !this._isEditMode);
    }

    addSkill() {
        const newSkillName = DOM.newSkillInput.value.trim();
        if (newSkillName) {
            this._data.skills.push({ id: this.lsManager._getUniqueId(), name: newSkillName });
            DOM.newSkillInput.value = ''; // Clear input
            this.renderSkills(); // Re-render skills to show new item
            this.showToast('Skill added to local state!', 'info');
        } else {
            this.showToast('Skill name cannot be empty.', 'error');
        }
    }

    deleteSkill(id) {
        this._data.skills = this._data.skills.filter(skill => skill.id !== id);
        this.renderSkills(); // Re-render skills after deletion
        this.showToast('Skill removed from local state.', 'info');
    }

    renderExperience() {
        DOM.experienceList.innerHTML = '';
        if (this._data.experience.length === 0 && !this._isEditMode) {
            DOM.experienceList.innerHTML = `<div class="empty-state"><span>No experience entries yet.</span></div>`;
            DOM.addExperienceBtn.classList.add('hidden');
            return;
        }

        this._data.experience.forEach(exp => {
            const expItem = document.createElement('div');
            expItem.className = 'experience-item';
            expItem.dataset.id = exp.id;

            if (this._isEditMode) {
                expItem.innerHTML = `
                    <input type="text" class="input" value="${exp.title}" placeholder="Job Title" data-field="title">
                    <input type="text" class="input" value="${exp.company}" placeholder="Company" data-field="company">
                    <input type="text" class="input" value="${exp.dates}" placeholder="Dates (e.g., Jan 2020 - Present)" data-field="dates">
                    <textarea class="input" rows="4" placeholder="Description" data-field="description">${exp.description}</textarea>
                    <div class="item-actions">
                        <button class="button error-button delete-item-btn">Delete</button>
                    </div>
                `;
                expItem.querySelectorAll('input, textarea').forEach(input => {
                    input.addEventListener('change', (e) => {
                        exp[e.target.dataset.field] = e.target.value; // Update in-memory data
                    });
                });
                expItem.querySelector('.delete-item-btn').addEventListener('click', () => this.deleteExperience(exp.id));

            } else {
                expItem.innerHTML = `
                    <h3>${exp.title}</h3>
                    <h4>${exp.company} | ${exp.dates}</h4>
                    <p>${exp.description}</p>
                `;
            }
            DOM.experienceList.appendChild(expItem);
        });

        DOM.addExperienceBtn.classList.toggle('hidden', !this._isEditMode);
    }

    addExperienceForm() {
        const newExp = { id: this.lsManager._getUniqueId(), title: '', company: '', dates: '', description: '' };
        this._data.experience.push(newExp); // Add to data immediately to capture inputs

        this.renderExperience(); // Re-render to show the new editable item
        this.showToast('New experience added (edit and save to persist).', 'info');

        // Scroll to the newly added item
        const newItem = DOM.experienceList.lastElementChild;
        if (newItem) {
            newItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
            // Optionally focus on the first input of the new item
            newItem.querySelector('input[data-field="title"]').focus();
        }
    }

    deleteExperience(id) {
        this._data.experience = this._data.experience.filter(exp => exp.id !== id);
        this.renderExperience();
        this.showToast('Experience removed from local state.', 'info');
    }

    renderProjects() {
        DOM.projectsList.innerHTML = '';
        if (this._data.projects.length === 0 && !this._isEditMode) {
            DOM.projectsList.innerHTML = `<div class="empty-state"><span>No projects added yet.</span></div>`;
            DOM.addProjectBtn.classList.add('hidden');
            return;
        }

        this._data.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item section-card';
            projectItem.dataset.id = project.id;

            if (this._isEditMode) {
                projectItem.innerHTML = `
                    <input type="text" class="input" value="${project.name}" placeholder="Project Name" data-field="name">
                    <textarea class="input" rows="4" placeholder="Project Description" data-field="description">${project.description}</textarea>
                    <input type="url" class="input" value="${project.link}" placeholder="Project URL (e.g., GitHub)" data-field="link">
                    <div class="item-actions">
                        <button class="button error-button delete-item-btn">Delete</button>
                    </div>
                `;
                projectItem.querySelectorAll('input, textarea').forEach(input => {
                    input.addEventListener('change', (e) => {
                        project[e.target.dataset.field] = e.target.value; // Update in-memory data
                    });
                });
                projectItem.querySelector('.delete-item-btn').addEventListener('click', () => this.deleteProject(project.id));

            } else {
                projectItem.innerHTML = `
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <p><strong>Link:</strong> <a href="${project.link}" target="_blank">${project.link}</a></p>
                `;
            }
            DOM.projectsList.appendChild(projectItem);
        });

        DOM.addProjectBtn.classList.toggle('hidden', !this._isEditMode);
    }

    addProjectForm() {
        const newProject = { id: this.lsManager._getUniqueId(), name: '', description: '', link: '' };
        this._data.projects.push(newProject);
        this.renderProjects();
        this.showToast('New project added (edit and save to persist).', 'info');

        const newItem = DOM.projectsList.lastElementChild;
        if (newItem) {
            newItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
            newItem.querySelector('input[data-field="name"]').focus();
        }
    }

    deleteProject(id) {
        this._data.projects = this._data.projects.filter(proj => proj.id !== id);
        this.renderProjects();
        this.showToast('Project removed from local state.', 'info');
    }

    renderContact() {
        const { email, linkedin, github } = this._data.contact;

        DOM.contactEmailDisplay.textContent = email;
        DOM.contactLinkedinDisplay.href = linkedin;
        DOM.contactLinkedinDisplay.textContent = linkedin;
        DOM.contactGithubDisplay.href = github;
        DOM.contactGithubDisplay.textContent = github;

        DOM.contactEmailInput.value = email;
        DOM.contactLinkedinInput.value = linkedin;
        DOM.contactGithubInput.value = github;

        // Toggle visibility for contact info
        [DOM.contactEmailDisplay, DOM.contactLinkedinDisplay, DOM.contactGithubDisplay]
            .forEach(el => el.classList.toggle('hidden', this._isEditMode));
        [DOM.contactEmailInput, DOM.contactLinkedinInput, DOM.contactGithubInput]
            .forEach(el => el.classList.toggle('hidden', !this._isEditMode));
    }


    // --- Utility Functions ---
    handleProfilePicChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this._data.profile.profilePic = e.target.result; // Save Base64 string
                DOM.profilePicDisplay.src = e.target.result;
                this.showToast('Profile picture updated (save to persist)!', 'info');
            };
            reader.readAsDataURL(file);
        } else {
            this.showToast('No file selected.', 'error');
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : 'toast-info'}`;
        toast.textContent = message;
        DOM.toastContainer.appendChild(toast);

        // Auto-hide
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    }

    showProgressBar() {
        DOM.progressBar.style.display = 'block';
    }

    hideProgressBar() {
        DOM.progressBar.style.display = 'none';
    }
}

// --- Initialize Application ---
document.addEventListener('DOMContentLoaded', () => {
    const lsManager = new LocalStorageManager();
    const portfolioManager = new PortfolioManager(lsManager);
    portfolioManager.init();
});
