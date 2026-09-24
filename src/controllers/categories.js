// Import needed model functions
import {
    getAllCategories, getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Define controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = category ? category.name : 'Category Details';

    res.render('category', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { 
            title, 
            projectId, 
            projectDetails, 
            categories, 
            assignedCategories 
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];
        
        // Garantizar que sea un arreglo (si solo se selecciona un checkbox, Express envía un string)
        const categoryIdsArray = Array.isArray(selectedCategoryIds) 
            ? selectedCategoryIds 
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);
        
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm,
    processAssignCategoriesForm };
