<?php
header('Content-Type: application/json');
$jsonFile = __DIR__ . '/data.json';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (file_exists($jsonFile)) {
        echo file_get_contents($jsonFile);
    } else {
        echo json_encode(["error" => "Data file not found"]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (file_exists($jsonFile)) {
        $products = json_decode(file_get_contents($jsonFile), true);

        if (isset($input['id']) && isset($input['quantity'])) {
            foreach ($products as &$p) {
                if ($p['id'] == $input['id']) {
                    $p['quantity'] = $input['quantity'];
                    $p['status'] = $p['quantity'] <= 0 ? 'Out of Stock' : ($p['quantity'] <= $p['reorderLevel'] ? 'Low Stock' : 'In Stock');
                }
            }
            file_put_contents($jsonFile, json_encode($products, JSON_PRETTY_PRINT));
            echo json_encode(["success" => true, "message" => "Stock updated successfully"]);
            exit;
        }
    }
    echo json_encode(["success" => false, "message" => "Failed to update"]);
}
?>