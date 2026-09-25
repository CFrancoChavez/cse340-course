import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name 
        FROM category 
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `
      SELECT category_id, name 
      FROM category 
      WHERE category_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
      SELECT c.category_id, c.name
      FROM category c
      JOIN project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
      SELECT p.project_id, p.title, p.description, p.project_date AS date, p.location
      FROM service_project p
      JOIN project_category pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.project_date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // 1. Eliminar asignaciones existentes
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // 2. Insertar las nuevas asignaciones seleccionadas
    for (const categoryId of categoryIds) {
        if (categoryId) { // Evita insertar valores vacíos si la lista viene con nulos
            await assignCategoryToProject(categoryId, projectId);
        }
    }
};
// Insert a new category
const createCategory = async (name) => {
    const query = `
      INSERT INTO category (name)
      VALUES ($1)
      RETURNING category_id;
    `;
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

// Update an existing category
const updateCategory = async (categoryId, name) => {
    const query = `
      UPDATE category
      SET name = $1
      WHERE category_id = $2
      RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found or failed to update');
    }

    return result.rows[0].category_id;
}; 

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    assignCategoryToProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};

