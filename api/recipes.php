<?php
/**
 * Recipe API - STRATO Hosting Backend
 * 
 * Deploy this file to your STRATO hosting at: /api/recipes.php
 * 
 * Database Setup:
 * 1. Create a database named 'recipe'
 * 2. Create table:
 *    CREATE TABLE recipes (
 *      id INT AUTO_INCREMENT PRIMARY KEY,
 *      title VARCHAR(255) NOT NULL,
 *      description TEXT,
 *      ingredients JSON,
 *      steps JSON,
 *      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *    );
 */

// CORS Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://recipe.dollart.cloud');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database configuration
$db_host = 'database-5020899184.webspace-host.com';
$db_user = 'dbu1287240';      // STRATO database user
$db_pass = 'Sn4ckbar230576@'; // Replace with your STRATO database password
$db_name = 'dbs15885764';

// Connect to database
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    if ($request_method === 'GET') {
        // Get all recipes
        $result = $conn->query("SELECT * FROM recipes ORDER BY created_at DESC");
        
        if (!$result) {
            throw new Exception("Database query failed: " . $conn->error);
        }
        
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $row['ingredients'] = json_decode($row['ingredients'], true);
            $row['steps'] = json_decode($row['steps'], true);
            $recipes[] = $row;
        }
        
        echo json_encode($recipes);
    } 
    elseif ($request_method === 'POST') {
        // Create new recipe
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['title'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required']);
            exit;
        }
        
        $title = $conn->real_escape_string($input['title']);
        $description = $conn->real_escape_string($input['description'] ?? '');
        $ingredients = json_encode($input['ingredients'] ?? []);
        $steps = json_encode($input['steps'] ?? []);
        
        $sql = "INSERT INTO recipes (title, description, ingredients, steps) 
                VALUES ('$title', '$description', '$ingredients', '$steps')";
        
        if (!$conn->query($sql)) {
            throw new Exception("Insert failed: " . $conn->error);
        }
        
        http_response_code(201);
        echo json_encode([
            'id' => $conn->insert_id,
            'message' => 'Recipe created successfully'
        ]);
    }
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
} 
catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>
