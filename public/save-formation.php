<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer la requête OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Fichier data.js
$dataFile = 'js/data.js';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = file_get_contents('php://input');
    $formation = json_decode($input, true);

    if ($formation === null) {
        echo json_encode([
            'success' => false,
            'error'   => 'Données JSON invalides'
        ]);
        exit;
    }

    // Lire le fichier data.js existant
    if (!file_exists($dataFile)) {
        echo json_encode([
            'success' => false,
            'error'   => 'Fichier data.js introuvable'
        ]);
        exit;
    }

    $content = file_get_contents($dataFile);

    // Extraire le tableau FILIERES
    if (preg_match('/window\.FILIERES\s*=\s*(\[.*?\]);/s', $content, $matches)) {

        $filieresJSON = $matches[1];
        $filieres = json_decode($filieresJSON, true);

        if ($filieres === null) {
            echo json_encode([
                'success' => false,
                'error'   => 'Impossible de parser FILIERES'
            ]);
            exit;
        }

        // Vérifier si la formation existe déjà
        $slugExists = false;

        foreach ($filieres as $index => $f) {
            if ($f['slug'] === $formation['slug']) {
                $filieres[$index] = $formation; // Mise à jour
                $slugExists = true;
                break;
            }
        }

        // Ajouter si non existante
        if (!$slugExists) {
            $filieres[] = $formation;
        }

        // Reformater le JSON
        $newFilieresJSON = json_encode(
            $filieres,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        // Reconstruire le fichier data.js
        $newContent = preg_replace(
            '/window\.FILIERES\s*=\s*\[.*?\];/s',
            'window.FILIERES = ' . $newFilieresJSON . ';',
            $content
        );

        // Sauvegarder
        if (file_put_contents($dataFile, $newContent)) {
            echo json_encode([
                'success' => true,
                'message' => 'Formation ajoutée avec succès',
                'slug'    => $formation['slug']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error'   => 'Erreur d\'écriture'
            ]);
        }

    } else {
        echo json_encode([
            'success' => false,
            'error'   => 'Structure FILIERES introuvable'
        ]);
    }

} else {
    echo json_encode([
        'success' => false,
        'error'   => 'Méthode non autorisée'
    ]);
}
