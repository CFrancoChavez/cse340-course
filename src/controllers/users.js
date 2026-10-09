import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers
 } from '../models/users.js';
import { getVolunteeredProjectsByUser } from '../models/volunteers.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');
            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }
            // Cambiado res.redirect('/') por res.redirect('/dashboard')
            res.redirect('/dashboard'); 
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

// Middleware para proteger rutas que requieren autenticación
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

// Controlador para mostrar el Dashboard
const showDashboard = async (req, res) => {
    const user = req.session.user;

    try {
        const volunteeredProjects = await getVolunteeredProjectsByUser(user.user_id);

        res.render('dashboard', { 
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            volunteeredProjects
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        req.flash('error', 'Error loading your volunteered projects.');
        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            volunteeredProjects: []
        });
    }
};

/**
 * Middleware factory to require a specific role 
 * @param {string} role - Nombre del rol requerido (ej. 'admin')
 * @returns {Function} Express middleware
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // the user is logged in ?
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // check if the role matches 
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

       //permission granted 
        next();
    };
};

const renderUsersList = async (req, res) => {
    try{
        const users = await getAllUsers();
        res.render('users', {
            title: 'Registered Users', 
            users
        });

    } catch (error){
        console.error('Error fetching users:', error);
        req.flash('error', 'Error loading users list.');
        res.redirect('/dashboard');
    }

};

export { showUserRegistrationForm, 
        processUserRegistrationForm,
        showLoginForm, 
        processLoginForm,
        processLogout,
        requireLogin,
        showDashboard,
        requireRole,
        renderUsersList
        };