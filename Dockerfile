# Dockerfile - multi-stage, production-ready
# Stage 1 : dependencies install
FROM node:18-alpine AS builder
WORKDIR /app

# install only production dependencies (use package-lock if present)
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2 : runtime
FROM node:18-alpine AS runtime
WORKDIR /app

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# copy app sources
COPY . .

# ensure uploads directory exists and owned by appuser
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app/uploads

USER appuser

ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Simple healthcheck (curl inside container)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD [ "sh", "-c", "wget -qO- http://localhost:3000/ || exit 1" ]

# Start
CMD ["node", "server.js"]
