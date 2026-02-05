# Actualités & Gestion de Formations - OFPPT

A secure Node.js application for managing news/announcements and training information for OFPPT institutions.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing by modifying the files in `public/` and `server.js`. The server auto-reloads as you edit.

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/actualites-app.git
cd actualites-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Environment Variables

Create a `.env` file with:

```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=your-256-bit-random-secret
SESSION_SECRET=your-256-bit-random-secret
ADMIN_PASSWORD=your-strong-password
FRONTEND_ORIGIN=http://localhost:3000
```

## Features

- **Secure Authentication** - bcrypt password hashing + JWT tokens
- **Express.js Backend** - RESTful API with session management
- **Admin Dashboard** - Manage news and content
- **File Upload** - Secure media management
- **CORS Support** - Configurable for development/production
- **Docker Ready** - Production deployment with Docker

## Available Scripts

```bash
npm run dev      # Start with hot-reload
npm start        # Start production server
```

## Production Deployment

### Environment Validation

In production, the server validates required environment variables:
- `JWT_SECRET` - 256-bit random value
- `SESSION_SECRET` - 256-bit random value
- `ADMIN_PASSWORD` - Strong password
- `FRONTEND_ORIGIN` - Your domain

### Docker

```bash
# Build image
docker build -t actualites-app:latest .

# Run container
docker run -d \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -e SESSION_SECRET=your-secret \
  -e ADMIN_PASSWORD=your-password \
  -e FRONTEND_ORIGIN=https://your-domain.com \
  -p 3000:3000 \
  actualites-app:latest
```

## API Documentation

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### Protected Endpoints

Include token in header:
```javascript
headers: {
  'Authorization': 'Bearer <token>'
}
```

## Security

- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ JWT tokens with 8-hour expiration
- ✅ HttpOnly cookies in production
- ✅ CORS protection
- ✅ Environment-based secret validation
- ✅ No hardcoded credentials

See [SECURITY.md](SECURITY.md) for detailed security information.

## Project Structure

```
actualites-app/
├── public/              # Frontend files
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   ├── css/
│   ├── js/
│   └── images/
├── uploads/             # User uploads
├── server.js            # Main server
├── db.js                # Database logic
├── package.json
├── .env.example
└── Dockerfile
```

## Troubleshooting

**Port already in use?**
```bash
# Find and kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Environment variables not loading?**
- Ensure `.env` file exists in root
- Restart development server
- Check variable names are correct

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Documentation

- [SECURITY.md](SECURITY.md) - Security policies
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## License

MIT - See [LICENSE](LICENSE) file for details.

## Learn More

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)

---

**Status**: ✅ Production Ready  
**Last Updated**: February 5, 2026
