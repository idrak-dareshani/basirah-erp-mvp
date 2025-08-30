/*
  # Insert Sample Data for ERP System

  1. Sample Data Creation
    - Insert customers, vendors, products, and transactions
    - Create sales orders linked to customers
    - Create purchase orders linked to vendors
    - Create order items linking products to orders
    - Generate realistic financial transactions

  2. Data Relationships
    - Sales orders → Customers
    - Purchase orders → Vendors
    - Order items → Products + Orders
    - Proper foreign key relationships maintained

  3. Business Logic
    - Realistic pricing and quantities
    - Various order statuses for testing
    - Low stock scenarios for alerts
    - Diverse product categories
*/

-- Insert sample customers
INSERT INTO customers (name, email, phone, address) VALUES
('Acme Corporation', 'contact@acme.com', '+1-555-0101', '123 Business Ave, New York, NY 10001'),
('Tech Solutions Inc', 'info@techsolutions.com', '+1-555-0102', '456 Innovation Dr, San Francisco, CA 94105'),
('Global Enterprises', 'sales@globalent.com', '+1-555-0103', '789 Commerce St, Chicago, IL 60601'),
('Digital Dynamics', 'hello@digitaldynamics.com', '+1-555-0104', '321 Tech Park, Austin, TX 78701'),
('Future Systems LLC', 'contact@futuresys.com', '+1-555-0105', '654 Corporate Blvd, Seattle, WA 98101'),
('Innovative Solutions', 'info@innovative.com', '+1-555-0106', '987 Business Center, Boston, MA 02101'),
('Metro Industries', 'sales@metro.com', '+1-555-0107', '147 Industrial Way, Detroit, MI 48201'),
('Coastal Enterprises', 'contact@coastal.com', '+1-555-0108', '258 Harbor View, Miami, FL 33101');

-- Insert sample vendors
INSERT INTO vendors (name, email, phone, address) VALUES
('TechSupply Co', 'orders@techsupply.com', '+1-555-0201', '111 Supplier St, Los Angeles, CA 90001'),
('Component Masters', 'sales@componentmasters.com', '+1-555-0202', '222 Parts Ave, Phoenix, AZ 85001'),
('Electronics Wholesale', 'info@elecwholesale.com', '+1-555-0203', '333 Distribution Dr, Houston, TX 77001'),
('Office Solutions Pro', 'contact@officesol.com', '+1-555-0204', '444 Supply Chain Rd, Philadelphia, PA 19101'),
('Industrial Supplies Inc', 'orders@industrial.com', '+1-555-0205', '555 Manufacturing St, San Antonio, TX 78201'),
('Global Components Ltd', 'sales@globalcomp.com', '+1-555-0206', '666 Import Blvd, San Diego, CA 92101'),
('Premium Parts Co', 'info@premiumparts.com', '+1-555-0207', '777 Quality Ave, Dallas, TX 75201'),
('Reliable Vendors LLC', 'contact@reliable.com', '+1-555-0208', '888 Trust Way, San Jose, CA 95101');

-- Insert sample products with various categories and stock levels
INSERT INTO products (name, sku, description, category, unit_price, cost_price, stock, min_stock) VALUES
-- Electronics
('Wireless Bluetooth Headphones', 'SKU-001', 'Premium noise-canceling wireless headphones with 30-hour battery life', 'Electronics', 199.99, 120.00, 45, 10),
('4K Webcam Pro', 'SKU-002', 'Ultra HD webcam with auto-focus and built-in microphone', 'Electronics', 149.99, 90.00, 8, 15),
('USB-C Hub 7-in-1', 'SKU-003', 'Multi-port hub with HDMI, USB 3.0, and SD card slots', 'Electronics', 79.99, 45.00, 67, 20),
('Wireless Charging Pad', 'SKU-004', 'Fast wireless charging pad compatible with all Qi devices', 'Electronics', 39.99, 22.00, 123, 25),
('Bluetooth Speaker', 'SKU-005', 'Portable waterproof speaker with 360-degree sound', 'Electronics', 89.99, 50.00, 34, 15),

