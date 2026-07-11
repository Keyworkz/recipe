# Deployment Guide: STRATO Hosting Basic → recipe.dollart.cloud

## Prerequisites

- STRATO Hosting Basic account with domain: recipe.dollart.cloud
- SFTP/FTP access configured
- MariaDB database created in STRATO control panel

## Step 1: Prepare Your Application

```bash
npm run build
```

This creates the `dist/` folder with all production files.

## Step 2: Verify Database Credentials in STRATO Panel

Note down your database details:

- **Database Name**: `dbs15885764`
- **Database User**: `dbu1287240`
- **Database Password**: (provided by STRATO / your chosen password)
- **Database Host**: `database-5020899184.webspace-host.com`

## Step 3: Connect via SFTP

**Connection Details:**

- **Host**: `sftp.strato.de`
- **Username**: Your STRATO customer ID
- **Password**: Your STRATO password
- **Port**: 22

**Using Terminal:**

```bash
sftp -P 22 your-customer-id@sftp.strato.de
cd public_html  # or httpdocs
```

**Using GUI Client** (Cyberduck, FileZilla, etc.):

- Add new connection with above details
- Navigate to public_html or httpdocs folder

## Step 4: Upload Frontend Files

1. Delete existing contents of `public_html/` or `httpdocs/`
2. Upload all files from your local `dist/` folder to `public_html/`

**Directory structure should be:**

```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── [other files]
```

## Step 5: Configure API Endpoints

For STRATO Hosting Basic, you have two options:

### Option A: Use localStorage (Simple, No Backend Required)

Current setup uses browser localStorage - data persists locally but not across devices/browsers.

### Option B: Add a Simple PHP API (Recommended)

Create `api/recipes.php` in your hosting:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$db_host = 'localhost';
$db_user = 'your-db-user';
$db_pass = 'your-db-pass';
$db_name = 'your-db-name';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$request = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($request === 'GET') {
    $result = $conn->query("SELECT * FROM recipes ORDER BY created_at DESC");
    $recipes = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($recipes);
}

if ($request === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO recipes (title, description, ingredients, steps) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['title'], $data['description'], json_encode($data['ingredients']), json_encode($data['steps']));
    $stmt->execute();
    echo json_encode(['id' => $conn->insert_id]);
    $stmt->close();
}

$conn->close();
?>
```

## Step 6: Test Your Deployment

1. Visit **https://recipe.dollart.cloud**
2. Verify the app loads without errors
3. Test adding a recipe
4. Check browser console (F12) for any errors

## Step 7: Enable HTTPS

STRATO usually provides free SSL. Configure it in:

- STRATO Control Panel → SSL Certificates
- Enable "Automatic Redirect from HTTP to HTTPS"

## Troubleshooting

**White page / App won't load:**

- Check that all files uploaded to public_html
- Verify index.html is in the root

**CSS/JS not loading:**

- Check file paths in browser Network tab (F12)
- May need to update `VITE_API_URL` in build

**Database connection issues:**

- Verify credentials in STRATO panel
- Ensure MariaDB service is running

## Next Steps (If You Upgrade)

If you upgrade to STRATO VPS or App Hosting:

- Use the Docker setup with docker-compose.yaml
- Deploy with:
  ```bash
  docker-compose up -d
  ```

---

**Domain**: https://recipe.dollart.cloud  
**Deployment Date**: July 11, 2026
