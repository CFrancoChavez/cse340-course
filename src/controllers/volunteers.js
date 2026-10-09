import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const handleAddVolunteer = async (req, res) => {
    const { id: projectId } = req.params;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now registered as a volunteer for this project!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'Could not register as a volunteer. Please try again.');
    }

    res.redirect(`/project/${projectId}`);
};

const handleRemoveVolunteer = async (req, res) => {
    const { id: projectId } = req.params;
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed from this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Could not remove volunteer registration. Please try again.');
    }

    // Si la acción viene desde el dashboard o desde la página del proyecto, redirigir adecuadamente
    const referer = req.get('Referrer') || '';
    if (referer.includes('/dashboard')) {
        return res.redirect('/dashboard');
    }

    res.redirect(`/project/${projectId}`);
};

export {
    handleAddVolunteer,
    handleRemoveVolunteer
};