-- Office Supplies
('Ergonomic Office Chair', 'SKU-006', 'Adjustable lumbar support chair with breathable mesh', 'Office Supplies', 299.99, 180.00, 12, 5),
('Standing Desk Converter', 'SKU-007', 'Height-adjustable desk converter for dual monitors', 'Office Supplies', 249.99, 150.00, 18, 8),
('LED Desk Lamp', 'SKU-008', 'Touch-control LED lamp with USB charging port', 'Office Supplies', 59.99, 35.00, 56, 20),
('Wireless Keyboard & Mouse', 'SKU-009', 'Slim wireless keyboard and mouse combo', 'Office Supplies', 79.99, 45.00, 89, 30),
('Document Shredder', 'SKU-010', 'Cross-cut paper shredder with 12-sheet capacity', 'Office Supplies', 129.99, 75.00, 23, 10),

-- Software
('Project Management Software', 'SKU-011', 'Annual license for team collaboration software', 'Software', 599.99, 300.00, 100, 50),
('Antivirus Premium', 'SKU-012', 'Multi-device antivirus protection for 5 devices', 'Software', 89.99, 45.00, 200, 75),
('Design Suite Pro', 'SKU-013', 'Professional graphic design software suite', 'Software', 399.99, 200.00, 75, 25),

-- Health & Beauty
('Air Purifier HEPA', 'SKU-014', 'HEPA air purifier for rooms up to 500 sq ft', 'Health & Beauty', 179.99, 100.00, 29, 15),
('Essential Oil Diffuser', 'SKU-015', 'Ultrasonic aromatherapy diffuser with LED lights', 'Health & Beauty', 49.99, 25.00, 67, 30),

-- Home & Garden
('Smart Thermostat', 'SKU-016', 'WiFi-enabled programmable thermostat', 'Home & Garden', 199.99, 120.00, 41, 20),
('Robot Vacuum', 'SKU-017', 'Smart robot vacuum with app control and mapping', 'Home & Garden', 299.99, 180.00, 15, 10),
('Garden Tool Set', 'SKU-018', '10-piece stainless steel garden tool set', 'Home & Garden', 89.99, 50.00, 33, 15);

-- Insert sample transactions
INSERT INTO transactions (type, category, description, amount, date, reference) VALUES
-- Income transactions
('income', 'Sales Revenue', 'Payment from Acme Corporation - Invoice #INV-2025-001', 2450.00, '2025-01-15', 'INV-2025-001'),
('income', 'Sales Revenue', 'Payment from Tech Solutions Inc - Invoice #INV-2025-002', 1890.50, '2025-01-14', 'INV-2025-002'),
('income', 'Sales Revenue', 'Payment from Global Enterprises - Invoice #INV-2025-003', 3200.00, '2025-01-13', 'INV-2025-003'),
('income', 'Service Revenue', 'Consulting services for Digital Dynamics', 1500.00, '2025-01-12', 'CONS-001'),
('income', 'Sales Revenue', 'Payment from Future Systems LLC - Invoice #INV-2025-004', 980.75, '2025-01-11', 'INV-2025-004'),
('income', 'Sales Revenue', 'Payment from Innovative Solutions - Invoice #INV-2025-005', 2100.00, '2025-01-10', 'INV-2025-005'),

