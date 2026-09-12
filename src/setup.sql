-- ========================================
-- Table structure: organization
-- ========================================
CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- 1. Crear la tabla service_project
CREATE TABLE IF NOT EXISTS service_project (
    project_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES public.organization(organization_id) 
        ON DELETE CASCADE
);

-- 2. Insertar al menos 5 proyectos por organización (15 proyectos en total)
INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
-- Organización 1: BrightFuture Builders
(1, 'Community Center Renovation', 'Painting and repairing the local youth community center.', '123 Main St, Downtown', '2026-10-15'),
(1, 'Park Playground Cleanup', 'Removing trash, painting benches, and installing safety mats.', 'Central Park, Sector B', '2026-11-02'),
(1, 'Senior Home Ramp Construction', 'Building wheelchair accessible ramps for elderly residence.', 'Oakridge Senior Living', '2026-11-20'),
(1, 'School Roof Repair', 'Waterproofing and repairing roof tiles for Elementary School #5.', '45 Elm Street', '2026-12-05'),
(1, 'Library Reading Corner Build', 'Assembling shelves and cozy furniture for children reading area.', 'Public Library North', '2027-01-10'),

-- Organización 2: GreenHarvest Growers
(2, 'Urban Garden Planting Day', 'Planting seasonal vegetables and fruits in communal garden beds.', 'Eastside Community Garden', '2026-10-22'),
(2, 'Tree Planting Campaign', 'Planting 100 native trees along the riverbank to prevent erosion.', 'Riverfront Trail', '2026-11-12'),
(2, 'Composting Workshop and Build', 'Setting up community compost bins and training local residents.', 'Green Harvest Hub', '2026-11-28'),
(2, 'School Greenhouse Assembly', 'Constructing a mini-greenhouse for biology students.', 'West High School', '2026-12-18'),
(2, 'Organic Soil Enrichment Day', 'Preparing soil beds with organic fertilizer for spring planting.', 'South Valley Plots', '2027-01-22'),

-- Organización 3: UnityServe Volunteers
(3, 'Holiday Food Basket Distribution', 'Sorting, packing, and delivering food packages to families in need.', 'Unity Food Bank Warehouse', '2026-10-30'),
(3, 'Neighborhood Winter Clothing Drive', 'Collecting and distributing winter coats and blankets.', 'St. Peter Square', '2026-11-15'),
(3, 'Soup Kitchen Support Weekend', 'Preparing and serving warm meals over the weekend.', 'Downtown Rescue Mission', '2026-12-01'),
(3, 'Toy Drive Wrapping and Delivery', 'Wrapping donated holiday toys for local children hospitals.', 'Civic Center Hall A', '2026-12-20'),
(3, 'Community Health & Hygiene Pack Kits', 'Assembling hygiene kits for homeless shelters.', 'Unity Community Center', '2027-01-15');

-- 1. Crear la tabla category
CREATE TABLE IF NOT EXISTS category (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Crear la tabla intermedia para la relación M:N
CREATE TABLE IF NOT EXISTS project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project 
        FOREIGN KEY (project_id) 
        REFERENCES service_project(project_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_category 
        FOREIGN KEY (category_id) 
        REFERENCES category(category_id) 
        ON DELETE CASCADE
);

-- 3. Insertar al menos 3 categorías
INSERT INTO category (name) VALUES
('Infrastructure & Maintenance'),
('Environmental & Agriculture'),
('Social & Community Support');

-- 4. Asociar cada uno de los 15 proyectos con al menos una categoría
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1), (1, 3), -- Project 1: Infrastructure, Social
(2, 1), (2, 2), -- Project 2: Infrastructure, Environmental
(3, 1), (3, 3), -- Project 3: Infrastructure, Social
(4, 1),         -- Project 4: Infrastructure
(5, 1), (5, 3), -- Project 5: Infrastructure, Social
(6, 2),         -- Project 6: Environmental
(7, 2),         -- Project 7: Environmental
(8, 2), (8, 3), -- Project 8: Environmental, Social
(9, 1), (9, 2), -- Project 9: Infrastructure, Environmental
(10, 2),        -- Project 10: Environmental
(11, 3),        -- Project 11: Social
(12, 3),        -- Project 12: Social
(13, 3),        -- Project 13: Social
(14, 3),        -- Project 14: Social
(15, 3);        -- Project 15: Social                                                                                                                                                                                                                                                                                                                                                                                                                                                         