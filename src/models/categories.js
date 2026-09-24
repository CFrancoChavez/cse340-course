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
export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    assignCategoryToProject,
    updateCategoryAssignments
};