-- Expense transactions
('expense', 'Office Supplies', 'Monthly office supplies from Office Solutions Pro', 450.00, '2025-01-15', 'PO-2025-001'),
('expense', 'Software', 'Annual software licenses renewal', 2400.00, '2025-01-14', 'LIC-2025-001'),
('expense', 'Marketing', 'Digital advertising campaign Q1', 1200.00, '2025-01-13', 'ADV-001'),
('expense', 'Utilities', 'Monthly electricity and internet bills', 380.50, '2025-01-12', 'UTIL-JAN-2025'),
('expense', 'Equipment', 'New laptops for development team', 3500.00, '2025-01-11', 'EQ-2025-001'),
('expense', 'Professional Services', 'Legal consultation fees', 800.00, '2025-01-10', 'LEGAL-001'),
('expense', 'Travel', 'Business trip to client site', 650.00, '2025-01-09', 'TRAVEL-001'),
('expense', 'Equipment', 'Office furniture and setup', 1200.00, '2025-01-08', 'FURN-001');

-- Insert sample sales orders
INSERT INTO sales_orders (customer_id, order_number, date, status, subtotal, tax, total) VALUES
((SELECT id FROM customers WHERE name = 'Acme Corporation'), 'SO-2025-001', '2025-01-15', 'delivered', 2250.00, 200.00, 2450.00),
((SELECT id FROM customers WHERE name = 'Tech Solutions Inc'), 'SO-2025-002', '2025-01-14', 'shipped', 1750.00, 140.50, 1890.50),
((SELECT id FROM customers WHERE name = 'Global Enterprises'), 'SO-2025-003', '2025-01-13', 'confirmed', 3000.00, 200.00, 3200.00),
((SELECT id FROM customers WHERE name = 'Digital Dynamics'), 'SO-2025-004', '2025-01-12', 'draft', 850.00, 68.00, 918.00),
((SELECT id FROM customers WHERE name = 'Future Systems LLC'), 'SO-2025-005', '2025-01-11', 'delivered', 900.00, 80.75, 980.75),
((SELECT id FROM customers WHERE name = 'Innovative Solutions'), 'SO-2025-006', '2025-01-10', 'shipped', 1950.00, 150.00, 2100.00),
((SELECT id FROM customers WHERE name = 'Metro Industries'), 'SO-2025-007', '2025-01-09', 'confirmed', 1200.00, 96.00, 1296.00),
((SELECT id FROM customers WHERE name = 'Coastal Enterprises'), 'SO-2025-008', '2025-01-08', 'draft', 750.00, 60.00, 810.00);

-- Insert sample purchase orders
INSERT INTO purchase_orders (vendor_id, order_number, date, status, subtotal, tax, total) VALUES
((SELECT id FROM vendors WHERE name = 'TechSupply Co'), 'PO-2025-001', '2025-01-15', 'received', 1800.00, 144.00, 1944.00),
((SELECT id FROM vendors WHERE name = 'Component Masters'), 'PO-2025-002', '2025-01-14', 'confirmed', 2200.00, 176.00, 2376.00),
((SELECT id FROM vendors WHERE name = 'Electronics Wholesale'), 'PO-2025-003', '2025-01-13', 'received', 1500.00, 120.00, 1620.00),
((SELECT id FROM vendors WHERE name = 'Office Solutions Pro'), 'PO-2025-004', '2025-01-12', 'draft', 950.00, 76.00, 1026.00),
((SELECT id FROM vendors WHERE name = 'Industrial Supplies Inc'), 'PO-2025-005', '2025-01-11', 'confirmed', 1200.00, 96.00, 1296.00),
((SELECT id FROM vendors WHERE name = 'Global Components Ltd'), 'PO-2025-006', '2025-01-10', 'received', 1650.00, 132.00, 1782.00),
((SELECT id FROM vendors WHERE name = 'Premium Parts Co'), 'PO-2025-007', '2025-01-09', 'confirmed', 800.00, 64.00, 864.00);

-- Insert sales order items (linking products to sales orders)
INSERT INTO order_items (sales_order_id, product_id, quantity, unit_price, total) VALUES
-- SO-2025-001 (Acme Corporation)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-001'), (SELECT id FROM products WHERE sku = 'SKU-001'), 5, 199.99, 999.95),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-001'), (SELECT id FROM products WHERE sku = 'SKU-003'), 10, 79.99, 799.90),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-001'), (SELECT id FROM products WHERE sku = 'SKU-008'), 8, 59.99, 479.92),

