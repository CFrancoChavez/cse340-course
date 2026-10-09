import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING *
    `;
    const queryParams = [userId, projectId];

    const result = await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} volunteered for project ${projectId}`);
    }

    return result.rows[0];
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const queryParams = [userId, projectId];

    await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} removed from volunteering on project ${projectId}`);
    }
};

const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 
        FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const queryParams = [userId, projectId];

    const result = await db.query(query, queryParams);

    return result.rowCount > 0;
};

const getVolunteeredProjectsByUser = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
        FROM project_volunteers pv
        JOIN service_project p ON pv.project_id = p.project_id
        LEFT JOIN organization o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.project_date ASC
    `;
    const queryParams = [userId];

    const result = await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`Fetched volunteered projects for user ${userId}, count:`, result.rows.length);
    }

    return result.rows;
};

export { 
    addVolunteer, 
    removeVolunteer, 
    isUserVolunteering, 
    getVolunteeredProjectsByUser 
};