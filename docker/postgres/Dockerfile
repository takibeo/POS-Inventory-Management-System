FROM postgres:15-alpine

# Default envs (can be overridden by docker-compose or runtime)
ENV POSTGRES_DB=pos_inventory
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy optional initialization scripts (create schemas, seed data). Place .sql/.sh files in docker/postgres/initdb/
COPY initdb/ /docker-entrypoint-initdb.d/

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD pg_isready -U "$POSTGRES_USER" || exit 1
