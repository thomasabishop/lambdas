CREATE TABLE time_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity_type VARCHAR(255) NOT NULL,
        \`start\` DATETIME NOT NULL,
        \`end\` DATETIME NOT NULL,
        duration DECIMAL(10, 2),
        description VARCHAR(255),
        UNIQUE KEY unique_time_entry (activity_type, \`start\`, \`end\`)
    )