-- SO-2025-002 (Tech Solutions Inc)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-002'), (SELECT id FROM products WHERE sku = 'SKU-002'), 3, 149.99, 449.97),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-002'), (SELECT id FROM products WHERE sku = 'SKU-006'), 2, 299.99, 599.98),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-002'), (SELECT id FROM products WHERE sku = 'SKU-009'), 9, 79.99, 719.91),

-- SO-2025-003 (Global Enterprises)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-003'), (SELECT id FROM products WHERE sku = 'SKU-011'), 5, 599.99, 2999.95),

-- SO-2025-004 (Digital Dynamics)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-004'), (SELECT id FROM products WHERE sku = 'SKU-004'), 15, 39.99, 599.85),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-004'), (SELECT id FROM products WHERE sku = 'SKU-015'), 5, 49.99, 249.95),

-- SO-2025-005 (Future Systems LLC)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-005'), (SELECT id FROM products WHERE sku = 'SKU-005'), 10, 89.99, 899.90),

-- SO-2025-006 (Innovative Solutions)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-006'), (SELECT id FROM products WHERE sku = 'SKU-007'), 3, 249.99, 749.97),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-006'), (SELECT id FROM products WHERE sku = 'SKU-016'), 6, 199.99, 1199.94),

-- SO-2025-007 (Metro Industries)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-007'), (SELECT id FROM products WHERE sku = 'SKU-010'), 4, 129.99, 519.96),
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-007'), (SELECT id FROM products WHERE sku = 'SKU-018'), 8, 89.99, 719.92),

-- SO-2025-008 (Coastal Enterprises)
((SELECT id FROM sales_orders WHERE order_number = 'SO-2025-008'), (SELECT id FROM products WHERE sku = 'SKU-014'), 4, 179.99, 719.96);

-- Insert purchase order items (linking products to purchase orders)
INSERT INTO order_items (purchase_order_id, product_id, quantity, unit_price, total) VALUES
-- PO-2025-001 (TechSupply Co)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-001'), (SELECT id FROM products WHERE sku = 'SKU-001'), 15, 120.00, 1800.00),

-- PO-2025-002 (Component Masters)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-002'), (SELECT id FROM products WHERE sku = 'SKU-002'), 20, 90.00, 1800.00),
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-002'), (SELECT id FROM products WHERE sku = 'SKU-003'), 10, 45.00, 450.00),

-- PO-2025-003 (Electronics Wholesale)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-003'), (SELECT id FROM products WHERE sku = 'SKU-004'), 50, 22.00, 1100.00),
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-003'), (SELECT id FROM products WHERE sku = 'SKU-005'), 8, 50.00, 400.00),

-- PO-2025-004 (Office Solutions Pro)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-004'), (SELECT id FROM products WHERE sku = 'SKU-006'), 5, 180.00, 900.00),
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-004'), (SELECT id FROM products WHERE sku = 'SKU-008'), 2, 35.00, 70.00),

-- PO-2025-005 (Industrial Supplies Inc)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-005'), (SELECT id FROM products WHERE sku = 'SKU-007'), 8, 150.00, 1200.00),

-- PO-2025-006 (Global Components Ltd)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-006'), (SELECT id FROM products WHERE sku = 'SKU-009'), 25, 45.00, 1125.00),
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-006'), (SELECT id FROM products WHERE sku = 'SKU-010'), 7, 75.00, 525.00),

-- PO-2025-007 (Premium Parts Co)
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-007'), (SELECT id FROM products WHERE sku = 'SKU-016'), 4, 120.00, 480.00),
((SELECT id FROM purchase_orders WHERE order_number = 'PO-2025-007'), (SELECT id FROM products WHERE sku = 'SKU-017'), 2, 180.00, 360.00);