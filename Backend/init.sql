--Script para poblar la base de datos con algunos datos basicos

INSERT INTO payment_method (name) VALUES 
('Visa'),
('MasterCard'),
('MP'),
('Efectivo'),
('Transferencia Bancaria'),
('PayPal');

INSERT INTO transaction_status (name) VALUES 
('Pending'),
('completed'),
('refunded');

INSERT INTO state (value) VALUES
('pending'),
('in process'),
('completed');