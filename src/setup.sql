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