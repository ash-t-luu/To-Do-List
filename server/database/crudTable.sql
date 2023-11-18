CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    username VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(200),
    user_id UUID
);

